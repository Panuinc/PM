import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import moment from "moment-timezone";
import fs from "fs";
import path from "path";

const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const timeZone = "Asia/Bangkok";

const fileTransport = new DailyRotateFile({
  filename: path.join(logDir, "%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  zippedArchive: true,
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.printf(({ level, message, ...meta }) => {
    const ts = moment().tz(timeZone).format("YYYY-MM-DD HH:mm:ss");
    return `[${ts}] [${level.toUpperCase()}] ${JSON.stringify({
      message,
      ...meta,
    })}`;
  }),
  transports: [fileTransport, new winston.transports.Console()],
});

export default logger;
