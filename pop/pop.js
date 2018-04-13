$("#get").click(() => {
  const phone = $("#phone").val();

  chrome.tabs.executeScript(null, {
    //
    code: `
          document.dispatchEvent(new CustomEvent('openPic', {
              detail: {
                command:  'foto',
                phone: '${phone}'
              }
          }));
        `
  }, (o) => {
    console.log(o);
  });
});

window.addEventListener('error', function(event) {
  $("#error").append(`${event}<br>`)
})

$("#reload").click(() => {
  chrome.runtime.reload();
});

$("#info").html(`v. ${chrome.runtime.getManifest().version}`);