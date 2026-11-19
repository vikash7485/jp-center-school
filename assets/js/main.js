/* J.P. Central School — site interactions */
(function () {
  "use strict";

  // Ticker: duplicate items so the loop is seamless
  document.querySelectorAll(".ticker-inner").forEach(function (t) { t.innerHTML += t.innerHTML; });

  // Sticky header shadow + back-to-top
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");
  var backdrop = document.querySelector(".nav-backdrop");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    backdrop.classList.toggle("show", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && nav && backdrop) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    backdrop.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Animated counters
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  // Gallery filters
  var filterBtns = document.querySelectorAll(".filters button");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      document.querySelectorAll(".gallery-grid a").forEach(function (a) {
        var show = f === "all" || (a.getAttribute("data-cat") || "").split(" ").indexOf(f) !== -1;
        a.classList.toggle("hide", !show);
      });
    });
  });

  // Lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-grid a"));
  if (items.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = '<button class="lb-btn lb-close" aria-label="Close">×</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous">‹</button>' +
      '<figure style="margin:0"><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-btn lb-next" aria-label="Next">›</button>';
    document.body.appendChild(lb);
    var img = lb.querySelector("img"), cap = lb.querySelector("figcaption"), idx = 0;
    function visible() { return items.filter(function (a) { return !a.classList.contains("hide"); }); }
    function show(i) {
      var v = visible(); if (!v.length) return;
      idx = (i + v.length) % v.length;
      img.src = v[idx].getAttribute("href");
      img.alt = v[idx].getAttribute("data-caption") || "";
      cap.textContent = v[idx].getAttribute("data-caption") || "";
    }
    items.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        show(visible().indexOf(a));
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  // Enquiry forms → open WhatsApp chat with the school, message pre-filled
  document.querySelectorAll("form[data-whatsapp]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var lines = [form.getAttribute("data-title") || "Enquiry from website"];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !el.value) return;
        var label = form.querySelector('label[for="' + el.id + '"]');
        lines.push((label ? label.textContent.replace("*", "").trim() : el.name) + ": " + el.value.trim());
      });
      var url = "https://wa.me/" + form.getAttribute("data-whatsapp") + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
