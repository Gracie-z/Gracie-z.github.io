(() => {
  const workerOrigin = "https://gracie-quant-archive.gracie-quant-archive.workers.dev";
  const workerVersion = "20260810-10";
  const publicBase = "/mle";
  const frame = document.querySelector("#mleArchiveFrame");

  function normalizeWorkerRoute(value) {
    const route = String(value || "/mle").replace(/\/+$/, "") || "/mle";
    if (route === "/mle/problems") return "/mle";
    return /^\/mle(?:\/(?:cs224n|review|advice|process))?$/.test(route) ? route : "/mle";
  }

  function workerRouteFromAddress() {
    const suffix = location.pathname.slice(publicBase.length).replace(/^\/+|\/+$/g, "");
    return normalizeWorkerRoute(suffix ? `/mle/${suffix}` : "/mle");
  }

  function mlePublicPath(route) {
    return route === "/mle" ? "/mle/" : `${route}/`;
  }

  function quantPublicPath(route) {
    const normalized = String(route || "/").replace(/\/+$/, "") || "/";
    return normalized === "/" ? "/quant/" : `/quant${normalized}/`;
  }

  frame.src = `${workerOrigin}${workerRouteFromAddress()}?v=${workerVersion}`;

  window.addEventListener("message", (event) => {
    if (event.origin !== workerOrigin || event.data?.type !== "quant-archive:navigate") return;
    const requestedRoute = String(event.data.route || "/").replace(/\/+$/, "") || "/";
    if (!requestedRoute.startsWith("/mle")) {
      location.href = quantPublicPath(requestedRoute);
      return;
    }
    const route = normalizeWorkerRoute(requestedRoute);
    const path = mlePublicPath(route);
    if (location.pathname !== path) history.pushState({ route }, "", path);
  });

  window.addEventListener("popstate", () => {
    frame.contentWindow?.postMessage(
      { type: "quant-archive:route", route: workerRouteFromAddress() },
      workerOrigin
    );
  });
})();
