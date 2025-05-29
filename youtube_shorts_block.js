// ==UserScript==
// @name         YouTube Shorts Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Blocks the YouTube shorts from appearing.
// @author       Aiden Charles
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    setInterval(function () {
        document
            .querySelectorAll('ytd-reel-shelf-renderer')
            .forEach((x) => x.remove());
        document
            .querySelectorAll('ytd-rich-shelf-renderer')
            .forEach((x) => x.remove());
        document
            .querySelectorAll("a[title='Shorts']")
            .forEach((x) => x.remove());
    }, 1000);
})();
