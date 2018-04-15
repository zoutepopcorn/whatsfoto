console.clear();

const splitNrs = (nrs) => { // format numbers
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

const action = (command, input) => {
  chrome.tabs.executeScript(null, {
    code: `
          document.dispatchEvent(new CustomEvent('action', {
              detail: {
                command:  '${command}',
                phone: '${input}'
              }
          }));
        `
  }, (o) => {
    console.log(o);
  });
}

window.addEventListener('error', function(event) {
  $("#error").append(`${event}<br>`)
})

$("#reload").click(() => {
  chrome.runtime.reload();
});

$("#info").html(`v. ${chrome.runtime.getManifest().version}`);

$(".onder").hide();
console.log($("#but_images"))

$(".radio-button").click((el) => {
  $(".onder").hide();
  $(`#t_${el.target.id}`).show();
  console.log(el.target.id);
})

$("button").click((obj) => {
  const CL = obj.target.id;
  if (CL == "but_images") {
    console.log("images");
    const NRS = splitNrs($("#nr_array").val());
    console.log(NRS);
    action('images', NRS);
    // console.log($("#nr_array").val());
  }
  if (CL == "but_bulk") {
    const SPLIT = `${$("#nr_from").val()}, ${$("#nr_to").val()}`;
    console.log(SPLIT);
    const NRS = splitNrs(SPLIT);
    console.log(NRS);
    action('bulk', NRS);
    console.log("bulk");
  }
});