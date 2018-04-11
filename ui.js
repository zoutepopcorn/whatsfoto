/*
 Whats All App
 Enumerate of phonenumbers, profile pics, about texts and online statuses
 16-05-2017
 (c) 2017 - Loran Kloeze - loran@ralon.nl

 https://github.com/LoranKloeze/WhatsAllApp

 Edit by Johan Hoeksma
*/

(function() {
  'use strict';
  const PREF = "31621863966";
  let begin = 4000;
  const END = 4030;
  let pics = 0;
  const PICS_MAX = 10; // TODO: tweak, not tested.
  document.addEventListener('openPic', (e) => {
    const data = e.detail;
    console.log(" " + JSON.stringify(data));
    downAll(data.phone);
    // picture(data.phone, (out) => {
    //   console.log("ben ik " + out);
    //   //chrome.tabs.create({ url: "http://nu.nl" });
    //   const html = `<div id="overlay">
    //                           <img src="${out.img}">
    //                       </div>  `;
    //
    //   $("body").append(html);
    //
    // });
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
          zip.file(`${item.id}`, urlToPromise(item.imgFull), {
            binary: true
          });
        })
        zip.generateAsync({
          type: "blob"
        }).then(function callback(blob) {
          saveAs(blob, "example.zip");
        });
        console.log(out);
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
        // toDB({"img" : d.img, "full" : d.imgFull});
      }
    }, (e) => {
      //cb(e);
      // Server is throttling/rate limiting, we try it again
      //picture(nr);
    });
  }
})();