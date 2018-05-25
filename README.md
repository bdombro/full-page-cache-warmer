# 🔥 full-page-cache-warmer 🔥

## About
GREAT FOR SPA APPS, OR ANY APP THAT MAKES LOTS OF XHR REQUESTS. This app will crawl and fully load a list of URLs or sitemap.xml(soon) using Puppeteer (aka headless Chromium). It's the ONLY crawler that (1) fully loads pages and (2) mimics browser HTTP headers to NGINX or Varnish. At the same time, it's optimized to not bog down your system by re-using Chromium instances instead of creating a new instance per URL.

Checkout the sweet config options in (config-example.yml)[#].

## Caveats
1. Though optimized, fully loading a webpage is CPU and network expensive.

## Requirements
1. Requires Node v7.x or higher

## Installation
```
npm install -g full-page-cache-warmer
or
yarn global add full-page-cache-warmer
```

To install to cron, you may try a similar cron command to this:

```
@daily /var/www/.nvm/versions/node/v8.11.1/bin/node /var/www/.nvm/versions/node/v8.11.1/bin/full-page-cache-warmer --config=/var/www/aii-crawler-config.yml 2>&1 | tee -a /var/www/aii-crawler-config.log
```

## Usage
```
full-page-cache-warmer [options]

Options
  --rainbow, -r  Include a rainbow
  --init, -i  Copy demo config to your current working directory

Examples
  $ full-page-cache-warmer --init
  🌈 unicorns 🌈
  $ full-page-cache-warmer --config=config.yml
  ...
```

Then check the 'out' folders.

## Roadmap

##### Ideas
1. Read url list from a sitemap.xml

##### Queued
1. None right now

##### In-Process
1. Upkeep, bugfixes and maintenance

## Contributing
Star me! And/or open up a pull request or email me for ideas (see package.json for email)

## Related
1. https://github.com/sys0dm1n/varnish-cache-warmer - Similar, but doesn't fully load the page so is only surface deep.
1. https://github.com/knyzorg/Sitemap-Generator-Crawler
1. https://github.com/GoogleChrome/puppeteer
1. Any other crawler


## License (MIT)

```
WWWWWW||WWWWWW
 W W W||W W W
      ||
    ( OO )__________
     /  |           \
    /o o|    MIT     \
    \___/||_||__||_|| *
         || ||  || ||
        _||_|| _||_||
       (__|__|(__|__|
```

Copyright (c) 2017 Brian Dombrowski <bdombro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.