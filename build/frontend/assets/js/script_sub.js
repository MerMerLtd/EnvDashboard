const to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err, null]);
};
const makeRequest = opts => {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      // only run if the request is complete
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        // If successful
        opts.responseType === "arraybuffer"
          ? resolve(new Uint8Array(xhr.response))
          : resolve(JSON.parse(xhr.responseText));
      } else {
        // If false
        reject(xhr.response);
      }
    };
    // Setup HTTP request
    xhr.open(opts.method || "GET", opts.url, true);
    if (opts.headers) {
      Object.keys(opts.headers).forEach(key =>
        xhr.setRequestHeader(key, opts.headers[key])
      );
    }
    // Send the request
    if (opts.contentType === "application/json") {
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(JSON.stringify(opts.payload));
    } else {
      xhr.send(opts.payload);
    }
  });
};
let els = {
  container: document.querySelector(".container"),
  containerToggle: document.querySelector("#container-toggle"),
  iframeMain: document.querySelector(".iframe__main"),
  iframeMenu: document.querySelector(".iframe__menu")
};

const renderLoader = parentNode => {
  // console.log(parentNode);
  const markup = `
  <div class="lds-ellipsis" id="loader">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>`;
  Array.from(parentNode.children).forEach(
    child => (child.style.display = "none")
  );
  parentNode.insertAdjacentHTML("beforeend", markup);
};

const removeLoader = parentNode => {
  console.log("run");
  document.querySelector("#loader").remove();
  console.log(parentNode);
  Array.from(parentNode.children).forEach(child => {
    child.style.display = "block";
  });
};

const handleIframe = evt => {
  if (!evt.target.matches(".iframe__cover")) return;
  // console.log(
  //   evt.target,
  //   evt.target.parentNode,
  //   evt.target.parentNode.dataset.url
  // );
  const url = evt.target.parentNode.dataset.url;
  !url.includes("#") ? window.open(evt.target.parentNode.dataset.url) : null;
  // const number = evt.target.parentNode.dataset.number;
  // const markup = `<iframe src="${url}" frameborder="0" width="100%" height="100%" data-number=${number}></iframe>`;
  // Array.from(document.querySelectorAll(".iframe__cover")).forEach(cover =>
  //   evt.target === cover
  //     ? (cover.style.display = "none")
  //     : (cover.style.display = "block")
  // );
  // els.containerToggle.checked = true;
  // els.iframeMain.innerHTML = "";
  // els.iframeMain.insertAdjacentHTML("afterbegin", markup);
  // renderLoader(els.iframeMain);
  // setTimeout(_ => removeLoader(els.iframeMain), 5000);
};

// window.onload = () => {};
const urls = [
  `https://air10.epa.gov.tw/`,
  `https://apmis.epa.gov.tw/air1/login`,
  `#210.63.206.171/default/index`, //
  `#http://atis.ntpc.gov.tw/`, //
  `http://pollution.epd.ntpc.gov.tw/ntpcepd_new/manager/`,
  `https://epacar.epa.gov.tw/login.aspx`,
  `#https://www.mrpv.org.tw/index.aspx`, //
  `https://air.epa.gov.tw/AirEpa_Emergency/login.aspx`
];
const appendIframe = urls => {
  urls.forEach((url, idx) => {
    const markup = `
    <div class="iframe__img-box  ${
      url.includes("#") ? "disable" : ""
    }" data-url="${url}" data-number="${idx + 1}">
      <img src="./assets/img/iframe__cover--${idx +
        1}.png" alt="iframe__cover--${idx + 1}" class="iframe__img ${
      url.includes("#") ? "disable" : ""
    }">
      <div class="iframe__cover"></div>
    </div>`;
    // const markup =
    //  `<div class="iframe__container" data-number="iframe--${idx}" data-url="${url}">
    //     <iframe
    //      src=""
    //      frameborder="0"
    //       class="iframe">
    //     </iframe>
    //     <div class="iframe__cover"></div>
    //   </div>`;
    els.iframeMenu.insertAdjacentHTML("beforeend", markup);
  });
};

appendIframe(urls);

els.iframeMenu.addEventListener("click", handleIframe, false);
