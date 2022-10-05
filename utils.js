"use strict";

var utils = () => {
  function init(config) {
    // check if container and iframe is already rendered on the DOM
    if (
      document.getElementById("clear-money-connect--widget-div") &&
      document.getElementById("clear-money-connect--frame-id")
    ) {
      document.getElementById("clear-money-connect--widget-div").remove();
    }

    const { key, customerId, bankId, onload, qs, onevent } = config;
    const encodedKeys = ["data"]; // add keys for nested objects to be encoded
    var source = new URL("https://leafy-trifle-143b58.netlify.app");
    source.searchParams.set("key", key);
    source.searchParams.set("customerId", customerId);
    source.searchParams.set("bankId", bankId);
    source.searchParams.set("referrer", window.location.href);

    Object.keys(qs).map((k) => {
      if (encodedKeys.includes(k)) {
        const encodedVal = encodeURIComponent(JSON.stringify(qs[k]));
        return source.searchParams.set(k, encodedVal);
      }
      source.searchParams.set(k, qs[k]);
    });

    var container = document.createElement("div");
    container.setAttribute("id", "clear-money-connect--widget-div");
    container.setAttribute("style", containerStyle);
    document.body.insertBefore(container, document.body.childNodes[0]);

    var iframe = document.createElement("IFRAME");
    iframe.src = `${source.href}`;
    iframe.setAttribute("style", iframeStyle);
    iframe.setAttribute("id", "clear-money-connect--frame-id");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("frameborder", 0);
    iframe.setAttribute("title", "clear-money connect");
    iframe.setAttribute(
      "sandbox",
      "allow-forms allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
    );
    iframe.onload = function () {
      var loader = document.getElementById("clear-money-connect-app-loader");
      if (iframe.style.visibility === "visible") {
        loader.style.display = "none";
      }
      onload();

      // dispatch LOADED event
      let event = new Event("message");
      let eventData = {
        type: "clear-money.connect.widget_loaded",
        data: { timestamp: Date.now() },
      };

      event["data"] = Object.assign({}, eventData);
      window.dispatchEvent(event);

      // manually trigger LOADED since
      // connect does not listen for events until the widget is opened
      onevent("LOADED", event.data.data);
    };

    var loader = createLoader();
    document.getElementById("clear-money-connect--widget-div").appendChild(loader);
    document.getElementById("clear-money-connect--widget-div").appendChild(iframe);
  }

  function turnOnVisibility() {
    var container = document.getElementById("clear-money-connect--widget-div");
    var frame = document.getElementById("clear-money-connect--frame-id");
    container.style.display = "flex";
    frame.style.display = "block";
    container.style.visibility = "visible";
    frame.style.visibility = "visible";
  }

  function turnOffVisibility() {
    var container = document.getElementById("clear-money-connect--widget-div");
    var frame = document.getElementById("clear-money-connect--frame-id");
    container.style.display = "none";
    frame.style.display = "none";
    container.style.visibility = "hidden";
    frame.style.visibility = "hidden";
  }

  function openWidget() {
    var container = document.getElementById("clear-money-connect--widget-div");
    var loader = document.getElementById("clear-money-connect-app-loader");
    var frame = document.getElementById("clear-money-connect--frame-id");
    container.style.visibility = "visible";
    container.style.display = "flex";
    loader.style.display = "block";

    setTimeout(() => {
      turnOnVisibility();
      frame.focus({ preventScroll: false });
      container.focus({ preventScroll: false });

      // dispatch OPENED event
      let event = new Event("message");
      let eventData = {
        type: "clear-money.connect.widget_opened",
        data: { timestamp: Date.now() },
      };
      event["data"] = Object.assign({}, eventData);
      window.dispatchEvent(event);
    }, 2000);
  }

  function closeWidget() {
    turnOffVisibility();
  }

  function createLoader() {
    let loaderDiv = document.createElement("div");
    let childDiv = document.createElement("div");
    loaderDiv.setAttribute("id", "clear-money-connect-app-loader");
    loaderDiv.classList.add("app-loader");
    childDiv.innerHTML =
      '<svg viewBox="0 0 512 512"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" fill="#fff"/> </svg>';
    loaderDiv.appendChild(childDiv);
    return loaderDiv;
  }

  function addStyle() {
    let styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = loaderStyles;
    document.head.appendChild(styleSheet);
  }

  return {
    openWidget: openWidget,
    closeWidget: closeWidget,
    createLoader: createLoader,
    addStyle: addStyle,
    init,
  };
};

module.exports = utils;

const containerStyle =
  "position:fixed;overflow: hidden;display: none;justify-content: center;align-items: center;z-index: 999999999;height: 100%;width: 100%;color: transparent;background: rgba(0, 0, 0, 0.6);visibility:hidden;margin: 0;top:0;right:0;bottom:0;left:0;";
const iframeStyle =
  "position: fixed;display: none;overflow: hidden;z-index: 999999999;width: 100%;height: 100%;transition: opacity 0.3s ease 0s;visibility:hidden;margin: 0;top:0;right:0;bottom:0;left:0;";
const loaderStyles = `.app-loader {
  text-align: center;
  color: white;
  width: 100%;
  position: fixed;
}


.app-loader svg {
  width: 24px;
  height: 24px;
  animation: app-loader__spinner linear 1s infinite;
}

@-webkit-keyframes app-loader__spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;
