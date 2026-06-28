// Lightweight scroll parallax. Each [data-parallax] element is translated
// vertically by scrollY * factor, so layers with different factors drift at
// different rates and read as a depth hierarchy.
//
// Larger factor = the layer is held back more = feels further away.
//   background (0.45) lags most, split (0.22) lags some, blocks (0) scroll
//   with the page as the foreground.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var layers = Array.prototype.map.call(
    document.querySelectorAll("[data-parallax]"),
    function (el) {
      return { el: el, factor: parseFloat(el.getAttribute("data-parallax")) || 0 };
    }
  );

  var ticking = false;

  function update() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i];
      // Drive a CSS variable instead of `transform` so the offset composes
      // with each element's own transform (e.g. the blocks' tilt/scale).
      L.el.style.setProperty("--py", (y * L.factor).toFixed(2) + "px");
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();
