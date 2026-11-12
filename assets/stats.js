(function(){
  /* ====== ESTADÍSTICAS DE VISITAS (Umami, gratis y sin cookies) ======
     Pegá entre las comillas el "Website ID" que te da Umami.
     Mientras esté vacío, la página no mide ni envía nada. */
  var UMAMI_ID = "50268e19-cc3b-42f4-81ee-2fcb4aaffde0";
  /* =================================================================== */

  var URL_SEND = "https://gateway.umami.is/api/send";
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
  var on = !!UMAMI_ID && !local;

  function send(name, data){
    if (!on) return;
    var p = {
      website: UMAMI_ID,
      hostname: location.hostname,
      language: navigator.language || "",
      referrer: document.referrer || "",
      screen: screen.width + "x" + screen.height,
      title: document.title,
      url: location.pathname + location.hash
    };
    if (name) p.name = String(name).slice(0, 50);
    if (data) p.data = data;
    try {
      fetch(URL_SEND, {
        method: "POST", keepalive: true, credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "event", payload: p })
      }).catch(function(){});
    } catch (e) {}
  }

  /* para avisar desde otros scripts: atwTrack("nombre", {dato: "valor"}) */
  window.atwTrack = send;
  if (!on) return;

  send();  // visita a la página

  /* cada botón o link con data-ev cuenta como un evento con ese nombre */
  document.addEventListener("click", function(e){
    var el = e.target.closest && e.target.closest("[data-ev]");
    if (el) send(el.getAttribute("data-ev"));
  }, true);

  /* qué ejemplo abren */
  window.addEventListener("hashchange", function(){
    var h = location.hash.slice(1);
    if (/^demo-[a-z]+$/.test(h)) send("Ejemplo abierto: " + h.slice(5));
  });

  /* hasta dónde bajan: qué secciones llegan a ver */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        send("Sección vista: " + en.target.id);
      });
    }, { threshold: .25 });
    document.addEventListener("DOMContentLoaded", function(){
      document.querySelectorAll("main section[id]").forEach(function(s){ io.observe(s); });
      var n = document.getElementById("statsNote"); if (n) n.hidden = false;
    });
  }
})();
