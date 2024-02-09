const chalk = require('chalk');

const logger = {
  info: (timestamp, url, message, status, responseTime) =>
    console.log(
      chalk.blue.bold('INFO:'),
      chalk.green(timestamp),
      chalk.bold('|'),
      chalk.blue.underline(url),
      message,
      chalk.bold('|'),
      chalk.greenBright('Status code:'),
      chalk.bgGreenBright.bold(` ${status} `),
      chalk.bold('|'),
      'response time:',
      responseTime
    ),
  warn: (timestamp, url, message, status) =>
    console.log(
      chalk.yellowBright.bold('WARN:'),
      chalk.green(timestamp),
      chalk.bold('|'),
      chalk.blue.underline(url),
      chalk.bold('|'),
      message,
      chalk.red('Status code:'),
      chalk.bgRedBright.bold(` ${status} `),
      chalk.bold('|')
    ),
  alert: (timestamp, url, message) =>
    console.log(
      chalk.bgRedBright(
        chalk.bold('ALERT:'),
        chalk.green(timestamp),
        chalk.bold('|'),
        chalk.blue.underline(url),
        chalk.bold('|'),
        message
      )
    ),
  issueInfo: (timestamp, message, urls) =>
    console.log(
        chalk.red.bold('ISSUE INFO:'),
        chalk.green(timestamp),
        chalk.bold('|'),
        message,
        chalk.bold('|'),
        chalk.red.underline(urls)
    ),
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

module.exports = { logger, formatDate };