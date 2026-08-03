(() => {
  const workerOrigin = "https://gracie-quant-archive.gracie-quant-archive.workers.dev";
  const publicBase = "/quant";
  const frame = document.querySelector("#quantArchiveFrame");

  function normalizeRoute(value) {
    const route = String(value || "/").replace(/\/+$/, "") || "/";
    return /^\/(?:review|process|mle(?:\/(?:review|process))?)?$/.test(route) ? route : "/";
  }

  function routeFromAddress() {
    return normalizeRoute(location.pathname.slice(publicBase.length));
  }

  function publicPath(route) {
    return route === "/" ? `${publicBase}/` : `${publicBase}${route}`;
  }

  frame.src = `${workerOrigin}${routeFromAddress()}`;

  window.addEventListener("message", (event) => {
    if (event.origin !== workerOrigin || event.data?.type !== "quant-archive:navigate") return;
    const route = normalizeRoute(event.data.route);
    const path = publicPath(route);
    if (location.pathname !== path) history.pushState({ route }, "", path);
  });

  window.addEventListener("popstate", () => {
    frame.contentWindow?.postMessage({ type: "quant-archive:route", route: routeFromAddress() }, workerOrigin);
  });
})();
