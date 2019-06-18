(function() {
  if (!document.querySelector('[data-opportunities-slider]')) return;

  const sliderConfig = {
    autoplayButtonOutput: false,
    container: '[data-opportunities-slider]',
    controls: false,
    gutter:24,
    items: 1,
    mouseDrag: true,
    nav: true,
    navPosition: 'bottom',
    controls: true,
    prevButton: document.querySelector('[data-opportunities-prev]'),
    nextButton: document.querySelector('[data-opportunities-next]'),
    loop: false,
  };

  tns(sliderConfig)

})();

(()=> {
  if (!document.querySelector('[data-slider]')) return;

  const sliderConfig = {
    autoplayButtonOutput: false,
    container: '[data-slider]',
    gutter:24,
    items: 1,
    mouseDrag: true,
    nav: true,
    autoHeight: true,
    navPosition: 'bottom',
    controls: true,
    prevButton: document.querySelector('[data-prev]'),
    nextButton: document.querySelector('[data-next]'),
    loop: false,
    responsive: {
      1200: {
        autoHeight: false
      }
    }
  };

  tns(sliderConfig)
})();
