/* eslint-env node */
/* eslint-disable no-console */

import { baseFolder } from 'shared/env';
import { join } from 'path';
import defaultBrowser from 'default-browser';

const defaultApps = ['Terminal', 'Browser', 'TextEditor'];

async function getPlatformDefaults() {
  switch (process.platform) {
    case 'darwin': {
      const browserName = (await defaultBrowser()).name.toLowerCase();
      let Browser;
      try {
        Browser = require(`workflow-app-${browserName}`);
      } catch (error) {
        console.log(`Cannot find ${browserName}, falling back to safari`);
        Browser = require('workflow-app-safari');
      }
      return {
        Browser,
        Terminal: require('workflow-app-iterm'),
        TextEditor: require('workflow-app-atom'),
      };
    }
    case 'win32':
      return {
        Terminal: require('workflow-app-powershell'),
        Browser: require('workflow-app-chrome'),
        TextEditor: require('workflow-app-notepad'),
      };
    case 'linux': {
      const browserName = (await defaultBrowser()).name.toLowerCase();
      let Browser;
      try {
        Browser = require(`workflow-app-${browserName}`);
      } catch (error) {
        console.log(`Cannot find ${browserName}, falling back to chrome`);
        Browser = require('workflow-app-chrome');
      }
      return {
        Browser,
        Terminal: require('workflow-app-xterm'),
        TextEditor: require('workflow-app-atom'),
      };
    }
    default:
      console.log(`Platform '${process.platform}' not supported`);
      console.log(
        'Look for an issue for your platform here: https://github.com/havardh/workflow/issues'
      );
      process.exit(0);
      break;
  }
  throw new Error('not reachable');
}

function getUserDefaults() {
  try {
    const path = join(baseFolder, 'apps', 'defaults');
    const defaultModule = require(path);

    return defaultModule.default || defaultModule;
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    } else {
      return {};
    }
  }
}

let defaults = {};
async function getDefaultApps() {
  if (Object.keys(defaults).length > 0) {
    return defaults;
  }

  // $FlowSuppress
  if (process.browser) {
    defaults = require('workflow-apps-html').defaults;
  } else {
    const platformDefaults = await getPlatformDefaults();
    const userDefaults = getUserDefaults();

    defaultApps.forEach(app => {
      defaults[app] = userDefaults[app] || platformDefaults[app];
    });
  }
  return defaults;
}

const Browser = {
  type: 'async-app',
  loader: () => getDefaultApps().then(({ Browser }) => Browser),
};

const TextEditor = {
  type: 'async-app',
  loader: () => getDefaultApps().then(({ TextEditor }) => TextEditor),
};

const Terminal = {
  type: 'async-app',
  loader: () => getDefaultApps().then(({ Terminal }) => Terminal),
};

module.exports = {
  Browser,
  TextEditor,
  Terminal,
};
