(function() {
  if (!document.querySelector('[data-about-slider]')) return;

  const sliderConfig = {
    autoplayButtonOutput: false,
    container: '[data-about-slider]',
    gutter:24,
    items: 1,
    mouseDrag: true,
    nav: true,
    navPosition: 'bottom',
    controls: false,
    prevButton: document.querySelector('[data-about-slider-prev]'),
    nextButton: document.querySelector('[data-about-slider-next]'),
    loop: false,
    responsive: {
      1220: {
        controls: true
      }
    }
  };

  tns(sliderConfig)

})();
