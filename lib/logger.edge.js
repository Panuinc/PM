export default {
  info: (msg) =>
    console.info(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        ...msg,
      })
    ),
  warn: (msg) =>
    console.warn(
      JSON.stringify({
        level: "warn",
        timestamp: new Date().toISOString(),
        ...msg,
      })
    ),
  error: (msg) =>
    console.error(
      JSON.stringify({
        level: "error",
        timestamp: new Date().toISOString(),
        ...msg,
      })
    ),
};
