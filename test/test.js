const jsdom = require("jsdom")
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document, navigator } = window
global.document = document;
global.window = window;
global.navigator = navigator;

var asset = require("assert");
