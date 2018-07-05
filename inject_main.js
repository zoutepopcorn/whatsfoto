/*
 (c) 2018 WhatsFoto by Johan Hoeksma
 based on (c) 2017 - Loran Kloeze - loran@ralon.nl
*/
(function() {
  'use strict';
  const logSuc = console.log.bind(console, '%c %s', 'background: green; color: white');
  const logErr = console.log.bind(console, '%c %s', 'background: red; color: white');
  const logInf = console.log.bind(console, '%c %s', 'background: blue; color: white');
  const logWarn = console.log.bind(console, '%c %s', 'background: orange; color: white');
  // window.Store = {};
  window.WLAPStore = {};
  window.WLAPWAPStore = {};
  const scripts = document.getElementsByTagName('script');
  const regExAppScr = /\/app\..+.js/;
  const regExApp2Scr = /\/app2\..+.js/;
  let appScriptLocation = '';
  let app2ScriptLocation = '';

  const sleep = (ms) => {
    return new Promise((res) => {
      setTimeout(() => {
        return res();
      }, ms)
    });
  }

  const grepFunctionNames = function() {
    fetch(app2ScriptLocation).then(e => {
      var reader = e.body.getReader();
      var js_src = "";

      return reader.read().then(function readMore({
        done,
        value
      }) {
        var td = new TextDecoder("utf-8");
        var str_value = td.decode(value);
        if (done) {
          js_src += str_value;
          var regExDynNameStore = /'"(\w+)"':function\(e,t,a\)\{\"use strict\";e\.exports=\{AllStarredMsgs:/;
          var res = regExDynNameStore.exec(js_src);
          var funcName = res[1];
          webpackJsonp([], {
            [funcName]: (x, y, z) => window.WLAPStore = z('"' + funcName + '"')
          }, funcName);
          console.log('Created Store');
          return;
        }

        js_src += str_value;
        return reader.read().then(readMore);

      })

    }).then(() => {
      fetch(appScriptLocation).then(e => {
        var reader = e.body.getReader();
        var js_src = "";

        return reader.read().then(function readMore({
          done,
          value
        }) {
          var td = new TextDecoder("utf-8");
          var str_value = td.decode(value);
          if (done) {
            js_src += str_value;
            var regExDynNameStore = /Wap:n\('"(\w+)"'\)/;
            var res = regExDynNameStore.exec(js_src);
            var funcName = res[1];
            webpackJsonp([], {
              [funcName]: (x, y, z) => window.WLAPWAPStore = z('"' + funcName + '"')
            }, funcName);
            console.log('Created Store WAP');
            // whenStoreIsReady()
            return;
          }

          js_src += str_value;
          return reader.read().then(readMore);

        })
      })
    })
  }

  const grepScriptTags = async function() {
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (regExAppScr.exec(src) != null) {
        appScriptLocation = src;
      }

      if (regExApp2Scr.exec(src) != null) {
        app2ScriptLocation = src;
      }
    }
    if (appScriptLocation === '' || app2ScriptLocation == '') {
      console.log('DOM not ready for WhatsAllApp yet');
      await sleep(1000);
      grepScriptTags();
    } else {
      console.log('DOM ready for WhatsAllApp! Let\'s continue...');
      grepFunctionNames();
    }
  }

  grepScriptTags();


  logInf('whatsfoto ui.js init')

  const getAll = (nrs) => { // get all objects from WA
    logSuc(nrs)
    let findAll = [];
    nrs.forEach((number) => {
      findAll.push(WLAPStore.ProfilePicThumb.find(`${number}@c.us`));
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