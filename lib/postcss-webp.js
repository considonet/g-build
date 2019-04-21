let postcss = require('postcss');

module.exports = postcss.plugin('g-webp', cfg => {

  const config = Object.assign({}, {
    extensions: [ "png" ],
    parentElement: "body",
    noSupportClass: "no-webp",
    noJsClass: null,
    supportClass: "webp",
    replaceExtension: true
  }, cfg);

  const fileExtRegexp = new RegExp(`\\.(${config.extensions.join("|")})`, "i");
  const replaceExtRegexp = new RegExp(`\\.(${config.extensions.join("|")})`, "ig");

  return root => {
    root.walkDecls(decl => {
      if (fileExtRegexp.test(decl.value) && decl.value.indexOf(".webp") === -1) {

        let rule = decl.parent;

        // Skipping no-support existing rule
        if (config.noSupportClass && rule.selector.indexOf(`.${config.noSupportClass}`) !== -1) {
          return;
        }

        // Skipping no-js existing rule
        if (config.noJsClass && rule.selector.indexOf(`.${config.noJsClass}`) !== -1) {
          return;
        }

        // Skipping if no-webp comment
        let skip = false;
        rule.walkComments(c => {
          if(/no-webp/.test(c.text)) {
            skip = true;
            return false;
          }
        });
        if(skip) {
          return;
        }

        // Creating a new ruleset
        let webp = rule.cloneAfter();
        webp.each(i => {
          if (i.prop !== decl.prop && i.value !== decl.value) {
            i.remove()
          }
        });
        webp.selectors = webp.selectors.map(i => `${config.parentElement}.${config.supportClass} ${i}`);
        webp.each(i => {
          i.value = config.replaceExtension ? i.value.replace(replaceExtRegexp, ".webp") : i.value.replace(replaceExtRegexp, ".$1.webp")
        });

        // Optional no-support ruleset
        if(config.noSupportClass) {

          let noWebp = rule.cloneAfter();
          noWebp.each(i => {
            if (i.prop !== decl.prop && i.value !== decl.value) i.remove()
          });
          noWebp.selectors = noWebp.selectors.map(i => `${config.parentElement}.${config.noSupportClass} ${i}`);

        }

        // Optional no-js ruleset
        if(config.noJsClass) {

          let noJs = rule.cloneAfter();
          noJs.each(i => {
            if (i.prop !== decl.prop && i.value !== decl.value) i.remove()
          });
          noJs.selectors = noJs.selectors.map(i => `${config.parentElement}.${config.noJsClass} ${i}`);

        }

        // Removing the original declaration
        if(config.noSupportClass || config.noJsClass) {
          decl.remove();
        }

        // Cleanup
        if (rule.nodes.length === 0) {
          rule.remove();
        }

      }
    })
  }
});
