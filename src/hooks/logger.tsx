// src/utils/logger.js

const isDev = import.meta.env.VITE_ENV_NAME !== 'Production';

/**
 * Format log messages with timestamp and label
 */
const formatMessage = (level, ...args) => {
  const timestamp = new Date().toISOString();
  return [`[${timestamp}] [${level.toUpperCase()}]`, ...args];
};

export const logger = {
  info: (...args) => {
    if (isDev) console.info(...formatMessage('info', ...args));
  },
  warn: (...args) => {
    if (isDev) console.warn(...formatMessage('warn', ...args));
  },
  error: (...args) => {
    console.error(...formatMessage('error', ...args)); // always log errors
    // You can also send errors to a monitoring service here (e.g. Sentry)
  },
  debug: (...args) => {
    if (isDev) console.debug(...formatMessage('debug', ...args));
  },
  log: (...args) => {
    if (isDev) console.log(...formatMessage('log', ...args));
  },
};
