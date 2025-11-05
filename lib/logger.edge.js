export default {
  info: (msg) => console.info(JSON.stringify({ level: "info", ...msg })),
  warn: (msg) => console.warn(JSON.stringify({ level: "warn", ...msg })),
  error: (msg) => console.error(JSON.stringify({ level: "error", ...msg })),
};
