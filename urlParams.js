function urlSetParam(param, value) {
  const path = window.location.href.split("?")[0];
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(param, value);
  history.pushState({}, "", `${path}?${urlParams}`);
}
function urlGetParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
function urlClear() {
  const path = window.location.href.split("?")[0];
  history.replaceState({}, "", `${path}`);
}
export { urlSetParam, urlGetParam, urlClear };
