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
        .querySelectorAll(
            '.videoAdUiSkipButton,.ytp-ad-skip-button,.ytp-ad-skip-button-modern'
        )
        .forEach((b) => b.click());
    if (document.querySelector('.ad-showing')) {
        document.querySelectorAll('video').forEach((v) => {
            Number.isNaN(v.duration) || (v.currentTime = v.duration);
        });
    }
    // this is the interspersed ads around the recommended/related videos
    for (const el of document.getElementsByTagName('ytd-ad-slot-renderer')) {
        if (
            el?.parentElement?.parentElement?.tagName ===
            'YTD-RICH-ITEM-RENDERER'
        ) {
            el?.parentElement?.parentElement?.remove();
        } else {
            el?.remove();
        }
    }
    // in youtube-shorts we get some ads, try remove them
    // (this ain't working, freezes the whole thing)
    // for (const el of document.getElementsByClassName('ad-created')) {
    //     if (
    //         el?.parentElement?.parentElement?.parentElement?.parentElement
    //             ?.parentElement?.parentElement?.tagName ===
    //         'YTD-REEL-VIDEO-RENDERER'
    //     ) {
    //         el?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.remove();
    //     }
    // }

    // in related videos, this is the ad on top
    document.getElementById('player-ads')?.remove();
    document
        .querySelectorAll('.ytd-mealbar-promo-renderer#dismiss-button')
        .forEach((el) => el.click());
};
if (!window.skipAdIntervalID) {
    window.skipAdIntervalID = setInterval(skipAd, 333);
}
