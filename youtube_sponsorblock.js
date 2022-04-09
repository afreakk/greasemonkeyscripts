// ==UserScript==
// @name         Sponsorblock
// @version      1.0.0
// @description  Skip sponsor segments automatically
// @author       afreakk
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/subscribe_embed?*
// ==/UserScript==
const tryFetchSkipSegments = (videoID) =>
    fetch(`https://sponsor.ajay.app/api/skipSegments?videoID=${videoID}`)
        .then((r) => r.json())
        .then((rJson) =>
            rJson.filter((a) => a.actionType === 'skip').map((a) => a.segment)
        )
        .catch(
            (e) =>
                console.log(
                    `Sponsorblock: failed fetching skipSegments for ${videoID}, reason: ${e}`
                ) || []
        );

const skipSegments = async () => {
    const videoID = new URL(document.location).searchParams.get('v');
    if (!videoID) {
        return;
    }
    const key = `segmentsToSkip-${videoID}`;
    window[key] = window[key] || (await tryFetchSkipSegments(videoID));
    for (const v of document.querySelectorAll('video')) {
        if (Number.isNaN(v.duration)) continue;
        for (const [start, end] of window[key]) {
            if (v.currentTime < end && v.currentTime > start) {
                v.currentTime = end;
                return console.log(`Sponsorblock: skipped video to ${end}`);
            }
        }
    }
};
if (!window.skipSegmentsIntervalID) {
    window.skipSegmentsIntervalID = setInterval(skipSegments, 1000);
}
