const express = require("express");
var app = express();
const loader = require("../bin/autoLoader");
app = loader.config(app);
global.appTest = app;
