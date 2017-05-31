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
    const PREF = "003162186";
    let begin = 4000;
    const END = 4030;
    let pics = 0;
    const PICS_MAX = 10;   // TODO: tweak, not tested.

    document.addEventListener('openPic',  (e) => {
        const data = e.detail;
        console.log("<> "+ JSON.stringify(data));
        picture(data.phone, (out) => {
            console.log("ben ik " + out);
            //chrome.tabs.create({ url: "http://nu.nl" });
            const html = `<div id="overlay">
                              <img src="${out.img}">
                          </div>  `;

            $("body").append(html);
            //window.open("data:text/html;charset=utf-8," + html, "")

        });
    });

    var evt = document.createEvent("CustomEvent");
    let toDB = (json) => {
        console.log(" JSOOOOOOOOOOOOON   ");
        console.log(json);
        console.log("--------------");
        evt.initCustomEvent("toDB", true, true, json);
        document.dispatchEvent(evt);

    }

    let picture = (nr, cb) => {
        console.log("nr: " + nr);
        pics++;
        Store.ProfilePicThumb.find( nr + '@c.us').then((d) => {
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
                cb( {"thumb" : d.img, "img" : d.imgFull } );
                // toDB({"img" : d.img, "full" : d.imgFull});
            }
        }, (e) => {
            //cb(e);
            // Server is throttling/rate limiting, we try it again
            //picture(nr);
        });

    }

    let start = () => {
      console.log("start ");
      //addMongo();

      let scrape = setInterval(() => {
              const NR = PREF + begin;
              console.log(NR);
              if(pics < PICS_MAX) {
                  picture(NR);
                  if(begin > END) {
                    clearInterval(scrape);
                    console.log("STOP");
                  } else {
                    begin++;
                  }
              }
        }, 400);
    }

    // check if Store is ready, then start scraping
    let wait = setInterval(() => {
      console.log($("body"));

      //console.log(Store);
      if(Store) {
        clearInterval(wait);
        // console.clear();
        // setTimeout(() => start() , 15000);
      } else {
        console.log(".. Store waiting ..");
      }
    }, 300);
})();
