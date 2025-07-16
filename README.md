# Wikipedia Desktop to Mobile Redirect

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-compatible-brightgreen.svg)
![Greasemonkey](https://img.shields.io/badge/Greasemonkey-compatible-brightgreen.svg)

A userscript that automatically redirects desktop Wikipedia pages to mobile versions for better readability and faster loading.

## Features

- **Smart URL Detection**: Handles all Wikipedia domains and language codes
- **Safe Redirects**: Prevents infinite loops with built-in protections
- **Parameter Preservation**: Maintains URLs, anchors, and query strings
- **Debug Mode**: Console logging for troubleshooting
- **Update Checker**: Manual update checking via menu
- **Universal Support**: Works with all Wikipedia language editions

## Installation

1. **Install userscript manager**: [Tampermonkey](https://tampermonkey.net)
2. **Install script**: [Wikipedia Mobile Redirect](https://raw.githubusercontent.com/OD728/WikiM/main/wikipedia-desktop-to-mobile-redirect.user.js)
3. Visit any desktop Wikipedia page to test

## Configuration

Access via Tampermonkey menu:
- **Debug Mode**: Toggle console logging
- **Check for Updates**: Manual update checking

## Examples

| Desktop URL | Mobile URL |
|-------------|------------|
| `en.wikipedia.org/wiki/Example` | `en.m.wikipedia.org/wiki/Example` |
| `zh-cn.wikipedia.org/wiki/示例` | `zh-cn.m.wikipedia.org/wiki/示例` |
| `www.wikipedia.org/` | `m.wikipedia.org/` |

## Troubleshooting

- **Not redirecting**: Enable Debug Mode and check console
- **Loops**: Built-in protections prevent this, report if occurs
- **Language issues**: Check if domain matches standard Wikipedia format

## License

MIT License

## Contributing

Issues and PRs welcome at: [GitHub Repository](https://github.com/OD728/WikiM)
