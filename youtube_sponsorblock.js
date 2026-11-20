// ==UserScript==
// @name         Sponsorblock
// @version      1.2.0
// @description  Skip sponsor segments automatically
// @author       afreakk
// @author          vongaisberg
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/subscribe_embed?*
// ==/UserScript==
const delay = 1000;
const retryAfterFailureMs = 30000;

const tryFetchSkipSegments = async (videoID) => {
    try {
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(videoID));
        const prefix = [...new Uint8Array(digest)]
            .map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 4);
        const r = await fetch(`https://sponsor.ajay.app/api/skipSegments/${prefix}`);
        if (r.status === 404) return []; // no video with this hash prefix has segments
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const entry = (await r.json()).find((e) => e.videoID === videoID);
        return entry ? entry.segments.filter((a) => a.actionType === 'skip').map((a) => a.segment) : [];
    } catch (e) {
        console.log(`Sponsorblock: failed fetching skipSegments for ${videoID}, reason: ${e}`);
        return null;
    }
};

// Ask the player first: Pane reuses its embed iframe and switches videos
// without changing its /embed/ID URL, so the URL can name an old video.
// Fall back to /watch?v=ID or /embed/ID.
const currentVideoID = () => {
    const player = document.getElementById('movie_player');
    const fromPlayer = player && typeof player.getVideoData === 'function' && player.getVideoData().video_id;
    if (fromPlayer) return fromPlayer;
    const url = new URL(document.location);
    const embed = url.pathname.match(/^\/embed\/([\w-]{11})/);
    return embed ? embed[1] : url.searchParams.get('v');
};

// Pane plays the video in an embed iframe and keeps re-syncing the hidden
// #movie_player video to it, so seeking that one is useless. The copy of this
// script running inside the embed frame does the skipping instead.
// In Pane's fallback mode (pn_fallback) the native player is the real one.
const paneActive = () => {
    if (window.top !== window.self) return false;
    const wrapper = document.getElementById('pn_playerWrapper');
    return !!wrapper && wrapper.offsetWidth > 0 && !document.body.classList.contains('pn_fallback');
};

const skipSegments = async () => {
    const videoID = currentVideoID();
    if (!videoID || paneActive()) {
        return;
    }
    const key = `segmentsToSkip-${videoID}`;
    const failedKey = `segmentsFailedAt-${videoID}`;
    if (!window[key]) {
        if (Date.now() - (window[failedKey] || 0) < retryAfterFailureMs) return;
        const segments = await tryFetchSkipSegments(videoID);
        if (!segments) {
            window[failedKey] = Date.now();
            return;
        }
        window[key] = segments;
    }
    for (const v of document.querySelectorAll('video')) {
        if (Number.isNaN(v.duration)) continue;
        for (const [start, end] of window[key]) {
            if (v.currentTime < end && v.currentTime >= start) {
                console.log(`Sponsorblock: skipped video @${v.currentTime} from ${start} to ${end}`);
                v.currentTime = end;
                return
            }
            const timeToSponsor = (start - v.currentTime) / v.playbackRate;
            if (v.currentTime < start && timeToSponsor < (delay / 1000)) {
                console.log(`Sponsorblock: Almost at sponsor segment, sleep for ${timeToSponsor * 1000}ms`);
                setTimeout(skipSegments, timeToSponsor * 1000);
            }
        }
    }
};
if (!window.skipSegmentsIntervalID) {
    window.skipSegmentsIntervalID = setInterval(skipSegments, delay);
}
