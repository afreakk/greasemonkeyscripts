// ==UserScript==
// @name         Skip youtube ads
// @version      1.0.0
// @description  Speed up and skip YouTube ads automatically
// @author       afreakk
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/subscribe_embed?*
// ==/UserScript==
const skipAd = () => {
    document
        .querySelectorAll('.videoAdUiSkipButton,.ytp-ad-skip-button')
        .forEach((b) => b.click());
    if (document.querySelector('.ad-showing')) {
        document
            .querySelectorAll('video')
            .forEach((v) => (v.currentTime = v.duration));
    }
    document
        .querySelectorAll('#player-ads')
        .forEach((sidebarAd) => sidebarAd.remove());
    document
        .querySelectorAll('#masthead-ad')
        .forEach((startPageTopAd) => startPageTopAd.remove());
};
if (!window.skipAdIntervalID) {
    window.skipAdIntervalID = setInterval(skipAd, 50);
}
