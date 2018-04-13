/*
 Whats All App
 Enumerate of phonenumbers, profile pics, about texts and online statuses
 16-05-2017
 (c) 2017 - Loran Kloeze - loran@ralon.nl

 https://github.com/LoranKloeze/WhatsAllApp


 2018 WhatsFoto
 Edit by Johan Hoeksma

*/
(function() {
  'use strict';
  const logSuc = console.log.bind(console, '%c %s', 'background: green; color: white');
  const logErr = console.log.bind(console, '%c %s', 'background: red; color: white');
  const logInf = console.log.bind(console, '%c %s', 'background: blue; color: white');

  console.log();
  logInf('start')

  const splitNrs = (nrs) => { // CSV to array
    let output = nrs.split(',')
    console.log(output);
    let myArr = [];
    output.forEach((el) => {
      el = el.replace(/[^0-9]/, '');
      if (el.indexOf("06") == 0) {
        el = el.replace("06", "316");
      }
      if (el.length == 11) {
        myArr.push(el)
      }
    })
    return myArr;
  }

  const getRange = (nrs) => { // get array from ["0600", "0699"] start / end
    const split = splitNrs(nrs);
    const end = split[1];
    let start = split[0];
    let telArr = [];
    while (start <= end) {
      telArr.push(start);
      start++;
    }
    return telArr;
  }

  const getName = (prefix) => {
    const d = new Date();
    return `${prefix}(${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()})`;
  }

  const saveTxt = (filename, text) => {
    var blob = new Blob([text], {
      type: "text/plain",
      endings: "transparent"
    });
    window.saveAs(blob, filename);
  }

  // TODO: make multiple listeners
  document.addEventListener('openPic', (e) => {
    const data = e.detail;
    logInf(`openPic`);
    console.log(JSON.stringify(data));

    // 'secret' scraping
    console.log(data.phone);
    if (data.phone.indexOf('S') == 0) {
      getAll(getRange(data.phone), (info) => {
        logSuc('return from Prom')
        console.log(info);
        let out = "";
        info.forEach((it) => {
          if (it.imgFull) {
            out += `${it.id}\t${it.imgFull}\r\n`;
          } else if (it.xtag) {
            out += `${it.id}\t${it.imgFull}\r\n`;
          }

        })
        saveTxt(getName("whats-urls"), out);
      });
    }
    // getAll(splitNrs(data.phone)); // download
    // getAll(splitNrs(data.phone));
  });


  const scrape = (images) => {
    // Make cb function for it
    console.log('images');
    out.forEach((item) => {
      // item
      if (item.imgFull) {
        console.log('item');
      } else {
        logErr(`${item.id} no image found`)
      }
    })

    if (out.length > 0) {
      logSuc(`aantal bestanden in zip: ${out.length}`);
      zip.generateAsync({
        type: "blob"
      }).then(function callback(blob) {
        const d = new Date();
        saveAs(blob, `whats-foto(${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()})`);
      });
      console.log(out);
    } else {
      console.log('nothing found')
    }
  }

  let getAll = (nrs, cb) => {
    let findAll = [];
    nrs.forEach((number) => {
      findAll.push(Store.ProfilePicThumb.find(`${number}@c.us`));
    });
    Promise.all(findAll).then(cb);
  }
})();