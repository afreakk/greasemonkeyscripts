// ==UserScript==
// @name         BankID WebAuthn Fix
// @match        *://app.bankid.no/*
// @run-at       document-start
// ==/UserScript==

// WORKAROUND: BankID hangs on loading in qutebrowser because it detects
// WebAuthn support (PublicKeyCredential exists) but the auth flow fails.
// Deleting PublicKeyCredential forces BankID to use the traditional auth flow.
// This may become unnecessary if BankID or QtWebEngine fixes the issue.
delete window.PublicKeyCredential;
