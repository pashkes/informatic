if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */ ) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
};

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

if (!Element.prototype.matches)
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
  Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}


const getClosest = function (elem, selector) {
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  // Get the closest matching element
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem;
  }
  return null;

};


function getQueryString() {
  var key = false,
    res = {},
    itm = null;
  // get the query string without the ?
  var qs = location.search.substring(1);
  // check for the key as an argument
  if (arguments.length > 0 && arguments[0].length > 1)
    key = arguments[0];
  // make a regex pattern to grab key/value
  var pattern = /([^&=]+)=([^&]*)/g;
  // loop the items in the query string, either
  // find a match to the argument, or build an object
  // with key/value pairs
  while (itm = pattern.exec(qs)) {
    if (key !== false && decodeURIComponent(itm[1]) === key)
      return decodeURIComponent(itm[2]);
    else if (key === false)
      res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
  }

  return key === false ? res : null;
}

window.addEventListener('load', () => {

  const links = [...document.querySelectorAll('link[rel="preload"]')];

  if (!links.length) return;

  links.forEach(function (link) {
    const media = link.media;
    const as = link.as || [...link.attributes].find((attr) => attr.name === 'as').value;
    let ext = null;

    if (as === 'style') {
      ext = 'stylesheet';
    }

    if (!ext) return;

    if (window.matchMedia(media).matches) {
      link.rel = ext;
    }

    window.addEventListener('resize', () => {
      if (window.matchMedia(media).matches) {
        link.rel = ext;
      }
    })
  });
});

const BREAKPOINTS = {
  sm: '(min-width: 768px)',
  md: '(min-width: 1024px)',
  lg: '(min-width: 1344px)'
};


// default slider for tripple blocks
const INIT_DEFAULT_SLIDER = (selector, breakpoint = BREAKPOINTS.md, gutter = 0) => {
  if (!document.querySelector(selector)) return;

  let slider = {
    version: null
  };

  const sliderConfig = {
    autoplayButtonOutput: false,
    container: selector,
    controls: false,
    items: 1,
    mouseDrag: true,
    nav: true,
    navPosition: 'bottom',
    loop: false,
    gutter,
    autoHeight: true,
  };

  if (!breakpoint) {
    tns(sliderConfig);
    return;
  }

  const initSlider = () => {
    if (window.matchMedia(breakpoint).matches) {
      if (!slider.version) return;
      slider.destroy();
    } else {
      if (slider.version) return;
      slider = tns(sliderConfig);
    }
  };

  initSlider();

  window.addEventListener('resize', () => {
    initSlider();
  })
}

class Modals {
  constructor() {
    this.modalSelector = '[data-modal]';
    this.overflowClass = 'modal-open';
    this.classHidden = 'hidden';
    this.overlayAttr = 'data-modal-overlay';
    this.modals = [...document.querySelectorAll(this.modalSelector)];
    this.overlay = document.querySelector(`[${this.overlayAttr}]`);
    this.openButtons = [...document.querySelectorAll('[data-modal-for]')];
    this.closeButtons = [...document.querySelectorAll('[data-close-modal]')];
    this.body = document.querySelector('body');
    this.inFocus = null;
    this.onKeyUpWindowHandler = null;
    this.overlayClickHandler = null;
  }

  openHandler() {
    this.openButtons.forEach((button) => {
      const forModal = button.dataset.modalFor;
      const modal = this.modals.find((m) => m.dataset.modal === forModal);

      if (!modal) return;

      button.addEventListener('click', (e) => {
        e.preventDefault();

        const currentOpenModal = this.modals.find((m) => !m.classList.contains(this.classHidden));

        if (currentOpenModal === modal) {
          this.close(modal);
          return;
        }

        modal.classList.remove(this.classHidden);
        modal.setAttribute('tabindex', -1);
        setTimeout(() => {
          modal.focus();
          focusManager.capture(modal);
        }, 100);

        if (currentOpenModal) {
          this.close(currentOpenModal);
          return;
        }

        this.inFocus = document.activeElement;
        this.overlay.classList.remove(this.classHidden);
        this.body.classList.add(this.overflowClass);

        this.onKeyUpWindowHandler = (e) => {
          if (e.key !== 'Escape' || e.keyCode !== 27) return;
          const modal = this.modals.find((m) => !m.classList.contains(this.classHidden));
          if (!modal) return;
          this.close(modal);
        };

        document.addEventListener('keyup', this.onKeyUpWindowHandler);

        this.overlayClickHandler = (e) => {
          if (!e.target.hasAttribute(this.overlayAttr)) return;
          this.close();
        };

        this.overlay.addEventListener('click', this.overlayClickHandler);

      })
    });
  }

  closeHandler() {
    this.closeButtons.forEach((button) => {
       button.addEventListener('click', () => {
        this.close(button.closest(this.modalSelector));
      })
    });
  }

  close(modal = this.modals.find((m) => !m.classList.contains(this.classHidden))) {
    if (!modal) return;
    focusManager.release();
    modal.classList.add(this.classHidden);
    modal.setAttribute('tabindex', 1);
    if (this.modals.find((m) => !m.classList.contains(this.classHidden))) return;
    this.inFocus.focus();
    this.body.classList.remove(this.overflowClass);
    this.overlay.classList.add(this.classHidden);
    document.removeEventListener('keyup', this.onKeyUpWindowHandler);
    this.overlay.removeEventListener('click', this.overlayClickHandler);
  }

  init() {
    this.openHandler();
    this.closeHandler();
  }
}

const modals = new Modals();
modals.init();

// smooth scroll
const scroll = new SmoothScroll('a[href*="#"]', {
  offset: 116,
  speedAsDuration: true,
});
