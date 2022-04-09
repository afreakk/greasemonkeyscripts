// ==UserScript==
// @name         remove ads from outlook
// @version      1.0.0
// @author       afreakk
// @match        https://outlook.live.com/mail/*
// ==/UserScript==

setInterval(() => {
    document
        .querySelectorAll('.tTgHIN4ds5wb34dD3UQq')
        .forEach((e) => e.remove());
}, 1000);
