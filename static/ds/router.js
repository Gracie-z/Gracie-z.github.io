(() => {
  const workerOrigin = "https://gracie-quant-archive.gracie-quant-archive.workers.dev";
  const workerRoute = "/ds";
  const publicPath = "/ds/";
  const frame = document.querySelector("#dsGuideFrame");

  frame.src = `${workerOrigin}${workerRoute}`;

  window.addEventListener("message", (event) => {
    if (event.origin !== workerOrigin || event.data?.type !== "quant-archive:navigate") return;
    const requestedRoute = String(event.data.route || "").replace(/\/+$/, "");
    if (requestedRoute !== workerRoute) return;
    if (location.pathname !== publicPath) history.replaceState({ route: workerRoute }, "", publicPath);
  });

  window.addEventListener("popstate", () => {
    frame.contentWindow?.postMessage(
      { type: "quant-archive:route", route: workerRoute },
      workerOrigin
    );
  });
})();
