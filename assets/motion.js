(function(){
  var root = document.documentElement;
  if (!window.gsap) { root.classList.remove("anim"); return; }
  gsap.registerPlugin(ScrollTrigger);

  function splitWords(el){
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    var out = [], parts = [];
    el.childNodes.forEach(function(n){
      var cls = n.nodeType === 1 ? n.className : "";
      n.textContent.trim().split(/\s+/).filter(Boolean).forEach(function(w){ parts.push({ w: w, cls: cls }); });
    });
    el.textContent = "";
    parts.forEach(function(p, k){
      var m = document.createElement("span"); m.className = "w"; m.setAttribute("aria-hidden", "true");
      var i = document.createElement("span"); i.textContent = p.w; if (p.cls) i.className = p.cls;
      m.appendChild(i);
      if (k) el.appendChild(document.createTextNode(" "));
      el.appendChild(m); out.push(i);
    });
    return out;
  }

  var mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", function(){
    var start = function(){
      var words = splitWords(document.querySelector(".hero h1"));
      root.classList.remove("anim");
      var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(words, { yPercent: 115, duration: .9, stagger: .07 })
        .from(".hero .sub, .hero .ctas, .hero .trust", { y: 24, duration: .7, stagger: .1 }, "-=.6")
        .from("#phone .blk", { scaleY: 0, transformOrigin: "50% 0%", duration: .45, stagger: .11, ease: "back.out(1.8)" }, "-=.5")
        .from(".seal", { scale: 0, rotate: -90, duration: .6, ease: "back.out(1.6)" }, "-=.2");
      gsap.to("#phone", { y: -10, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
      gsap.to(".phone-wrap", { rotate: -6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.from("[data-count]", { textContent: 0, duration: 1.4, ease: "power2.out", snap: { textContent: 1 }, stagger: .15, delay: 1 });
    };
    (document.fonts && document.fonts.ready) ? document.fonts.ready.then(start) : start();

    var sk = gsap.quickTo(".marquee", "skewX", { duration: .4 }), t;
    ScrollTrigger.create({ onUpdate: function(s){
      sk(gsap.utils.clamp(-5, 5, s.getVelocity() / -280));
      clearTimeout(t); t = setTimeout(function(){ sk(0); }, 120);
    }});
  });

  mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", function(){
    document.querySelectorAll("[data-magnetic]").forEach(function(b){
      var x = gsap.quickTo(b, "x", { duration: .5, ease: "power3" }), y = gsap.quickTo(b, "y", { duration: .5, ease: "power3" });
      b.addEventListener("pointermove", function(e){ var r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width/2) * .25); y((e.clientY - r.top - r.height/2) * .25); });
      b.addEventListener("pointerleave", function(){ x(0); y(0); });
    });
  });
})();
