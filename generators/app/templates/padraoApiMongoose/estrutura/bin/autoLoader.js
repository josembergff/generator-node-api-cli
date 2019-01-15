const consign = require("consign");

exports.config = app => {
  consign({ cwd: "src", loggingType: "error", verbose: false })
    .include("routes")
    .then("tools")
    .into(app);

  const models = {};

  require("fs")
    .readdirSync(__dirname + "/../src/models")
    .forEach(function(file) {
      if (file.match(/\.js$/) !== null && file !== "index.js") {
        var name = file.replace(".js", "");
        models[name] = require(__dirname + "/../src/models/" + file);
      }
    });

  app.set("models", models);

  return app;
};
