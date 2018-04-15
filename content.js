/*
 (c) 2018 Johan Hoeksma
 based on:
 (c) 2017 - Loran Kloeze - loran@ralon.nl
*/

document.addEventListener('popup', (e) => {
  let data = e.detail;
  console.log(">>  " + JSON.stringify(data));
});

const injectJs = (link) => {
  var scr = document.createElement("script");
  scr.type = "text/javascript";
  scr.src = link;
  (document.head || document.body || document.documentElement).appendChild(scr);
}

injectJs(chrome.extension.getURL("lib/jquery.min.js"));
injectJs(chrome.extension.getURL("lib/filesaver.js"));
injectJs(chrome.extension.getURL("lib/jszip.js"));
injectJs(chrome.extension.getURL("lib/jszip.ut.js"));
// Main script
injectJs(chrome.extension.getURL("inject_main.js"));