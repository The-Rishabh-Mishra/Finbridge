import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);

function formatLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] [${level}] ${message}`;
  if (data) {
    logMessage += ` ${JSON.stringify(data)}`;
  }
  return logMessage;
}

export const logger = {
  info: (message, data) => {
    const logMessage = formatLog('INFO', message, data);
    console.log(logMessage);
    fs.appendFileSync(logFile, logMessage + '\n');
  },

  error: (message, data) => {
    const logMessage = formatLog('ERROR', message, data);
    console.error(logMessage);
    fs.appendFileSync(logFile, logMessage + '\n');
  },

  warn: (message, data) => {
    const logMessage = formatLog('WARN', message, data);
    console.warn(logMessage);
    fs.appendFileSync(logFile, logMessage + '\n');
  },

  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = formatLog('DEBUG', message, data);
      console.log(logMessage);
      fs.appendFileSync(logFile, logMessage + '\n');
    }
  },
};

export default logger;

