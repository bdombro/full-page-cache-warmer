#!/usr/bin/env node

/**
 * Dependencies
 * Requires Node v7.x or higher
 */

const meow = require('meow');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');
require('events').EventEmitter.defaultMaxListeners = 20;

var demoConfig = path.resolve(__dirname) + '/config-example.yml';


/**
 * CLI Handling
 */

 const cli = meow(`
  Usage
    $ full-page-cache-warmer [options]

  Options
    --rainbow, -r  Include a rainbow
    --init, -i  Copy demo config to your current working directory

  Examples
    $ full-page-cache-warmer --init
    🌈 unicorns 🌈
    $ full-page-cache-warmer
    $ full-page-cache-warmer --config=config.yml
    ...

  Repo: https://git.io/vpZpx

`, {
  flags: {
    init: {
      type: 'boolean',
      alias: 'i'
    },
    config: {
      type: 'text',
      alias: 'c',
      default: 'config.yml'
    }
  }
});



/**
 * Consume config and output directories
 */

if (cli.flags['init']) {
  console.log("\nCopying demo config here.");
  console.log("🌈 Done! 🌈\n")
  fs.copySync(demoConfig, 'config.yml');
  return;
}

if (fs.existsSync(cli.flags['config']))
  var configPath = cli.flags['config'];
else {
  console.log("\nConfig file not found at:");
  console.log(" > " + cli.flags['config']);
  console.log("Using demo config at:");
  console.log(" > " + demoConfig + "\n");
  var configPath = demoConfig;
}
// Get document, or throw exception on error
try {
  var config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.log("\nError reading yaml file:\n")
  console.log(e);
  return
}

// Parse urls
config.urls = config.urlsRaw.replace( /\t/g, '' ).replace( / /g, '' ).replace( /\n/g, " " ).split( " " );

// Profile Count
const profileCount=Object.keys(config.browserSpecificExtraHttpHeaders).length;
const urlCount=config.urls.length

/**
 * Timer
 */
var scriptDuration=0;
setInterval(() => { scriptDuration++; }, 1000);

/**
 * Main
 */

console.log("\nFULL PAGE CACHE WARMER");
console.log("Thread Count: " + Math.min(config.urls.length, config.maxThreadCount) + "\n");
console.log("URL Count: " + config.urls.length);
console.log("Profile Count: " + profileCount);
console.log("Total Count: " + config.urls.length * profileCount);


var promises = [];
var tryCount=0;
var timeoutCount=0;
for (i = 0; i < Math.min(config.urls.length, config.maxThreadCount); i++) {
  promises.push((async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(config.maxTimeoutPerPage * 1000)

    while (config.urls.length) {
      var url = config.urls.pop();
      for (let profile of Object.keys(config.browserSpecificExtraHttpHeaders)) {
        console.log(profile + "->" + url);
        // await page.emulateMedia('screen');
        await page.setExtraHTTPHeaders(config.browserSpecificExtraHttpHeaders[profile]);
        // networkidle0 = wait until 0 connections left; networkidel2 = wait until 2 connections left.
        await page.goto(url, {waitUntil: 'networkidle' + config.networkIdleLevel}).catch((err) => {
          // console.log(err);
          timeoutCount++; 
        });
        tryCount++;
      }
    }

    await browser.close();
  })());
}

Promise.all(promises).then(() => {
  console.log("\nSTATS\n")
  console.log("Duration: " + scriptDuration + "s");
  console.log("Thread Count: " + Math.min(config.urls.length, config.maxThreadCount));
  console.log("URL Count: " + urlCount);
  console.log("Profile Count: " + profileCount);
  console.log("Total Count: " + urlCount * profileCount);
  console.log("Success Count: " + (tryCount - timeoutCount))
  console.log("\n🌈 Done! 🌈\n");
  process.exit(); // The timers will keep the process from exiting, so force exit.
});

setTimeout(() => {
  console.log("\nTimeout Reached: Exiting\n");
  process.exit(1);
}, config.maxTimeout * 1000);

