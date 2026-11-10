(function(){
  /* ====== TUS DATOS DE CONTACTO: completá estas dos líneas ====== */
  var EMAIL    = "AItoque@gmail.com";  // tu correo de trabajo, por ejemplo "hola@altoquewebs.uy"
  var WHATSAPP = "095 774 041";  // tu celular, por ejemplo "099 123 456" (dejalo vacío si no querés WhatsApp)
  /* =============================================================== */

  var $ = function(id){ return document.getElementById(id); };
  var f = $("f"), done = $("done"), err = $("err"), preview = $("preview"),
      mail = $("mail"), wa = $("wa"), copyBtn = $("copy");

  // WhatsApp necesita el número con código de país (598) y sin el 0 inicial
  var waNum = WHATSAPP.replace(/\D/g, "");
  if (waNum.charAt(0) === "0") waNum = "598" + waNum.slice(1);
  else if (waNum && waNum.indexOf("598") !== 0) waNum = "598" + waNum;
  function waLink(text){ return "https://wa.me/" + waNum + "?text=" + encodeURIComponent(text); }

  var where = [];
  if (EMAIL) where.push(EMAIL);
  if (waNum) where.push("WhatsApp " + WHATSAPP);
  if (where.length) { $("addr").textContent = where.join("  ·  "); $("addrLine").hidden = false; }
  else { $("setup").hidden = false; }
  if (EMAIL) mail.hidden = false;
  if (waNum) {
    wa.hidden = false;
    var hello = waLink("Hola, vi la página de Al Toque Webs y quiero consultar por ");
    $("fab").href = hello; $("fab").hidden = false; document.body.classList.add("has-fab");
    $("waDirect").href = hello; $("waDirect").hidden = false;
  }
  if (where.length) {
    $("direct").hidden = false;
    $("directText").innerHTML = "";
    $("directText").appendChild(document.createTextNode("Contacto directo: "));
    var b = document.createElement("b"); b.textContent = where.join("  ·  "); $("directText").appendChild(b);
    $("footContact").textContent = where.join("  ·  ");
  }

  /* páginas de ejemplo: se abren a pantalla completa según el #hash */
  var demo = $("demo"), demoBody = $("demoBody");
  function route(){
    var h = location.hash.slice(1), tpl = /^demo-[a-z]+$/.test(h) ? document.getElementById("tpl-" + h) : null;
    if (!tpl) {
      if (!demo.hidden) {
        demo.hidden = true; demoBody.textContent = ""; document.documentElement.style.overflow = "";
        var t = h && document.getElementById(h); if (t) t.scrollIntoView();
      }
      return;
    }
    var host = document.createElement("div"), root = host.attachShadow({ mode: "open" });
    root.appendChild(tpl.content.cloneNode(true));
    root.addEventListener("click", function(e){
      var b = e.target.closest("[data-go]"); if (!b) return;
      var el = root.getElementById(b.getAttribute("data-go"));
      if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
    root.addEventListener("submit", function(e){
      e.preventDefault(); var ok = e.target.querySelector(".ok"); if (ok) ok.hidden = false;
    });
    demoBody.textContent = ""; demoBody.appendChild(host); demoBody.scrollTop = 0;
    try { initDemo(root, h); } catch (e) {}
    demo.hidden = false; document.documentElement.style.overflow = "hidden";
    demoBody.focus({ preventScroll: true });
  }
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !demo.hidden) location.hash = "ejemplos"; });

  /* comportamiento de las páginas de ejemplo */
  var DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"], DCORTO = ["dom","lun","mar","mié","jue","vie","sáb"];
  function hora(x){ return (x === 24 ? "medianoche" : "las " + Math.floor(x) + (x % 1 ? ":30" : "")); }
  var RV = {
    "demo-barberia": { self: "section h2, section .sub, .sv, .rev, form, .loc, details", kids: ".cuts, .team" },
    "demo-veterinaria": { self: "section h2, section .sub, details, .card", kids: ".quick, .grid, .steps" }
  };
  function initDemo(root, id){
    var now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
    root.querySelectorAll("[data-open]").forEach(function(el){
      var H = JSON.parse(el.getAttribute("data-open")), h = H[d];
      if (h && t >= h[0] && t < h[1]) { el.textContent = "Abierto ahora, cierra a " + hora(h[1]); return; }
      el.classList.add("closed");
      for (var k = (h && t < h[0]) ? 0 : 1; k < 8; k++) {
        var dd = (d + k) % 7;
        if (H[dd]) { el.textContent = "Cerrado ahora, abre " + (k === 0 ? "hoy" : k === 1 ? "mañana" : "el " + DIAS[dd]) + " a " + hora(H[dd][0]); break; }
      }
    });
    root.querySelectorAll("[data-day]").forEach(function(r){ if (+r.getAttribute("data-day") === d) r.classList.add("hoy"); });
    var hd = root.querySelector("header");
    demoBody.onscroll = hd ? function(){ hd.classList.toggle("sc", demoBody.scrollTop > 12); } : null;
    var R = RV[id];
    if (R && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.querySelectorAll("[data-split]").forEach(function(el){
        var txt = el.textContent.trim(); el.setAttribute("aria-label", txt); el.textContent = "";
        txt.split(/\s+/).forEach(function(w, i){
          var a = document.createElement("span"), b = document.createElement("i");
          a.className = "wd"; a.setAttribute("aria-hidden", "true"); b.textContent = w; b.style.setProperty("--i", i);
          a.appendChild(b); if (i) el.appendChild(document.createTextNode(" ")); el.appendChild(a);
        });
      });
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function(es){
          es.forEach(function(en){
            if (!en.isIntersecting) return;
            var el = en.target; el.classList.add("in"); io.unobserve(el);
            if (!el.hasAttribute("data-keep")) setTimeout(function(){ el.classList.remove("rv", "in"); el.style.removeProperty("--d"); }, 1700);
          });
        }, { root: demoBody, rootMargin: "0px 0px -6% 0px", threshold: .06 });
        var arm = function(el, i){ el.classList.add("rv"); el.style.setProperty("--d", (i * 90) + "ms"); io.observe(el); };
        root.querySelectorAll(R.self).forEach(function(el){ arm(el, 0); });
        root.querySelectorAll(R.kids).forEach(function(p){ Array.prototype.forEach.call(p.children, arm); });
      }
    }
    if (id === "demo-barberia") barberia(root, now);
    if (id === "demo-menu") carta(root);
  }
  function barberia(root, now){
    var dias = root.getElementById("dias"), n = 0;
    for (var k = 0; n < 6 && k < 14; k++) {
      var x = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k), wd = x.getDay();
      if (wd === 0 || wd === 1) continue;
      var i = document.createElement("input"), l = document.createElement("label"), s = document.createElement("small");
      i.type = "radio"; i.name = "dd"; i.id = "dd" + n; i.value = DIAS[wd] + " " + x.getDate(); if (!n) i.checked = true;
      l.htmlFor = i.id; l.textContent = k === 0 ? "Hoy" : DCORTO[wd].charAt(0).toUpperCase() + DCORTO[wd].slice(1); s.textContent = x.getDate() + "/" + (x.getMonth() + 1); l.appendChild(s);
      dias.appendChild(i); dias.appendChild(l); n++;
    }
    var f = root.querySelector("form[data-book]");
    function v(name){ var e = f.querySelector('input[name="' + name + '"]:checked'); return e || {}; }
    function upd(){
      root.getElementById("res").textContent = v("sv").value + ", " + v("sv").getAttribute("data-p");
      root.getElementById("res2").textContent = "El " + v("dd").value + " a las " + v("hh").value + ", con " + v("bb").value + ".";
      var sm = f.querySelector(".sum"); sm.classList.remove("fl"); void sm.offsetWidth; sm.classList.add("fl");
    }
    f.addEventListener("change", upd); upd();
  }
  function carta(root){
    var order = {}, bar = root.getElementById("bar"), sheet = root.getElementById("sheet"), lista = root.getElementById("lista"),
        buscar = root.getElementById("buscar"), cats = root.querySelectorAll(".cat"), tabs = root.querySelectorAll("[data-tab]");
    function plata(x){ return "$" + String(x).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
    function norm(s){ return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
    function upd(){
      var c = 0, tot = 0; lista.textContent = "";
      Object.keys(order).forEach(function(k){
        var o = order[k]; if (!o.q) return; c += o.q; tot += o.q * o.p;
        var li = document.createElement("li"), a = document.createElement("span"), b = document.createElement("b");
        a.textContent = o.q + " × " + k; b.textContent = plata(o.q * o.p); li.appendChild(a); li.appendChild(b); lista.appendChild(li);
      });
      bar.hidden = !c; if (!c) sheet.hidden = true;
      root.getElementById("cnt").textContent = c + (c === 1 ? " producto" : " productos");
      root.getElementById("tot").textContent = plata(tot); root.getElementById("tot2").textContent = plata(tot);
      root.querySelectorAll(".it").forEach(function(li){
        var q = (order[li.getAttribute("data-n")] || {}).q || 0;
        li.querySelector(".n").textContent = q; li.querySelector(".n").hidden = !q; li.querySelector(".mn").hidden = !q; li.classList.toggle("on", !!q);
      });
    }
    function filtrar(){
      var q = norm(buscar.value.trim()), fs = [], any = false;
      root.querySelectorAll('[data-f][aria-pressed="true"]').forEach(function(b){ fs.push(b.getAttribute("data-f")); });
      cats.forEach(function(cat, i){
        var vis = 0;
        cat.querySelectorAll(".it").forEach(function(li){
          var tg = " " + li.getAttribute("data-t") + " ";
          var ok = (!q || norm(li.querySelector(".tx").textContent).indexOf(q) >= 0) && fs.every(function(x){ return tg.indexOf(" " + x + " ") >= 0; });
          li.hidden = !ok; if (ok) vis++;
        });
        cat.hidden = !vis; tabs[i].hidden = !vis; any = any || vis > 0;
      });
      root.getElementById("vacio").hidden = any;
    }
    buscar.addEventListener("input", filtrar);
    root.addEventListener("click", function(e){
      var b = e.target.closest(".pl,.mn");
      if (b) {
        var li = b.closest(".it"), k = li.getAttribute("data-n");
        order[k] = order[k] || { p: +li.getAttribute("data-p"), q: 0 };
        order[k].q = Math.max(0, order[k].q + (b.classList.contains("pl") ? 1 : -1)); upd(); return;
      }
      var fb = e.target.closest("[data-f]");
      if (fb) { fb.setAttribute("aria-pressed", fb.getAttribute("aria-pressed") !== "true"); filtrar(); return; }
      if (e.target.closest("#ver")) { root.getElementById("sent").hidden = true; sheet.hidden = false; root.getElementById("enviar").focus(); return; }
      if (e.target.closest("#cerrar") || e.target === sheet) { sheet.hidden = true; return; }
      if (e.target.closest("#enviar")) root.getElementById("sent").hidden = false;
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function(es){
        es.forEach(function(en){
          if (!en.isIntersecting) return;
          tabs.forEach(function(tb){
            var on = tb.getAttribute("data-tab") === en.target.id; tb.setAttribute("aria-current", on);
            if (on && tb.scrollIntoView) { var p = tb.parentNode; p.scrollLeft = tb.offsetLeft - p.offsetLeft - 18; }
          });
        });
      }, { root: demoBody, rootMargin: "-80px 0px -65% 0px" });
      cats.forEach(function(c){ io.observe(c); });
    }
  }

  document.querySelectorAll("[data-plan]").forEach(function(a){
    a.addEventListener("click", function(){
      var v = a.getAttribute("data-plan");
      var r = document.querySelector('#chips input[value="' + v + '"]'); if (r) r.checked = true;
    });
  });

  function mark(el, bad){ el.setAttribute("aria-invalid", bad ? "true" : "false"); }
  ["nombre","email","negocio","idea"].forEach(function(k){
    f[k].addEventListener("input", function(){ if (f[k].getAttribute("aria-invalid") === "true") { mark(f[k], false); err.textContent = ""; } });
  });

  f.addEventListener("submit", function(e){
    e.preventDefault();
    var n = f.nombre, m = f.email, neg = f.negocio, idea = f.idea;
    var okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim());
    mark(n, !n.value.trim()); mark(m, !okMail); mark(neg, !neg.value.trim()); mark(idea, !idea.value.trim());
    if (!n.value.trim()) { err.textContent = "Escribí tu nombre."; n.focus(); return; }
    if (!okMail) { err.textContent = "Revisá tu correo: así te puedo responder."; m.focus(); return; }
    if (!neg.value.trim()) { err.textContent = "Contame cómo se llama tu negocio."; neg.focus(); return; }
    if (!idea.value.trim()) { err.textContent = "Contame en pocas palabras qué te gustaría."; idea.focus(); return; }
    err.textContent = "";
    var serv = f.querySelector('input[name="servicio"]:checked').value;
    var subject = "Consulta web: " + neg.value.trim() + " (" + serv + ")";
    var body = "Nombre: " + n.value.trim() + "\nCorreo: " + m.value.trim() +
      (f.tel.value.trim() ? "\nTeléfono: " + f.tel.value.trim() : "") +
      "\nNegocio: " + neg.value.trim() + "\nMe interesa: " + serv + "\n\nMi idea:\n" + idea.value.trim();
    preview.textContent = "Asunto: " + subject + "\n\n" + body;
    if (EMAIL) mail.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    if (waNum) wa.href = waLink("Hola, te escribo desde la página de Al Toque Webs.\n\n" + body);
    copyBtn.querySelector("span").textContent = "Copiar mensaje";
    f.style.display = "none"; done.classList.add("show");
    done.querySelector("h3").setAttribute("tabindex", "-1"); done.querySelector("h3").focus();
  });
  $("back").addEventListener("click", function(){
    done.classList.remove("show"); f.style.display = ""; f.idea.focus();
  });
  copyBtn.addEventListener("click", function(){
    var s = this.querySelector("span");
    var txt = (where.length ? "Para: " + where.join(" / ") + "\n" : "") + preview.textContent;
    try {
      navigator.clipboard.writeText(txt)
        .then(function(){ s.textContent = "Copiado"; }, function(){ s.textContent = "Seleccioná y copiá"; });
    } catch(e){ s.textContent = "Seleccioná y copiá"; }
  });

  window.addEventListener("hashchange", route); route();

  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".tilt").forEach(function(k){
      k.addEventListener("pointermove", function(e){
        var r = k.getBoundingClientRect(), px = (e.clientX - r.left)/r.width - .5, py = (e.clientY - r.top)/r.height - .5;
        k.style.setProperty("--rx", (-py*5) + "deg"); k.style.setProperty("--ry", (px*7) + "deg");
        k.style.setProperty("--gx", ((px+.5)*100) + "%"); k.style.setProperty("--gy", ((py+.5)*100) + "%");
      });
      k.addEventListener("pointerleave", function(){ k.style.setProperty("--rx","0deg"); k.style.setProperty("--ry","0deg"); });
    });
  }
})();
