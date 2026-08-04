(() => {
  const workerOrigin = "https://gracie-quant-archive.gracie-quant-archive.workers.dev";
  const publicBase = "/quant";
  const frame = document.querySelector("#quantArchiveFrame");

  function normalizeQuantRoute(value) {
    const route = String(value || "/").replace(/\/+$/, "") || "/";
    return /^\/(?:review|process)?$/.test(route) ? route : "/";
  }

  function routeFromAddress() {
    return normalizeQuantRoute(location.pathname.slice(publicBase.length));
  }

  function quantPublicPath(route) {
    return route === "/" ? `${publicBase}/` : `${publicBase}${route}/`;
  }

  function mlePublicPath(route) {
    const normalized = String(route || "/mle").replace(/\/+$/, "") || "/mle";
    return normalized === "/mle" ? "/mle/" : `${normalized}/`;
  }

  frame.src = `${workerOrigin}${routeFromAddress()}`;

  window.addEventListener("message", (event) => {
    if (event.origin !== workerOrigin || event.data?.type !== "quant-archive:navigate") return;
    const requestedRoute = String(event.data.route || "/").replace(/\/+$/, "") || "/";
    if (/^\/mle(?:\/(?:problems|review|process))?$/.test(requestedRoute)) {
      location.href = mlePublicPath(requestedRoute);
      return;
    }
    const route = normalizeQuantRoute(requestedRoute);
    const path = quantPublicPath(route);
    if (location.pathname !== path) history.pushState({ route }, "", path);
  });

  window.addEventListener("popstate", () => {
    frame.contentWindow?.postMessage({ type: "quant-archive:route", route: routeFromAddress() }, workerOrigin);
  });
})();
