/*
 Whats All App
 Enumerate of phonenumbers, profile pics, about texts and online statuses
 16-05-2017
 (c) 2017 - Loran Kloeze - loran@ralon.nl
 https://github.com/LoranKloeze/WhatsAllApp

 Edit by Johan Hoeksma
*/

const MON = {
  api: "SECRET",
  db: "",
  col: "",
};
const DB = "https://api.mlab.com/api/1/databases/" + MON.db + "/collections/" + MON.col + "?apiKey=" + MON.api;


let req = (url, data) => {
  //console.log(url);
  console.log(" ---");
  console.log(data);
  $.ajax({
    url: url,
    data: JSON.stringify(data),
    type: "POST",
    contentType: "application/json"
  });
}

document.addEventListener('popup', (e) => {
  let data = e.detail;
  console.log(">>  " + JSON.stringify(data));

});


document.addEventListener('toDB', (e) => {
  console.log("TO_____DB");
  let data = e.detail;
  console.log("received " + JSON.stringify(data));
  req(DB, data);
});

let injectJs = (link) => {
  var scr = document.createElement("script");
  scr.type = "text/javascript";
  scr.src = link;
  (document.head || document.body || document.documentElement).appendChild(scr);
}


injectJs(chrome.extension.getURL("jquery.min.js"));
injectJs(chrome.extension.getURL("filesaver.js"));
injectJs(chrome.extension.getURL("jszip.js"));
injectJs(chrome.extension.getURL("jszip.ut.js"));
injectJs(chrome.extension.getURL("ui.js"));