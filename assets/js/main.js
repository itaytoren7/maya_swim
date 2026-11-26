/* =========================================================
   MAYA SWIM — לוגיקת האתר / Site logic
   שפה, קולקציה, חלון פרטים, מדריך מידות, טפסים ותפריט נגישות.
   אין תלות בספריות חיצוניות.
   ========================================================= */
(function () {
  "use strict";

  var C = window.MAYA_CONFIG || {};
  var I = window.MAYA_I18N || { he: {}, en: {} };
  var root = document.documentElement;
  root.classList.add("js");

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ---------- Storage (safe) ---------- */
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  /* ---------- Language ---------- */
  var params = new URLSearchParams(location.search);
  var lang = params.get("lang") || store.get("maya-lang") || "he";
  if (!I[lang]) lang = "he";

  function t(key, vars) {
    var s = (I[lang] && I[lang][key] != null) ? I[lang][key] : (I.he[key] != null ? I.he[key] : key);
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split("{" + v + "}").join(vars[v]); });
    return s;
  }
  function L(obj) { return obj ? (obj[lang] != null ? obj[lang] : obj.he) : ""; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function applyLang() {
    root.lang = lang;
    root.dir = lang === "he" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    $$("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });

    var titleKey = document.body.getAttribute("data-title-key");
    if (titleKey) document.title = t(titleKey);
    var md = $('meta[name="description"]');
    if (md && document.body.getAttribute("data-page") === "home") md.setAttribute("content", t("meta.desc"));

    var lb = $("#langBtn");
    if (lb) {
      lb.textContent = t("lang.short");
      lb.setAttribute("aria-label", t("lang.label"));
      lb.setAttribute("lang", lang === "he" ? "en" : "he");
    }
    var mb = $("#menuBtn");
    if (mb) mb.setAttribute("aria-label", t(mb.getAttribute("aria-expanded") === "true" ? "nav.close" : "nav.menu"));

    renderDesigns();
    renderDesignSelect();
    renderSizes();
    renderFinderResult();
    applyContactLinks();
    updateFilterStatus(false);
  }

  function toggleLang() {
    lang = lang === "he" ? "en" : "he";
    store.set("maya-lang", lang);
    if (params.has("lang")) {
      params.delete("lang");
      var q = params.toString();
      history.replaceState(null, "", location.pathname + (q ? "?" + q : "") + location.hash);
    }
    applyLang();
  }

  /* ---------- Contact links ---------- */
  function waLink(msg) {
    var num = String(C.whatsapp || "").replace(/\D/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(msg);
  }
  function applyContactLinks() {
    $$(".js-wa").forEach(function (a) { a.href = waLink(t(a.getAttribute("data-wa-msg") || "wa.general")); });
    $$(".js-ig").forEach(function (a) { a.href = "https://www.instagram.com/" + encodeURIComponent(C.instagram || ""); });
    $$(".js-mail").forEach(function (a) { a.href = "mailto:" + (C.email || ""); });
    $$(".js-ig-handle").forEach(function (el) { el.textContent = "@" + (C.instagram || ""); });
    $$(".js-mail-text").forEach(function (el) { el.textContent = C.email || ""; });
  }

  /* ---------- Collection ---------- */
  var designs = C.designs || [];
  var currentFilter = "all";
  var observer = null;
  var designsRendered = false;

  function designById(id) { return designs.filter(function (d) { return d.id === id; })[0]; }

  function renderDesigns() {
    var grid = $("#designGrid");
    if (!grid) return;
    grid.innerHTML = designs.map(function (d, i) {
      var name = L(d.name);
      var alt = t("card.alt", { name: name, type: t("type." + d.type), color: L(d.color) });
      var hidden = currentFilter !== "all" && d.type !== currentFilter ? " hidden" : "";
      return '<li class="design-card reveal' + (designsRendered || !observer ? " is-in" : "") + '" data-type="' + esc(d.type) + '" data-delay="' + (i % 3) + '"' + hidden + '>' +
        '<div class="design-card__media"><span class="badge">' + esc(t("card.limited")) + '</span>' +
        '<img src="' + esc(d.image) + '" alt="' + esc(alt) + '" width="400" height="500" loading="lazy" decoding="async"></div>' +
        '<div class="design-card__body">' +
        '<p class="design-card__type">' + esc(t("type." + d.type)) + '</p>' +
        '<h3 class="design-card__name">' + esc(name) + '</h3>' +
        '<p class="design-card__short">' + esc(L(d.short)) + '</p>' +
        '<div class="design-card__foot">' +
        '<ul class="swatches" aria-hidden="true">' + (d.swatches || []).map(function (c) { return '<li style="background:' + esc(c) + '"></li>'; }).join("") + '</ul>' +
        '<span class="design-card__edition">' + esc(t("card.edition", { n: d.edition })) + '</span>' +
        '</div>' +
        '<p style="margin:1rem 0 0"><button class="design-card__btn" type="button" data-open="' + esc(d.id) + '" aria-label="' + esc(t("card.detailsOf", { name: name })) + '">' +
        esc(t("card.details")) + ' <svg class="flip" width="16" height="16" aria-hidden="true"><use href="#i-arrow"/></svg></button></p>' +
        '</div></li>';
    }).join("");
    if (!designsRendered && observer) $$(".design-card", grid).forEach(function (el) { observer.observe(el); });
    designsRendered = true;
    var stat = $("#statDesigns");
    if (stat) stat.textContent = String(designs.length).padStart(2, "0");
  }

  function setFilter(f) {
    currentFilter = f;
    $$(".filter-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === f)); });
    $$(".design-card").forEach(function (card) {
      card.hidden = f !== "all" && card.getAttribute("data-type") !== f;
    });
    updateFilterStatus(true);
  }
  function updateFilterStatus(announce) {
    var st = $("#filterStatus");
    if (!st) return;
    var n = $$(".design-card").filter(function (c) { return !c.hidden; }).length;
    st.textContent = announce ? t("filter.status", { n: n }) : "";
  }

  /* ---------- Design dialog ---------- */
  var dialog = $("#designDialog");
  var lastOpener = null;
  var openId = null;

  function fillDialog(id) {
    var d = designById(id);
    if (!d || !dialog) return;
    openId = id;
    var name = L(d.name);
    $("#dlg-img").src = d.image;
    $("#dlg-img").alt = t("card.alt", { name: name, type: t("type." + d.type), color: L(d.color) });
    $("#dlg-type").textContent = t("type." + d.type);
    $("#dlg-title").textContent = name;
    $("#dlg-desc").textContent = L(d.description);
    $("#dlg-color").textContent = L(d.color);
    $("#dlg-fabric").textContent = L(d.fabric);
    $("#dlg-edition").textContent = t("card.edition", { n: d.edition });
    $("#dlg-wa").href = waLink(t("wa.design", { name: name }));
  }
  function openDialog(id, opener) {
    if (!dialog) return;
    lastOpener = opener || null;
    fillDialog(id);
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    var closeBtn = $("[data-close]", dialog);
    if (closeBtn) closeBtn.focus();
  }
  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
  }
  if (dialog) {
    dialog.addEventListener("close", function () {
      openId = null;
      if (lastOpener && document.body.contains(lastOpener)) lastOpener.focus();
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeDialog();
      if (e.target.closest("[data-close]")) closeDialog();
    });
    var toForm = $("#dlg-form");
    if (toForm) toForm.addEventListener("click", function (e) {
      e.preventDefault();
      var id = openId;
      lastOpener = null;
      closeDialog();
      var sel = $("#cf-design"); if (sel && id) sel.value = id;
      var sub = $("#cf-subject"); if (sub) sub.value = "custom";
      goTo("#contact", "#cf-name");
    });
  }

  function goTo(hash, focusSel) {
    var target = $(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    var f = focusSel ? $(focusSel) : null;
    if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, prefersReducedMotion() ? 0 : 600);
  }
  function prefersReducedMotion() {
    return root.classList.contains("a11y-noanim") || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* ---------- Contact form design select ---------- */
  function renderDesignSelect() {
    var sel = $("#cf-design");
    if (!sel) return;
    var current = sel.value;
    sel.innerHTML = '<option value="">' + esc(t("form.design.none")) + "</option>" +
      designs.map(function (d) { return '<option value="' + esc(d.id) + '">' + esc(L(d.name)) + " · " + esc(t("type." + d.type)) + "</option>"; }).join("");
    sel.value = current;
  }

  /* ---------- Size guide ---------- */
  var sizes = C.sizes || [];
  var unit = "cm";
  var lastFinder = null;

  function fmt(v) {
    if (unit === "cm") return String(v);
    var x = Math.round((v / 2.54) * 10) / 10;
    return String(x);
  }
  function range(r) { return fmt(r[0]) + "–" + fmt(r[1]); }

  function renderSizes() {
    var body = $("#sizeRows");
    if (!body) return;
    var match = lastFinder ? lastFinder.one : null;
    body.innerHTML = sizes.map(function (s) {
      return '<tr' + (match === s.size ? ' class="is-match"' : "") + '><th scope="row">' + esc(s.size) + "</th><td>" + esc(s.eu) +
        "</td><td><span>" + range(s.bust) + "</span></td><td><span>" + range(s.waist) + "</span></td><td><span>" + range(s.hips) + "</span></td></tr>";
    }).join("");
    var cap = $("#sizeCaption");
    if (cap) { cap.setAttribute("data-i18n", "sizes.caption." + unit); cap.textContent = t("sizes.caption." + unit); }
    $$("[data-unit]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-unit") === unit)); });
  }

  // Returns index of the size for a measurement, -1 if below chart, sizes.length if above
  function sizeIndex(value, key) {
    if (!value) return null;
    if (value < sizes[0][key][0] - 3) return -1;
    for (var i = 0; i < sizes.length; i++) { if (value <= sizes[i][key][1]) return i; }
    return sizes.length;
  }
  function label(idx) {
    if (idx === null) return null;
    if (idx < 0 || idx >= sizes.length) return "custom";
    return sizes[idx].size;
  }

  function runFinder(e) {
    if (e) e.preventDefault();
    var num = function (id) { var v = parseFloat(($(id) || {}).value); return isFinite(v) && v > 0 ? v : null; };
    var bust = num("#fd-bust"), waist = num("#fd-waist"), hips = num("#fd-hips");
    if (!bust && !waist && !hips) { lastFinder = { empty: true }; renderFinderResult(); return; }
    var bi = sizeIndex(bust, "bust"), wi = sizeIndex(waist, "waist"), hi = sizeIndex(hips, "hips");
    var top = label(bi);
    var bottom = label(hi !== null ? hi : wi);
    var all = [bi, wi, hi].filter(function (x) { return x !== null; });
    var one = all.some(function (x) { return x < 0 || x >= sizes.length; }) ? "custom" : label(Math.max.apply(null, all));
    lastFinder = { top: top, bottom: bottom, one: one };
    renderFinderResult();
    renderSizes();
  }

  function renderFinderResult() {
    var box = $("#finderResult");
    if (!box || !lastFinder) return;
    box.hidden = false;
    if (lastFinder.empty) { box.innerHTML = "<p>" + esc(t("finder.empty")) + "</p>"; return; }
    var cell = function (k, v) {
      if (!v) return "<div><dt>" + esc(t(k)) + "</dt><dd>—</dd></div>";
      if (v === "custom") return "<div><dt>" + esc(t(k)) + '</dt><dd class="is-custom">' + esc(t("finder.custom")) + "</dd></div>";
      return "<div><dt>" + esc(t(k)) + "</dt><dd>" + esc(v) + "</dd></div>";
    };
    box.innerHTML = "<h4>" + esc(t("finder.result.title")) + "</h4><dl>" +
      cell("finder.result.top", lastFinder.top) + cell("finder.result.bottom", lastFinder.bottom) + cell("finder.result.one", lastFinder.one) +
      "</dl><p>" + esc(t("finder.note")) + "</p>";
  }

  /* ---------- Forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(field) {
    var msg = "";
    if (field.type === "checkbox") { if (!field.checked) msg = t("err.consent"); }
    else if (!field.value.trim()) msg = t("err.required");
    else if (field.type === "email" && !EMAIL_RE.test(field.value.trim())) msg = t("err.email");
    var err = $("#" + field.id + "-err");
    if (err) err.textContent = msg;
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  function validate(form) {
    var firstBad = null;
    $$("[required]", form).forEach(function (field) {
      if (!validateField(field) && !firstBad) firstBad = field;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function setStatus(el, kind, msg) {
    if (!el) return;
    el.className = el.className.replace(/\bis-(success|error)\b/g, "").trim() + (kind ? " is-" + kind : "");
    el.textContent = msg || "";
  }

  function send(endpoint, data, mailSubject, mailBody) {
    if (endpoint) {
      return fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: data })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return "sent"; });
    }
    // No endpoint configured yet: open the visitor's email app with the message ready
    window.location.href = "mailto:" + (C.email || "") + "?subject=" + encodeURIComponent(mailSubject) + "&body=" + encodeURIComponent(mailBody);
    return Promise.resolve("mailto");
  }

  function wireForm(form, opts) {
    if (!form) return;
    $$("[required]", form).forEach(function (f) {
      f.addEventListener(f.type === "checkbox" ? "change" : "blur", function () {
        if (f.getAttribute("aria-invalid") === "true") validateField(f);
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = $(opts.status);
      setStatus(status, "", "");
      if (!validate(form)) return;
      var hp = form.querySelector('[name="_gotcha"]');
      if (hp && hp.value) { setStatus(status, "success", t(opts.success)); form.reset(); return; }
      var data = new FormData(form);
      var built = opts.build(data);
      data.append("_subject", built.subject);
      data.append("language", lang);
      var btn = form.querySelector('[type="submit"]');
      var btnText = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = t("form.sending"); }
      send(opts.endpoint(), data, built.subject, built.body)
        .then(function (how) {
          setStatus(status, "success", t(how === "mailto" ? "form.mailto" : opts.success));
          if (how !== "mailto") form.reset();
        })
        .catch(function () { setStatus(status, "error", t("form.error")); })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = btnText; } });
    });
  }

  wireForm($("#contactForm"), {
    status: "#contactStatus",
    success: "form.success",
    endpoint: function () { return C.formEndpoint; },
    build: function (d) {
      var subjSel = $("#cf-subject");
      var subjText = subjSel ? subjSel.options[subjSel.selectedIndex].text : "";
      var dsel = $("#cf-design");
      var dText = dsel && dsel.value ? dsel.options[dsel.selectedIndex].text : t("form.design.none");
      return {
        subject: "MAYA SWIM · " + subjText + " · " + (d.get("name") || ""),
        body: [
          t("form.name") + ": " + (d.get("name") || ""),
          t("form.email") + ": " + (d.get("email") || ""),
          t("form.phone") + ": " + (d.get("phone") || ""),
          t("form.subject") + ": " + subjText,
          t("form.design") + ": " + dText,
          t("form.measure") + ": " + (d.get("measurements") || ""),
          "",
          d.get("message") || ""
        ].join("\n")
      };
    }
  });

  wireForm($("#newsForm"), {
    status: "#newsStatus",
    success: "news.success",
    endpoint: function () { return C.newsletterEndpoint || C.formEndpoint; },
    build: function (d) {
      return { subject: "MAYA SWIM · Newsletter signup", body: "Please add me to the MAYA SWIM updates list: " + (d.get("email") || "") };
    }
  });

  /* ---------- Accessibility panel ---------- */
  var A11Y_KEYS = ["contrast", "links", "font", "noanim"];
  var a11y = { scale: 0, contrast: false, links: false, font: false, noanim: false };
  try { var saved = JSON.parse(store.get("maya-a11y") || "null"); if (saved) Object.keys(a11y).forEach(function (k) { if (k in saved) a11y[k] = saved[k]; }); } catch (e) {}

  function applyA11y() {
    root.style.fontSize = a11y.scale ? [100, 112.5, 125, 137.5][a11y.scale] + "%" : "";
    A11Y_KEYS.forEach(function (k) {
      root.classList.toggle("a11y-" + k, !!a11y[k]);
      var b = $('[data-a11y="' + k + '"]'); if (b) b.setAttribute("aria-pressed", String(!!a11y[k]));
    });
    var isDefault = !a11y.scale && !A11Y_KEYS.some(function (k) { return a11y[k]; });
    if (isDefault) store.del("maya-a11y"); else store.set("maya-a11y", JSON.stringify(a11y));
  }

  var a11yBtn = $("#a11yBtn"), a11yPanel = $("#a11yPanel");
  function setPanel(open) {
    if (!a11yPanel) return;
    a11yPanel.hidden = !open;
    a11yBtn.setAttribute("aria-expanded", String(open));
    if (open) { var f = $("button", a11yPanel); if (f) f.focus(); }
  }
  if (a11yBtn && a11yPanel) {
    a11yBtn.addEventListener("click", function () { setPanel(a11yPanel.hidden); });
    a11yPanel.addEventListener("click", function (e) {
      var b = e.target.closest("[data-a11y]");
      if (e.target.closest("[data-a11y-close]")) { setPanel(false); a11yBtn.focus(); return; }
      if (!b) return;
      var act = b.getAttribute("data-a11y");
      if (act === "larger") a11y.scale = Math.min(3, a11y.scale + 1);
      else if (act === "smaller") a11y.scale = Math.max(0, a11y.scale - 1);
      else if (act === "reset") { a11y = { scale: 0, contrast: false, links: false, font: false, noanim: false }; }
      else if (A11Y_KEYS.indexOf(act) > -1) a11y[act] = !a11y[act];
      applyA11y();
    });
    document.addEventListener("click", function (e) {
      if (!a11yPanel.hidden && !a11yPanel.contains(e.target) && !a11yBtn.contains(e.target)) setPanel(false);
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("#menuBtn"), nav = $("#mainNav");
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", t(open ? "nav.close" : "nav.menu"));
    var use = menuBtn.querySelector("use"); if (use) use.setAttribute("href", open ? "#i-close" : "#i-menu");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  }

  /* ---------- Global key & click handlers ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (a11yPanel && !a11yPanel.hidden) { setPanel(false); a11yBtn.focus(); }
    if (nav && nav.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
  });

  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-open]");
    if (opener) { openDialog(opener.getAttribute("data-open"), opener); return; }
    var filter = e.target.closest("[data-filter]");
    if (filter) { setFilter(filter.getAttribute("data-filter")); return; }
    var u = e.target.closest("[data-unit]");
    if (u) { unit = u.getAttribute("data-unit"); renderSizes(); return; }
    var subj = e.target.closest("[data-subject]");
    if (subj) { var s = $("#cf-subject"); if (s) s.value = subj.getAttribute("data-subject"); }
    if (e.target.closest("#langBtn")) toggleLang();
  });

  var finderForm = $("#finderForm");
  if (finderForm) finderForm.addEventListener("submit", runFinder);

  /* ---------- Header state & active section ---------- */
  var header = $("#siteHeader");
  var onScroll = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    var navLinks = $$('.main-nav a[href^="#"]');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) { var s = $(a.getAttribute("href")); if (s) spy.observe(s); });

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); observer.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".reveal:not(.is-in)").forEach(function (el) { observer.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  var yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Init ---------- */
  applyA11y();
  applyLang();
})();
