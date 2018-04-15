/*
 (c) 2018 WhatsFoto Edit by Johan Hoeksma
 based on (c) 2017 - Loran Kloeze - loran@ralon.nl
*/
(function() {
  'use strict';
  const logSuc = console.log.bind(console, '%c %s', 'background: green; color: white');
  const logErr = console.log.bind(console, '%c %s', 'background: red; color: white');
  const logInf = console.log.bind(console, '%c %s', 'background: blue; color: white');
  const logWarn = console.log.bind(console, '%c %s', 'background: orange; color: white');

  logInf('whatsfoto ui.js init')

  const getAll = (nrs) => { // get all objects from WA
    logSuc(nrs)
    let findAll = [];
    nrs.forEach((number) => {
      findAll.push(Store.ProfilePicThumb.find(`${number}@c.us`));
    });
    return new Promise.all(findAll);
  }

  const getRange = (split) => { // get array from ["0600", "0699"] start / end
    // const split = splitNrs(nrs);
    let start = split[0];
    const end = split[1];
    logInf(`${start} - ${end}`)
    let telArr = [];
    while (start <= end) {
      telArr.push(start);
      start++;
    }
    return telArr;
  }

  const getName = (prefix) => { // get Name for download
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

  const saveList = (info) => {
    logSuc('return from Prom')
    console.log(info);
    let out = "";
    info.forEach((it) => {
      if (it.imgFull) {
        out += `${it.id}\t${it.imgFull}\r\n`;
      } else if (it.tag != null) {
        out += `${it.id}\tno pic\r\n`;
      }

    })
    saveTxt(getName("whats-urls"), out);
  }

  const saveImages = (out) => {
    let zip = new JSZip();
    let urlToPromise = (url) => {
      return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }

    let count = 0;
    out.forEach((item) => {
      if (item.imgFull) {
        zip.file(`${item.id.replace('@c.us','.jpg')}`, urlToPromise(item.imgFull), {
          binary: true
        });
        count++;
      } else {
        logErr(`${item.id} no image found`)
      }
    })

    if (count > 0) {
      logSuc(`aantal bestanden in zip: ${out.length}`);
      zip.generateAsync({
        type: "blob"
      }).then(function callback(blob) {
        const d = new Date();
        saveAs(blob, getName(`whatsfoto`));
      });
    } else {
      lorWarn('nothing found')
    }
  }

  // listener for popup action, from ind.js
  document.addEventListener('action', (e) => {
    const data = e.detail;
    logWarn(`action => ${data.command}`);
    console.log(data.phone);

    if (data.command == 'images') {
      const NRS = data.phone.split(','); // CSV in
      getAll(NRS).then(saveImages); // TODO: errors?
    }

    if (data.command == 'bulk') {
      console.log(data.phone);
      const NRS = getRange(data.phone.split(',')); // CSV in
      console.log(NRS);
      getAll(NRS).then(saveList);
    }
  });

})();