// ==UserScript==
// @name         remove ads from reddit
// @version      1.0.0
// @author       afreakk
// @match        *://*.reddit.com/*
// ==/UserScript==

setInterval(() => {
    // promoted posts has this class
    document.querySelectorAll('.promotedlink').forEach((e) => e.remove());
    // nagging about confirming email has this class
    document
        .querySelectorAll('.kEQVd8aneM1tVkcIKUyDT')
        .forEach((e) => e.remove());
}, 1000);
