$("#get").click(() => {
    let phone = $("#phone").val();
// var evt=document.createEvent("CustomEvent");
// evt.initCustomEvent("yourCustomEvent", true, true, data);
// document.dispatchEvent(evt);

    chrome.tabs.executeScript(null, { code : `
          document.dispatchEvent(new CustomEvent('openPic', {
              detail: {
                command:  'foto',
                phone: '${phone}'
              }
          }));
        ` }, (o) => {
        console.log(o);
        //  alert(phone);
    });
    //chrome.tabs.create({ url: "http://nu.nl" });

});

/*
chrome.tabs.executeScript(null, { code : `document.dispatchEvent(new Event('MY_API'));` }, (o) => {
    console.log("o.test");
    console.log(o.test);
    //alert(phone);
});
*/
