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
    console.log(`%c ${msg}`, 'background: red; color: white; display: block;');
  }

  const logInf = (msg) => {
    console.log(`%c ${msg}`, 'background: blue; color: white; display: block;');
  }

  const logWarn = (msg) => {
    console.log(`%c ${msg}`, 'background: orange; color: white; display: block;');
  }

  const logSuc = (msg) => {
    console.log(`%c ${msg}`, 'background: green; color: white; display: block;');
  }

  logInf('start')

  document.addEventListener('openPic', (e) => {
    const data = e.detail;
    console.log(JSON.stringify(data));
    downAll(data.phone);

  });

  var evt = document.createEvent("CustomEvent");

  const splitNrs = (nrs) => {
    let output = nrs.split(',')
    console.log(output);
    let myArr = [];
    output.forEach((el) => {
      el = el.replace(/[^0-9]/, '');
      if (el.indexOf("06") == 0) {
        el = el.replace("06", "316");
      }
      if (el.length != 11) {

      } else {

      }
      myArr.push(el)
    })
    return myArr;
  }


  let downAll = (nrs, cb) => {
    let findAll = [];
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

    splitNrs(nrs).forEach((number) => {
      console.log(number);
      findAll.push(Store.ProfilePicThumb.find(`${number}@c.us`));
    });
    Promise.all(findAll)
      .then((out) => {
        out.forEach((item) => {
          // item
          if (item.imgFull) {
            zip.file(`${item.id.replace('@c.us','.jpg')}`, urlToPromise(item.imgFull), {
              binary: true
            });
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
          console.log()
        }
      })
  }

  let picture = (nr, cb) => {
    console.log("nr: " + nr);
    pics++;
    Store.ProfilePicThumb.find(nr + '@c.us').then((d) => {
      pics--;
      console.log("----");
      console.log(d.img);
      if (d.img === null) {
        picture(nr);
      }
      if (d.img === undefined) {
        //console.log("not found");
        cb(false);
      } else {
        console.log(d.img);
        console.log(d.imgFull);
        console.log(d);
        cb({
          "thumb": d.img,
          "img": d.imgFull
        });
      }
    }, (e) => {

    });
  }
})();