const axios = require('axios');
const URL = require("url").URL;
const pLimit = require('p-limit')
const fs = require('fs');
const path = require('path');
const { logger, formatDate } = require('./helpers')
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
const tresholds = new Map();
const limit = pLimit(config.batchLimit);

config.urls.forEach((url) => {
  tresholds.set(url, config.threshold);
});

async function checkUrlStatus(url) {
  let ressponseTime = 0;
  try {

    const startTime = Date.now();
    const response = await axios.get(url);
    const endTime = Date.now();
    ressponseTime = endTime - startTime;
    const timestamp = formatDate(new Date());

    if (response.status >= 200 && response.status < 300) {
      logger.info(timestamp, url, 'is UP', response.status, ressponseTime);
      tresholds.set(url, config.threshold);
    } else {
      throw new Error({timestamp, url, status: response.status, ressponseTime});
    }
  } catch (error) {
    
    logger.warn(formatDate(new Date()), url, 'is DOWN', error.response?.status ?? 'No Code')
    tresholds.set(url, tresholds.get(url) - 1);
    if (tresholds.get(url) === 0) {
      logger.alert(formatDate(new Date()), url, `is DOWN, Failed ${config.threshold} times consecutly.`)
      tresholds.set(url, config.threshold);
    }
  }
}

function validateURLs() {
  const incorrectURLs = config.urls.filter(url => !stringIsAValidUrl(url));
  config.urls = config.urls.filter(url => stringIsAValidUrl(url));
  logger.issueInfo(formatDate(new Date()), 'The following urls are removed:', incorrectURLs)
}

function monitorUrls() {
  return Promise.all(config.urls.map((url) => {
    return limit(() => checkUrlStatus(url))
  }));
}

function stringIsAValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

function main() {
  console.log(`Application Started`);
  validateURLs()
  console.log(`Monitoring Started`);
  console.log(`Monitoring interval: ${config.interval} minutes`);
  console.log(`Threshold for consecutive failures: ${config.threshold}`);
  monitorUrls().then(() => setIntervalAsync(monitorUrls, config.interval * 60 * 1000))
}

try {
  main();
} catch (error) {
  console.error(error);
}
