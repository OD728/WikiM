// ==UserScript==
// @name         Wikipedia Desktop to Mobile Redirect (Improved)
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @author       RM
// @description  Redirect desktop Wikipedia to mobile version with better error handling, URL parsing, and update checks.
// @homepageURL  https://github.com/ODRise/WikiM
// @match        https://*.wikipedia.org/*
// @exclude      https://*.m.wikipedia.org/*
// @exclude      https://m.wikipedia.org/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_notification
// @downloadURL  https://raw.githubusercontent.com/ODRise/WikiM/main/wikipedia-desktop-to-mobile-redirect.user.js
// @updateURL    https://raw.githubusercontent.com/ODRise/WikiM/main/wikipedia-desktop-to-mobile-redirect.user.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = "Wikipedia Desktop to Mobile Redirect (Improved)";

    const DEFAULT_SETTINGS = {
        debug: false,
        // Future settings can be added here, e.g., temporarily disable redirect
    };
    let userSettings = { ...DEFAULT_SETTINGS };
    let menuCommands = [];

    // --- GM Helper Functions ---
    const _GM = {
        getValue: typeof GM !== 'undefined' && GM.getValue ? GM.getValue : GM_getValue,
        setValue: typeof GM !== 'undefined' && GM.setValue ? GM.setValue : GM_setValue,
        registerMenuCommand: typeof GM !== 'undefined' && GM.registerMenuCommand ? GM.registerMenuCommand : GM_registerMenuCommand,
        xmlHttpRequest: typeof GM !== 'undefined' && GM.xmlHttpRequest ? GM.xmlHttpRequest : GM_xmlhttpRequest,
        info: typeof GM !== 'undefined' && GM.info ? GM.info : (typeof GM_info !== 'undefined' ? GM_info : null),
        notification: typeof GM !== 'undefined' && GM.notification ? GM.notification : (typeof GM_notification !== 'undefined' ? GM_notification : null),
    };

    // --- Logging ---
    function log(level, ...args) {
        if (level === 'error' || level === 'warn' || userSettings.debug) {
            console[level](`[${SCRIPT_NAME}]`, ...args);
        }
    }

    // --- Settings Management ---
    async function loadUserSettings() {
        try {
            const storedSettings = await _GM.getValue('settings', DEFAULT_SETTINGS);
            userSettings = { ...DEFAULT_SETTINGS, ...storedSettings };
            // Validate settings types if necessary
            if (typeof userSettings.debug !== 'boolean') {
                userSettings.debug = DEFAULT_SETTINGS.debug;
            }
            await _GM.setValue('settings', userSettings); // Save potentially corrected settings
            log('debug', 'User settings loaded:', userSettings);
        } catch (error) {
            log('error', 'Failed to load user settings:', error);
            userSettings = { ...DEFAULT_SETTINGS };
        }
    }

    async function updateSetting(key, value) {
        userSettings[key] = value;
        try {
            await _GM.setValue('settings', userSettings);
            log('debug', `Setting '${key}' updated to '${value}'`);
            createMenu(); // Rebuild menu to reflect changes
        } catch (error) {
            log('error', `Failed to update setting '${key}':`, error);
        }
    }

    // --- Version Comparison ---
    function compareVersions(v1, v2) {
        const parts1 = String(v1).split('.').map(Number);
        const parts2 = String(v2).split('.').map(Number);
        const len = Math.max(parts1.length, parts2.length);
        for (let i = 0; i < len; i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
        }
        return 0;
    }

    // --- Update Checker ---
    async function checkForOnlineUpdates() {
        log('debug', 'Checking for online updates...');
        if (!_GM.info || !_GM.info.script) {
            log('error', 'GM_info is not available. Cannot check for updates.');
            if (_GM.notification) _GM.notification({ text: 'Update check failed: GM_info not available.', title: SCRIPT_NAME, timeout: 5000 });
            return;
        }

        const currentVersion = _GM.info.script.version;
        const updateURL = _GM.info.script.updateURL || _GM.info.script.downloadURL;

        if (!updateURL) {
            log('warn', 'Update URL not defined in script metadata.');
            if (_GM.notification) _GM.notification({ text: 'Update URL not defined.', title: SCRIPT_NAME + ' - Update Error', timeout: 7000 });
            return;
        }

        _GM.xmlHttpRequest({
            method: 'GET',
            url: updateURL + '?_=' + Date.now(), // Cache buster
            headers: { 'Cache-Control': 'no-cache' },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const remoteVersionMatch = response.responseText.match(/@version\s+([\w\d.-]+)/);
                    if (remoteVersionMatch && remoteVersionMatch[1]) {
                        const remoteVersion = remoteVersionMatch[1].trim();
                        log('debug', `Current version: ${currentVersion}, Remote version: ${remoteVersion}`);
                        if (compareVersions(remoteVersion, currentVersion) > 0) {
                            if (_GM.notification) {
                                _GM.notification({
                                    text: `A new version (${remoteVersion}) of ${SCRIPT_NAME} is available! Click to install.`,
                                    title: `${SCRIPT_NAME} - Update Available`,
                                    onclick: () => { window.open(_GM.info.script.downloadURL || updateURL, '_blank'); },
                                    timeout: 0
                                });
                            } else {
                                alert(`${SCRIPT_NAME} Update: New version ${remoteVersion} available.`);
                            }
                        } else {
                            if (_GM.notification) _GM.notification({ text: `${SCRIPT_NAME} (v${currentVersion}) is up to date.`, title: `${SCRIPT_NAME} - Up to Date`, timeout: 5000 });
                            else alert(`${SCRIPT_NAME} is up to date.`);
                        }
                    } else {
                        log('warn', 'Could not parse @version from remote script.');
                         if (_GM.notification) _GM.notification({ text: 'Could not determine remote version.', title: `${SCRIPT_NAME} - Update Check Failed`, timeout: 7000 });
                    }
                } else {
                    log('error', `Error fetching update: ${response.status} ${response.statusText}`);
                     if (_GM.notification) _GM.notification({ text: `Error fetching update: ${response.statusText}`, title: `${SCRIPT_NAME} - Update Check Failed`, timeout: 7000 });
                }
            },
            onerror: function(error) {
                log('error', `Network error during update check: ${JSON.stringify(error)}`);
                 if (_GM.notification) _GM.notification({ text: 'Network error during update check. See console.', title: `${SCRIPT_NAME} - Update Check Failed`, timeout: 7000 });
            }
        });
    }

    // --- Menu Creation ---
    function createMenu() {
        // Unregister old commands if GM.unregisterMenuCommand is available (Tampermonkey specific)
        if (typeof GM !== 'undefined' && GM.unregisterMenuCommand) {
            menuCommands.forEach(cmdId => {
                try { GM.unregisterMenuCommand(cmdId); } catch (e) { log('debug', 'Failed to unregister menu command:', e); }
            });
        }
        menuCommands = []; // Clear stored command IDs

        // Toggle Debug Mode
        const debugCmdId = _GM.registerMenuCommand(
            `${userSettings.debug ? '✅' : '⚪'} Debug Mode`,
            () => updateSetting('debug', !userSettings.debug)
        );
        if (debugCmdId) menuCommands.push(debugCmdId);

        // Check for Updates
        const updateCmdId = _GM.registerMenuCommand(
            'Check for Updates',
            checkForOnlineUpdates
        );
        if (updateCmdId) menuCommands.push(updateCmdId);

        log('debug', 'Menu created/updated.');
    }

    // --- Main Redirect Logic ---
    function performRedirect() {
        // Exit early if already on mobile (additional safety check)
        if (window.location.hostname.includes('.m.wikipedia.org') ||
            window.location.hostname === 'm.wikipedia.org') {
            log('debug', 'Already on mobile domain. No redirect needed.');
            return;
        }

        // Exit if this script has already run (prevent double execution)
        if (window.wikipediaMobileRedirectExecuted) {
            log('debug', 'Redirect script already executed. Skipping.');
            return;
        }
        window.wikipediaMobileRedirectExecuted = true;

        try {
            const currentURLInstance = new URL(window.location.href); // Use a different name
            const hostname = currentURLInstance.hostname;

            const desktopPattern = /^([a-z]{2,3}(?:-[a-z]{2,4})?|www)\.wikipedia\.org$/i;
            const match = hostname.match(desktopPattern);

            if (!match) {
                log('debug', 'Not a standard Wikipedia domain for redirect:', hostname);
                return;
            }

            const langCode = match[1];
            let mobileHostname;

            if (langCode.toLowerCase() === 'www') {
                mobileHostname = 'm.wikipedia.org';
            } else {
                mobileHostname = `${langCode}.m.wikipedia.org`;
            }

            const mobileURLInstance = new URL(currentURLInstance); // Use a different name
            mobileURLInstance.hostname = mobileHostname;

            if (mobileURLInstance.href !== currentURLInstance.href) {
                log('info', `Redirecting: ${currentURLInstance.href} → ${mobileURLInstance.href}`);
                window.location.replace(mobileURLInstance.href);
            } else {
                log('debug', 'Current URL is already the target mobile URL. No redirect performed.');
            }

        } catch (error) {
            log('error', 'Primary redirect method failed:', error);
            // Fallback to original simple method if URL parsing fails
            try {
                log('debug', 'Attempting fallback redirect method.');
                const currentRawURL = window.location.href; // Use raw string for regex
                const mobileFallbackURL = currentRawURL.replace(
                    /\/\/([a-z]{2,3}(?:-[a-z]{2,4})?)\.wikipedia\.org/i,
                    '//$1.m.wikipedia.org'
                );

                if (mobileFallbackURL !== currentRawURL) { // Ensure it's different before redirecting
                    // Additional check for www to m fallback
                    let finalFallbackURL = mobileFallbackURL;
                    if (currentRawURL.includes('//www.wikipedia.org') && !mobileFallbackURL.includes('//m.wikipedia.org')) {
                        finalFallbackURL = currentRawURL.replace('//www.wikipedia.org', '//m.wikipedia.org');
                    }

                    if (finalFallbackURL !== currentRawURL) {
                        log('info', `Redirecting (fallback): ${currentRawURL} → ${finalFallbackURL}`);
                        window.location.replace(finalFallbackURL);
                    } else {
                        log('debug', 'Fallback URL is same as current. No redirect.');
                    }
                } else {
                     log('debug', 'Fallback URL is same as current (initial regex). No redirect.');
                }
            } catch (fallbackError) {
                log('error', 'Fallback redirect method also failed:', fallbackError);
            }
        }
    }

    // --- Initialization ---
    async function initialize() {
        await loadUserSettings();
        createMenu();
        performRedirect();
        log('debug', 'Script initialized.');
    }

    initialize().catch(err => {
        console.error(`[${SCRIPT_NAME}] Critical initialization error:`, err);
    });

})();