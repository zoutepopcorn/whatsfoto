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

    const logErr = (msg) => {
      return console.log(`%c ${msg}`, 'background: red; color: white; display: block;');
    }

    const logInf = (msg) => {
      return console.log(`%c ${msg}`, 'background: blue; color: white; display: block;');
    }

    const logWarn = (msg) => {
      return console.log(`%c ${msg}`, 'background: orange; color: white; display: block;');
    }

    const logSuc = (msg) => {
      return console.log(`%c ${msg}`, 'background: green; color: white; display: block;');
    }

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

    const getRange = (start, end) => {
      let telArr = [];
      while (start <= end) {
        telArr.push(start);
        start++;
      }
      return telArr;
    }

    // TODO: make multiple listeners
    document.addEventListener('openPic', (e) => {
      const data = e.detail;
      console.log(JSON.stringify(data));
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
      const urlToPromise = (url) => {
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
      nrs.forEach((number) => {
        console.log(number);
        findAll.push(Store.ProfilePicThumb.find(`${number}@c.us`));
      });
      Promise.all(findAll).then(cb);
    }