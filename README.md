# Wikipedia Desktop to Mobile Redirect (Improved)

An enhanced userscript that automatically redirects desktop Wikipedia pages to their mobile versions for better readability and faster loading. Includes settings, an update checker, and improved reliability.

## 🎯 Features

-   **Smart URL Detection**: Handles all Wikipedia domains including complex language codes (e.g., `zh-cn.wikipedia.org`).
-   **Safe Redirects**: Prevents infinite redirect loops and double execution.
-   **Comprehensive Coverage**: Works with all Wikipedia language editions and subdomains.
-   **Parameter Preservation**: Maintains all URL parameters, anchors, and query strings.
-   **Special Domain Handling**: Properly handles `www.wikipedia.org` → `m.wikipedia.org`.
-   **Error Recovery**: Robust fallback mechanisms with graceful degradation.
-   **Configurable Debug Mode**: Console logging for troubleshooting and verification, toggleable via menu.
-   **Memory Safe**: Prevents memory leaks and resource conflicts.
-   **Update Checker**: Menu option to manually check for script updates.
-   **Settings Management**: Uses Greasemonkey API for persistent settings.

## 🚀 Installation

1.  **Install a userscript manager** (if you don't have one already):
    * **Chrome/Edge**: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    * **Firefox**: [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
    * **Safari**: [Tampermonkey](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2.  **Click the link below to install the script**:
    * [**Install Wikipedia Desktop to Mobile Redirect (Improved)**](https://raw.githubusercontent.com/ODRise/WikiM/main/wikipedia-desktop-to-mobile-redirect.user.js)

3.  Your userscript manager should prompt you to confirm the installation.
4.  Once installed, the script should be automatically enabled.
5.  Visit any desktop Wikipedia page to test the redirect.

## ✨ Improvements Over Original

### 🛡️ **Enhanced Safety & Reliability**
-   Prevents double execution with an execution flag.
-   Additional mobile domain detection to avoid redirect loops.
-   Comprehensive error handling with try-catch blocks and fallback mechanisms.
-   Safe URL validation before attempting redirects.

### 🔧 **Better URL Handling**
-   Improved regex patterns that handle language codes with hyphens (e.g., `zh-cn.wikipedia.org`).
-   Robust URL parsing using the `URL` constructor to preserve all URL components.
-   Special case handling for `www.wikipedia.org` redirects.
-   Query parameter preservation maintains search terms, anchors, and other URL data.

### 🎯 **Enhanced Matching & Control**
-   More comprehensive exclude rules to prevent running on mobile sites.
-   Domain validation ensures the script is on a standard Wikipedia domain before redirecting.
-   Conditional redirects only occur if the target mobile URL is different from the current URL.
-   Language code validation handles both simple (en, fr) and complex (zh-cn, pt-br) codes.

### 📊 **Debugging & Monitoring**
-   Configurable console logging via Tampermonkey menu to track redirect actions and help with troubleshooting.
-   Error reporting to help diagnose issues in different environments.
-   Redirect confirmation logs successful redirections with before/after URLs (when debug is on).
-   Fallback notifications alert when the primary redirect method fails but the fallback succeeds (when debug is on).

### 🔄 **Fallback Protection**
-   A secondary, simpler regex-based method is used if the primary URL parsing method fails.
-   Graceful degradation ensures the script attempts to work even in edge cases.
-   Error isolation prevents one failure from breaking the entire script.

## 🎛️ Configuration Options

Access settings through the Tampermonkey menu for this script:

-   **Debug Mode**: Toggles detailed console logging for troubleshooting.
    -   `✅ Debug Mode` (Enabled)
    -   `⚪ Debug Mode` (Disabled)
-   **Check for Updates**: Manually triggers a check for a newer version of the script.

*Note: ✅ indicates the current setting is enabled, ⚪ indicates it's disabled. The menu should update immediately to reflect the change.*

## 📋 Supported Wikipedia Domains

The script works with all standard Wikipedia domains including:

-   **Standard language codes**: `en.wikipedia.org`, `fr.wikipedia.org`, `de.wikipedia.org`
-   **Complex language codes**: `zh-cn.wikipedia.org`, `pt-br.wikipedia.org`, `roa-tara.wikipedia.org`
-   **Main portal**: `www.wikipedia.org` (redirects to `m.wikipedia.org`)
-   **All Wikipedia subdomains**: Any valid Wikipedia language edition.

### Redirect Examples

| Original URL                                                     | Redirected URL                                                       |
| :--------------------------------------------------------------- | :------------------------------------------------------------------- |
| `https://en.wikipedia.org/wiki/Example`                          | `https://en.m.wikipedia.org/wiki/Example`                            |
| `https://zh-cn.wikipedia.org/wiki/示例`                        | `https://zh-cn.m.wikipedia.org/wiki/示例`                          |
| `https://www.wikipedia.org/`                                     | `https://m.wikipedia.org/`                                           |
| `https://fr.wikipedia.org/wiki/Exemple?section=1#History`        | `https://fr.m.wikipedia.org/wiki/Exemple?section=1#History`          |

## 🔧 Usage

Once installed, the script works automatically:

1.  **Visit any desktop Wikipedia page** in your browser.
2.  The script will **automatically redirect** to the mobile version if you are not already on it.
3.  It **preserves your location** in the article (including anchors and search parameters).
4.  It **works across all languages** and Wikipedia editions.

### Verification

To verify the script is working:

1.  Visit a desktop Wikipedia page (e.g., `https://en.wikipedia.org/wiki/Example`).
2.  The URL should automatically change to its mobile equivalent (e.g., `https://en.m.wikipedia.org/wiki/Example`).
3.  If you enable "Debug Mode" via the Tampermonkey menu, check the Developer Console (F12) for redirect confirmation messages or other diagnostic information.

## 🖥️ Browser Compatibility

-   **Chrome/Chromium** ✅ Full support
-   **Firefox** ✅ Full support
-   **Edge** ✅ Full support
-   **Safari** ✅ Full support
-   **Mobile Browsers** ✅ Works on mobile (no redirects when already on a mobile domain).

## 📱 Benefits of Mobile Wikipedia

-   **Faster Loading**: Mobile pages are generally lighter and load significantly faster.
-   **Better Mobile Experience**: The layout is optimized for smaller screens and touch interaction.
-   **Reduced Data Usage**: Smaller page sizes can save bandwidth, especially on mobile data.
-   **Improved Readability**: Often features cleaner typography and spacing for on-the-go reading.

## 🐛 Troubleshooting

### Script Not Redirecting
1.  Ensure the userscript manager (e.g., Tampermonkey) is enabled in your browser.
2.  Verify that the script itself is enabled within the userscript manager's dashboard.
3.  Confirm you are visiting a desktop Wikipedia URL (e.g., `en.wikipedia.org`) and not already on a mobile version (`en.m.wikipedia.org`). The script's `@exclude` rules prevent it from running on mobile domains.
4.  Open your browser's developer console (usually F12). Enable "Debug Mode" via the script's Tampermonkey menu to see detailed logs which might indicate why a redirect isn't happening.
5.  Check for conflicts with other extensions or userscripts that might interfere with URL handling.

### Redirect Loops
The script has multiple built-in protections against redirect loops:
-   An execution flag (`window.wikipediaMobileRedirectExecuted`) prevents it from running more than once per page context.
-   It explicitly checks if the current hostname is already a mobile domain and exits early if so.
-   It only performs a `window.location.replace` if the constructed mobile URL is different from the current URL.

If you encounter a loop, please report it as an issue with the specific URL.

### Language-Specific Issues
If certain language editions don't redirect as expected:
1.  Enable "Debug Mode" and check the console logs. Look for messages like "Not a standard Wikipedia desktop domain for redirect".
2.  The domain might use a format not currently captured by the script's `desktopPattern` regex.
3.  Report the specific domain on the GitHub repository so the pattern can be updated if necessary.

## 📝 License

MIT License - feel free to modify and distribute.

## 🤝 Contributing

Found a bug or have an improvement? Feel free to:

-   **Report Issues**: Submit issues with specific Wikipedia URLs that don't work as expected on the [GitHub repository](https://github.com/ODRise/WikiM).
-   **Language Support**: Help test with different Wikipedia language editions and report any inconsistencies.
-   **Feature Requests**: Suggest improvements or new features.
-   **Pull Requests**: Submit code improvements or bug fixes.

### Known Limitations

-   **Non-standard Wikipedia domains**: Custom or unofficial Wikipedia mirrors may not be supported if their domain structure significantly differs.
-   **JavaScript disabled**: The script requires JavaScript to be enabled in the browser to function.
-   **Very old browsers**: While the script uses standard JavaScript, very old browsers lacking support for the `URL` API might rely on the fallback regex method, which is slightly less robust.

---

**Note**: This script is designed to enhance the Browse experience by redirecting to mobile-optimized Wikipedia pages. It respects Wikipedia's structure and does not interfere with editing, account management, or administrative pages.
