// ==UserScript==
// @name         Skip youtube ads
// @version      1.0.0
// @description  Skips YouTube ads automatically
// @author       afreakk
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/subscribe_embed?*
// ==/UserScript==
const skipAd = () => {
    document
        .querySelectorAll('.videoAdUiSkipButton,.ytp-ad-skip-button')
        .forEach((b) => b.click());
    if (document.querySelector('.ad-showing')) {
        document.querySelectorAll('video').forEach((v) => {
            Number.isNaN(v.duration) || (v.currentTime = v.duration);
        });
    }
    document
        .querySelectorAll('.ytd-display-ad-renderer#dismissible')
        .forEach((el) =>
            // remove the ad video in top left of recommended
            el?.parentElement?.parentElement?.parentElement?.remove?.()
        );
    document
        .querySelectorAll(
            'ytd-promoted-sparkles-web-renderer, #player-ads, #masthead-ad, ytd-compact-promoted-video-renderer'
        )
        .forEach((el) => el.remove());
    document
        .querySelectorAll('.ytd-mealbar-promo-renderer#dismiss-button')
        .forEach((el) => el.click());
};
if (!window.skipAdIntervalID) {
    window.skipAdIntervalID = setInterval(skipAd, 333);
}
