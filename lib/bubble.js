const notifier = require("node-notifier");
const path = require("path");

module.exports = (message, moduleName = null, subTitle = null) => {
  notifier.notify({
    title: "G-Build" + (moduleName ? ` (${moduleName})` : "") + (subTitle ? ` - ${subTitle}` : ""),
    message,
    icon: path.join(__dirname, '../images/icon.png')
  });
};
