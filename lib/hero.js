const { heroui } = require("@heroui/theme");

module.exports = heroui({
  themes: {
    light: {
      colors: {
        background: "#FFFFFF",
        foreground: "#000000",
        default: "#E4E4E4",
        primary: "#f37021",
        secondary: "#78c653",

        danger: "#d84315",
        warning: "#ffb300",
        success: "#7cb342",
      },
    },
  },
});
