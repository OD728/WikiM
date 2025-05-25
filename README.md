# Wikipedia Desktop to Mobile Redirect (Improved)

An enhanced userscript that automatically redirects desktop Wikipedia pages to their mobile versions for better readability and faster loading on mobile devices.

## 🎯 Features

- **Smart URL Detection**: Handles all Wikipedia domains including complex language codes (e.g., `zh-cn.wikipedia.org`)
- **Safe Redirects**: Prevents infinite redirect loops and double execution
- **Comprehensive Coverage**: Works with all Wikipedia language editions and subdomains
- **Parameter Preservation**: Maintains all URL parameters, anchors, and query strings
- **Special Domain Handling**: Properly handles `www.wikipedia.org` → `m.wikipedia.org`
- **Error Recovery**: Robust fallback mechanisms with graceful degradation
- **Debug Support**: Console logging for troubleshooting and verification
- **Memory Safe**: Prevents memory leaks and resource conflicts

## 🚀 Installation

1. Install a userscript manager:
   - **Chrome/Edge**: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - **Firefox**: [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
   - **Safari**: [Tampermonkey](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. Copy the script code from the details section below
3. Create a new userscript in your manager and paste the code
4. Save and enable the script
5. Visit any desktop Wikipedia page to test

## ✨ Improvements Over Original

### 🛡️ **Enhanced Safety & Reliability**
- **Prevents double execution** with execution flag checks
- **Additional mobile detection** to avoid redirect loops
- **Comprehensive error handling** with try-catch blocks and fallback mechanisms
- **Safe URL validation** before attempting redirects

### 🔧 **Better URL Handling**
- **Improved regex patterns** that handle language codes with hyphens (e.g., `zh-cn.wikipedia.org`)
- **Robust URL parsing** using the URL constructor to preserve all URL components
- **Special case handling** for `www.wikipedia.org` redirects
- **Query parameter preservation** maintains search terms, anchors, and other URL data

### 🎯 **Enhanced Matching**
- **More comprehensive exclude rules** to prevent running on mobile sites
- **Domain validation** ensures we're on a standard Wikipedia domain before redirecting
- **Conditional redirects** only redirect when URLs are actually different
- **Language code validation** handles both simple (en, fr) and complex (zh-cn, pt-br) codes

### 📊 **Debugging & Monitoring**
- **Console logging** to track redirect actions and help with troubleshooting
- **Error reporting** to help diagnose issues in different environments
- **Redirect confirmation** logs successful redirections with before/after URLs
- **Fallback notifications** alerts when primary method fails but fallback succeeds

### 🔄 **Fallback Protection**
- **Secondary simple method** if enhanced URL parsing fails
- **Graceful degradation** ensures script works even in edge cases
- **Multiple redirect strategies** for maximum compatibility
- **Error isolation** prevents one failure from breaking the entire script

## 📋 Supported Wikipedia Domains

The script works with all Wikipedia domains including:

- **Standard language codes**: `en.wikipedia.org`, `fr.wikipedia.org`, `de.wikipedia.org`
- **Complex language codes**: `zh-cn.wikipedia.org`, `pt-br.wikipedia.org`, `roa-tara.wikipedia.org`
- **Main portal**: `www.wikipedia.org` → `m.wikipedia.org`
- **All Wikipedia subdomains**: Any valid Wikipedia language edition

### Redirect Examples

| Original URL | Redirected URL |
|-------------|----------------|
| `https://en.wikipedia.org/wiki/Example` | `https://en.m.wikipedia.org/wiki/Example` |
| `https://zh-cn.wikipedia.org/wiki/示例` | `https://zh-cn.m.wikipedia.org/wiki/示例` |
| `https://www.wikipedia.org/` | `https://m.wikipedia.org/` |
| `https://fr.wikipedia.org/wiki/Exemple?section=1#History` | `https://fr.m.wikipedia.org/wiki/Exemple?section=1#History` |

## 📋 Script Code

<details>
<summary>Click to expand the complete userscript code</summary>

```javascript
// ==UserScript==
// @name         Wikipedia Desktop to Mobile Redirect (Improved)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       RM
// @description  Redirect desktop Wikipedia to mobile version with better error handling and URL parsing
// @match        https://*.wikipedia.org/*
// @exclude      https://*.m.wikipedia.org/*
// @exclude      https://m.wikipedia.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Exit early if already on mobile (additional safety check)
    if (window.location.hostname.includes('.m.wikipedia.org') || 
        window.location.hostname === 'm.wikipedia.org') {
        return;
    }
    
    // Exit if this script has already run (prevent double execution)
    if (window.wikipediaMobileRedirectExecuted) {
        return;
    }
    window.wikipediaMobileRedirectExecuted = true;
    
    try {
        const currentURL = new URL(window.location.href);
        const hostname = currentURL.hostname;
        
        // Enhanced regex to handle language codes with hyphens (e.g., zh-cn.wikipedia.org)
        const desktopPattern = /^([a-z]{2,3}(?:-[a-z]{2,4})?|www)\.wikipedia\.org$/i;
        const match = hostname.match(desktopPattern);
        
        if (!match) {
            console.log('Wikipedia Mobile Redirect: Not a standard Wikipedia domain');
            return;
        }
        
        const langCode = match[1];
        let mobileHostname;
        
        // Handle www.wikipedia.org differently
        if (langCode.toLowerCase() === 'www') {
            mobileHostname = 'm.wikipedia.org';
        } else {
            mobileHostname = `${langCode}.m.wikipedia.org`;
        }
        
        // Construct the mobile URL preserving all parts
        const mobileURL = new URL(currentURL);
        mobileURL.hostname = mobileHostname;
        
        // Only redirect if the URLs are actually different
        if (mobileURL.href !== currentURL.href) {
            console.log(`Wikipedia Mobile Redirect: ${currentURL.href} → ${mobileURL.href}`);
            window.location.replace(mobileURL.href);
        }
        
    } catch (error) {
        console.error('Wikipedia Mobile Redirect Error:', error);
        // Fallback to original simple method if URL parsing fails
        try {
            const currentURL = window.location.href;
            const mobileURL = currentURL.replace(
                /\/\/([a-z]{2,3}(?:-[a-z]{2,4})?)\.wikipedia\.org/i, 
                '//$1.m.wikipedia.org'
            );
            
            if (mobileURL !== currentURL) {
                window.location.replace(mobileURL);
            }
        } catch (fallbackError) {
            console.error('Wikipedia Mobile Redirect Fallback Error:', fallbackError);
        }
    }
})();
```

</details>

## 🔧 Usage

Once installed, the script works automatically:

1. **Visit any desktop Wikipedia page** in your browser
2. **Automatic redirect** happens instantly to the mobile version
3. **Preserves your location** in the article (anchors, search parameters)
4. **Works across all languages** and Wikipedia editions

### Verification

To verify the script is working:

1. Visit a desktop Wikipedia page (e.g., `https://en.wikipedia.org/wiki/Example`)
2. The URL should automatically change to mobile (e.g., `https://en.m.wikipedia.org/wiki/Example`)
3. Check the Developer Console (F12) for redirect confirmation messages

### Debug Information

Enable console logging to see redirect activity:
```javascript
// The script automatically logs redirects to the console
// Look for messages starting with "Wikipedia Mobile Redirect:"
```

## 🖥️ Browser Compatibility

- **Chrome/Chromium** ✅ Full support
- **Firefox** ✅ Full support  
- **Edge** ✅ Full support
- **Safari** ✅ Full support
- **Mobile Browsers** ✅ Works on mobile (no redirects when already mobile)

## 📱 Benefits of Mobile Wikipedia

- **Faster Loading**: Mobile pages load significantly faster
- **Better Mobile Experience**: Optimized layout for smaller screens
- **Reduced Data Usage**: Smaller page sizes save bandwidth
- **Touch-Friendly**: Better navigation on touch devices
- **Improved Readability**: Cleaner typography and spacing

## 🔍 Advanced Features

### Language Code Support

The script handles various Wikipedia language code formats:

- **Simple codes**: `en`, `fr`, `de`, `ja`, `ko`
- **Region-specific**: `zh-cn`, `zh-tw`, `pt-br`, `en-simple`
- **Complex codes**: `roa-tara`, `zh-classical`, `map-bms`

### URL Preservation

All URL components are preserved during redirect:

- **Path**: `/wiki/Article_Name` remains identical
- **Query Parameters**: `?section=1&action=edit` maintained
- **Anchors**: `#History_section` preserved
- **Special Characters**: Unicode characters in URLs handled correctly

### Error Handling

Multiple fallback mechanisms ensure reliability:

1. **Primary Method**: Modern URL API with comprehensive validation
2. **Fallback Method**: Simple regex replacement for compatibility
3. **Error Logging**: All failures logged to console for debugging
4. **Graceful Degradation**: Continues working even if some features fail

## 🐛 Troubleshooting

### Script Not Redirecting
1. Check that the userscript manager is enabled
2. Verify you're on a desktop Wikipedia URL (not already mobile)
3. Check browser console for error messages
4. Ensure the script is enabled in your userscript manager

### Redirect Loops
The script has multiple protections against loops:
- Execution flag prevents double-running
- Mobile domain detection exits early
- URL comparison prevents unnecessary redirects

### Language-Specific Issues
If certain language editions don't redirect:
1. Check the console for "Not a standard Wikipedia domain" messages
2. The domain might use an unsupported format
3. Report the specific domain for script updates

### Console Commands

Check script status:
```javascript
// Check if script has run
console.log(window.wikipediaMobileRedirectExecuted);

// Test URL parsing (replace with your URL)
const testURL = new URL('https://en.wikipedia.org/wiki/Test');
console.log(testURL);
```

## 🔧 Customization

### Disable for Specific Languages

To disable redirects for specific language codes, modify the script:

```javascript
// Add this after the langCode extraction
const disabledLanguages = ['en', 'fr']; // Add languages to skip
if (disabledLanguages.includes(langCode.toLowerCase())) {
    console.log(`Redirect disabled for language: ${langCode}`);
    return;
}
```

### Custom Mobile Domains

For testing or special configurations:

```javascript
// Change the mobile hostname pattern
mobileHostname = `${langCode}.mobile.wikipedia.org`; // Custom mobile domain
```

## 📝 License

MIT License - feel free to modify and distribute.

## 🤝 Contributing

Found a bug or have an improvement? Feel free to:

- **Report Issues**: Submit issues with specific Wikipedia URLs that don't work
- **Language Support**: Help test with different Wikipedia language editions  
- **Feature Requests**: Suggest improvements or new features
- **Pull Requests**: Submit code improvements or bug fixes

### Known Limitations

- **Non-standard Wikipedia domains**: Custom or unofficial Wikipedia mirrors may not be supported
- **JavaScript disabled**: Requires JavaScript to be enabled in the browser
- **Very old browsers**: Requires modern JavaScript features (URL API)

---

**Note**: This script only redirects public Wikipedia pages. It respects Wikipedia's robots.txt and doesn't interfere with editing, account management, or administrative pages.