// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * perfect-scrollbar v1.5.0
 * Copyright 2020 Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */
function get(element) {
  return getComputedStyle(element);
}

function set(element, obj) {
  for (var key in obj) {
    var val = obj[key];

    if (typeof val === 'number') {
      val = val + "px";
    }

    element.style[key] = val;
  }

  return element;
}

function div(className) {
  var div = document.createElement('div');
  div.className = className;
  return div;
}

var elMatches = typeof Element !== 'undefined' && (Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector);

function matches(element, query) {
  if (!elMatches) {
    throw new Error('No element matching method supported');
  }

  return elMatches.call(element, query);
}

function remove(element) {
  if (element.remove) {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

function queryChildren(element, selector) {
  return Array.prototype.filter.call(element.children, function (child) {
    return matches(child, selector);
  });
}

var cls = {
  main: 'ps',
  rtl: 'ps__rtl',
  element: {
    thumb: function (x) {
      return "ps__thumb-" + x;
    },
    rail: function (x) {
      return "ps__rail-" + x;
    },
    consuming: 'ps__child--consume'
  },
  state: {
    focus: 'ps--focus',
    clicking: 'ps--clicking',
    active: function (x) {
      return "ps--active-" + x;
    },
    scrolling: function (x) {
      return "ps--scrolling-" + x;
    }
  }
};
/*
 * Helper methods
 */

var scrollingClassTimeout = {
  x: null,
  y: null
};

function addScrollingClass(i, x) {
  var classList = i.element.classList;
  var className = cls.state.scrolling(x);

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x]);
  } else {
    classList.add(className);
  }
}

function removeScrollingClass(i, x) {
  scrollingClassTimeout[x] = setTimeout(function () {
    return i.isAlive && i.element.classList.remove(cls.state.scrolling(x));
  }, i.settings.scrollingThreshold);
}

function setScrollingClassInstantly(i, x) {
  addScrollingClass(i, x);
  removeScrollingClass(i, x);
}

var EventElement = function EventElement(element) {
  this.element = element;
  this.handlers = {};
};

var prototypeAccessors = {
  isEmpty: {
    configurable: true
  }
};

EventElement.prototype.bind = function bind(eventName, handler) {
  if (typeof this.handlers[eventName] === 'undefined') {
    this.handlers[eventName] = [];
  }

  this.handlers[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function unbind(eventName, target) {
  var this$1 = this;
  this.handlers[eventName] = this.handlers[eventName].filter(function (handler) {
    if (target && handler !== target) {
      return true;
    }

    this$1.element.removeEventListener(eventName, handler, false);
    return false;
  });
};

EventElement.prototype.unbindAll = function unbindAll() {
  for (var name in this.handlers) {
    this.unbind(name);
  }
};

prototypeAccessors.isEmpty.get = function () {
  var this$1 = this;
  return Object.keys(this.handlers).every(function (key) {
    return this$1.handlers[key].length === 0;
  });
};

Object.defineProperties(EventElement.prototype, prototypeAccessors);

var EventManager = function EventManager() {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function eventElement(element) {
  var ee = this.eventElements.filter(function (ee) {
    return ee.element === element;
  })[0];

  if (!ee) {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }

  return ee;
};

EventManager.prototype.bind = function bind(element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function unbind(element, eventName, handler) {
  var ee = this.eventElement(element);
  ee.unbind(eventName, handler);

  if (ee.isEmpty) {
    // remove
    this.eventElements.splice(this.eventElements.indexOf(ee), 1);
  }
};

EventManager.prototype.unbindAll = function unbindAll() {
  this.eventElements.forEach(function (e) {
    return e.unbindAll();
  });
  this.eventElements = [];
};

EventManager.prototype.once = function once(element, eventName, handler) {
  var ee = this.eventElement(element);

  var onceHandler = function (evt) {
    ee.unbind(eventName, onceHandler);
    handler(evt);
  };

  ee.bind(eventName, onceHandler);
};

function createEvent(name) {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name);
  } else {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, false, false, undefined);
    return evt;
  }
}

function processScrollDiff(i, axis, diff, useScrollingClass, forceFireReachEvent) {
  if (useScrollingClass === void 0) useScrollingClass = true;
  if (forceFireReachEvent === void 0) forceFireReachEvent = false;
  var fields;

  if (axis === 'top') {
    fields = ['contentHeight', 'containerHeight', 'scrollTop', 'y', 'up', 'down'];
  } else if (axis === 'left') {
    fields = ['contentWidth', 'containerWidth', 'scrollLeft', 'x', 'left', 'right'];
  } else {
    throw new Error('A proper axis should be provided');
  }

  processScrollDiff$1(i, diff, fields, useScrollingClass, forceFireReachEvent);
}

function processScrollDiff$1(i, diff, ref, useScrollingClass, forceFireReachEvent) {
  var contentHeight = ref[0];
  var containerHeight = ref[1];
  var scrollTop = ref[2];
  var y = ref[3];
  var up = ref[4];
  var down = ref[5];
  if (useScrollingClass === void 0) useScrollingClass = true;
  if (forceFireReachEvent === void 0) forceFireReachEvent = false;
  var element = i.element; // reset reach

  i.reach[y] = null; // 1 for subpixel rounding

  if (element[scrollTop] < 1) {
    i.reach[y] = 'start';
  } // 1 for subpixel rounding


  if (element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
    i.reach[y] = 'end';
  }

  if (diff) {
    element.dispatchEvent(createEvent("ps-scroll-" + y));

    if (diff < 0) {
      element.dispatchEvent(createEvent("ps-scroll-" + up));
    } else if (diff > 0) {
      element.dispatchEvent(createEvent("ps-scroll-" + down));
    }

    if (useScrollingClass) {
      setScrollingClassInstantly(i, y);
    }
  }

  if (i.reach[y] && (diff || forceFireReachEvent)) {
    element.dispatchEvent(createEvent("ps-" + y + "-reach-" + i.reach[y]));
  }
}

function toInt(x) {
  return parseInt(x, 10) || 0;
}

function isEditable(el) {
  return matches(el, 'input,[contenteditable]') || matches(el, 'select,[contenteditable]') || matches(el, 'textarea,[contenteditable]') || matches(el, 'button,[contenteditable]');
}

function outerWidth(element) {
  var styles = get(element);
  return toInt(styles.width) + toInt(styles.paddingLeft) + toInt(styles.paddingRight) + toInt(styles.borderLeftWidth) + toInt(styles.borderRightWidth);
}

var env = {
  isWebKit: typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: typeof window !== 'undefined' && ('ontouchstart' in window || 'maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints > 0 || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
  isChrome: typeof navigator !== 'undefined' && /Chrome/i.test(navigator && navigator.userAgent)
};

function updateGeometry(i) {
  var element = i.element;
  var roundedScrollTop = Math.floor(element.scrollTop);
  var rect = element.getBoundingClientRect();
  i.containerWidth = Math.ceil(rect.width);
  i.containerHeight = Math.ceil(rect.height);
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  if (!element.contains(i.scrollbarXRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('x')).forEach(function (el) {
      return remove(el);
    });
    element.appendChild(i.scrollbarXRail);
  }

  if (!element.contains(i.scrollbarYRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('y')).forEach(function (el) {
      return remove(el);
    });
    element.appendChild(i.scrollbarYRail);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = toInt(roundedScrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }

  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    element.classList.add(cls.state.active('x'));
  } else {
    element.classList.remove(cls.state.active('x'));
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element.scrollLeft = i.isRtl === true ? i.contentWidth : 0;
  }

  if (i.scrollbarYActive) {
    element.classList.add(cls.state.active('y'));
  } else {
    element.classList.remove(cls.state.active('y'));
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element.scrollTop = 0;
  }
}

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }

  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }

  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {
    width: i.railXWidth
  };
  var roundedScrollTop = Math.floor(element.scrollTop);

  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }

  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + roundedScrollTop;
  }

  set(i.scrollbarXRail, xRailOffset);
  var yRailOffset = {
    top: roundedScrollTop,
    height: i.railYHeight
  };

  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth - 9;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }

  set(i.scrollbarYRail, yRailOffset);
  set(i.scrollbarX, {
    left: i.scrollbarXLeft,
    width: i.scrollbarXWidth - i.railBorderXWidth
  });
  set(i.scrollbarY, {
    top: i.scrollbarYTop,
    height: i.scrollbarYHeight - i.railBorderYWidth
  });
}

function clickRail(i) {
  var element = i.element;
  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    return e.stopPropagation();
  });
  i.event.bind(i.scrollbarYRail, 'mousedown', function (e) {
    var positionTop = e.pageY - window.pageYOffset - i.scrollbarYRail.getBoundingClientRect().top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;
    i.element.scrollTop += direction * i.containerHeight;
    updateGeometry(i);
    e.stopPropagation();
  });
  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    return e.stopPropagation();
  });
  i.event.bind(i.scrollbarXRail, 'mousedown', function (e) {
    var positionLeft = e.pageX - window.pageXOffset - i.scrollbarXRail.getBoundingClientRect().left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;
    i.element.scrollLeft += direction * i.containerWidth;
    updateGeometry(i);
    e.stopPropagation();
  });
}

function dragThumb(i) {
  bindMouseScrollHandler(i, ['containerWidth', 'contentWidth', 'pageX', 'railXWidth', 'scrollbarX', 'scrollbarXWidth', 'scrollLeft', 'x', 'scrollbarXRail']);
  bindMouseScrollHandler(i, ['containerHeight', 'contentHeight', 'pageY', 'railYHeight', 'scrollbarY', 'scrollbarYHeight', 'scrollTop', 'y', 'scrollbarYRail']);
}

function bindMouseScrollHandler(i, ref) {
  var containerHeight = ref[0];
  var contentHeight = ref[1];
  var pageY = ref[2];
  var railYHeight = ref[3];
  var scrollbarY = ref[4];
  var scrollbarYHeight = ref[5];
  var scrollTop = ref[6];
  var y = ref[7];
  var scrollbarYRail = ref[8];
  var element = i.element;
  var startingScrollTop = null;
  var startingMousePageY = null;
  var scrollBy = null;

  function mouseMoveHandler(e) {
    if (e.touches && e.touches[0]) {
      e[pageY] = e.touches[0].pageY;
    }

    element[scrollTop] = startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
    addScrollingClass(i, y);
    updateGeometry(i);
    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i[scrollbarYRail].classList.remove(cls.state.clicking);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  function bindMoves(e, touchMode) {
    startingScrollTop = element[scrollTop];

    if (touchMode && e.touches) {
      e[pageY] = e.touches[0].pageY;
    }

    startingMousePageY = e[pageY];
    scrollBy = (i[contentHeight] - i[containerHeight]) / (i[railYHeight] - i[scrollbarYHeight]);

    if (!touchMode) {
      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);
      e.preventDefault();
    } else {
      i.event.bind(i.ownerDocument, 'touchmove', mouseMoveHandler);
    }

    i[scrollbarYRail].classList.add(cls.state.clicking);
    e.stopPropagation();
  }

  i.event.bind(i[scrollbarY], 'mousedown', function (e) {
    bindMoves(e);
  });
  i.event.bind(i[scrollbarY], 'touchstart', function (e) {
    bindMoves(e, true);
  });
}

function keyboard(i) {
  var element = i.element;

  var elementHovered = function () {
    return matches(element, ':hover');
  };

  var scrollbarFocused = function () {
    return matches(i.scrollbarX, ':focus') || matches(i.scrollbarY, ':focus');
  };

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = Math.floor(element.scrollTop);

    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }

      if (scrollTop === 0 && deltaY > 0 || scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;

    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }

      if (scrollLeft === 0 && deltaX < 0 || scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0) {
        return !i.settings.wheelPropagation;
      }
    }

    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (e.isDefaultPrevented && e.isDefaultPrevented() || e.defaultPrevented) {
      return;
    }

    if (!elementHovered() && !scrollbarFocused()) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;

    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }

      if (isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
      case 37:
        // left
        if (e.metaKey) {
          deltaX = -i.contentWidth;
        } else if (e.altKey) {
          deltaX = -i.containerWidth;
        } else {
          deltaX = -30;
        }

        break;

      case 38:
        // up
        if (e.metaKey) {
          deltaY = i.contentHeight;
        } else if (e.altKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = 30;
        }

        break;

      case 39:
        // right
        if (e.metaKey) {
          deltaX = i.contentWidth;
        } else if (e.altKey) {
          deltaX = i.containerWidth;
        } else {
          deltaX = 30;
        }

        break;

      case 40:
        // down
        if (e.metaKey) {
          deltaY = -i.contentHeight;
        } else if (e.altKey) {
          deltaY = -i.containerHeight;
        } else {
          deltaY = -30;
        }

        break;

      case 32:
        // space bar
        if (e.shiftKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = -i.containerHeight;
        }

        break;

      case 33:
        // page up
        deltaY = i.containerHeight;
        break;

      case 34:
        // page down
        deltaY = -i.containerHeight;
        break;

      case 36:
        // home
        deltaY = i.contentHeight;
        break;

      case 35:
        // end
        deltaY = -i.contentHeight;
        break;

      default:
        return;
    }

    if (i.settings.suppressScrollX && deltaX !== 0) {
      return;
    }

    if (i.settings.suppressScrollY && deltaY !== 0) {
      return;
    }

    element.scrollTop -= deltaY;
    element.scrollLeft += deltaX;
    updateGeometry(i);

    if (shouldPreventDefault(deltaX, deltaY)) {
      e.preventDefault();
    }
  });
}

function wheel(i) {
  var element = i.element;

  function shouldPreventDefault(deltaX, deltaY) {
    var roundedScrollTop = Math.floor(element.scrollTop);
    var isTop = element.scrollTop === 0;
    var isBottom = roundedScrollTop + element.offsetHeight === element.scrollHeight;
    var isLeft = element.scrollLeft === 0;
    var isRight = element.scrollLeft + element.offsetWidth === element.scrollWidth;
    var hitsBound; // pick axis with primary direction

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      hitsBound = isTop || isBottom;
    } else {
      hitsBound = isLeft || isRight;
    }

    return hitsBound ? !i.settings.wheelPropagation : true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY
    /* NaN checks */
    ) {
        // IE in some mouse drivers
        deltaX = 0;
        deltaY = e.wheelDelta;
      }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }

    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    // FIXME: this is a workaround for <select> issue in FF and IE #571
    if (!env.isWebKit && element.querySelector('select:focus')) {
      return true;
    }

    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor); // if deltaY && vertical scrollable

      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;

        if (maxScrollTop > 0) {
          if (cursor.scrollTop > 0 && deltaY < 0 || cursor.scrollTop < maxScrollTop && deltaY > 0) {
            return true;
          }
        }
      } // if deltaX && horizontal scrollable


      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;

        if (maxScrollLeft > 0) {
          if (cursor.scrollLeft > 0 && deltaX < 0 || cursor.scrollLeft < maxScrollLeft && deltaX > 0) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function mousewheelHandler(e) {
    var ref = getDeltaFromEvent(e);
    var deltaX = ref[0];
    var deltaY = ref[1];

    if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
      return;
    }

    var shouldPrevent = false;

    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      element.scrollTop -= deltaY * i.settings.wheelSpeed;
      element.scrollLeft += deltaX * i.settings.wheelSpeed;
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        element.scrollTop -= deltaY * i.settings.wheelSpeed;
      } else {
        element.scrollTop += deltaX * i.settings.wheelSpeed;
      }

      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        element.scrollLeft += deltaX * i.settings.wheelSpeed;
      } else {
        element.scrollLeft -= deltaY * i.settings.wheelSpeed;
      }

      shouldPrevent = true;
    }

    updateGeometry(i);
    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);

    if (shouldPrevent && !e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== 'undefined') {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== 'undefined') {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

function touch(i) {
  if (!env.supportsTouch && !env.supportsIePointer) {
    return;
  }

  var element = i.element;

  function shouldPrevent(deltaX, deltaY) {
    var scrollTop = Math.floor(element.scrollTop);
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page
      if (deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight || deltaY > 0 && scrollTop === 0) {
        // set prevent for mobile Chrome refresh
        return window.scrollY === 0 && deltaY > 0 && env.isChrome;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page
      if (deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth || deltaX > 0 && scrollLeft === 0) {
        return true;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    element.scrollTop -= differenceY;
    element.scrollLeft -= differenceX;
    updateGeometry(i);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }

  function shouldHandle(e) {
    if (e.pointerType && e.pointerType === 'pen' && e.buttons === 0) {
      return false;
    }

    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }

    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }

    return false;
  }

  function touchStart(e) {
    if (!shouldHandle(e)) {
      return;
    }

    var touch = getTouch(e);
    startOffset.pageX = touch.pageX;
    startOffset.pageY = touch.pageY;
    startTime = new Date().getTime();

    if (easingLoop !== null) {
      clearInterval(easingLoop);
    }
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor); // if deltaY && vertical scrollable

      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;

        if (maxScrollTop > 0) {
          if (cursor.scrollTop > 0 && deltaY < 0 || cursor.scrollTop < maxScrollTop && deltaY > 0) {
            return true;
          }
        }
      } // if deltaX && horizontal scrollable


      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;

        if (maxScrollLeft > 0) {
          if (cursor.scrollLeft > 0 && deltaX < 0 || cursor.scrollLeft < maxScrollLeft && deltaX > 0) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function touchMove(e) {
    if (shouldHandle(e)) {
      var touch = getTouch(e);
      var currentOffset = {
        pageX: touch.pageX,
        pageY: touch.pageY
      };
      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
        return;
      }

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;
      var currentTime = new Date().getTime();
      var timeGap = currentTime - startTime;

      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPrevent(differenceX, differenceY)) {
        e.preventDefault();
      }
    }
  }

  function touchEnd() {
    if (i.settings.swipeEasing) {
      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (i.isInitialized) {
          clearInterval(easingLoop);
          return;
        }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);
        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (env.supportsTouch) {
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (env.supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

var defaultSettings = function () {
  return {
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollingThreshold: 1000,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    suppressScrollX: false,
    suppressScrollY: false,
    swipeEasing: true,
    useBothWheelAxes: false,
    wheelPropagation: true,
    wheelSpeed: 1
  };
};

var handlers = {
  'click-rail': clickRail,
  'drag-thumb': dragThumb,
  keyboard: keyboard,
  wheel: wheel,
  touch: touch
};

var PerfectScrollbar = function PerfectScrollbar(element, userSettings) {
  var this$1 = this;
  if (userSettings === void 0) userSettings = {};

  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (!element || !element.nodeName) {
    throw new Error('no element is specified to initialize PerfectScrollbar');
  }

  this.element = element;
  element.classList.add(cls.main);
  this.settings = defaultSettings();

  for (var key in userSettings) {
    this.settings[key] = userSettings[key];
  }

  this.containerWidth = null;
  this.containerHeight = null;
  this.contentWidth = null;
  this.contentHeight = null;

  var focus = function () {
    return element.classList.add(cls.state.focus);
  };

  var blur = function () {
    return element.classList.remove(cls.state.focus);
  };

  this.isRtl = get(element).direction === 'rtl';

  if (this.isRtl === true) {
    element.classList.add(cls.rtl);
  }

  this.isNegativeScroll = function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  }();

  this.negativeScrollAdjustment = this.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  this.event = new EventManager();
  this.ownerDocument = element.ownerDocument || document;
  this.scrollbarXRail = div(cls.element.rail('x'));
  element.appendChild(this.scrollbarXRail);
  this.scrollbarX = div(cls.element.thumb('x'));
  this.scrollbarXRail.appendChild(this.scrollbarX);
  this.scrollbarX.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarX, 'focus', focus);
  this.event.bind(this.scrollbarX, 'blur', blur);
  this.scrollbarXActive = null;
  this.scrollbarXWidth = null;
  this.scrollbarXLeft = null;
  var railXStyle = get(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);

  if (isNaN(this.scrollbarXBottom)) {
    this.isScrollbarXUsingBottom = false;
    this.scrollbarXTop = toInt(railXStyle.top);
  } else {
    this.isScrollbarXUsingBottom = true;
  }

  this.railBorderXWidth = toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth); // Set rail to display:block to calculate margins

  set(this.scrollbarXRail, {
    display: 'block'
  });
  this.railXMarginWidth = toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
  set(this.scrollbarXRail, {
    display: ''
  });
  this.railXWidth = null;
  this.railXRatio = null;
  this.scrollbarYRail = div(cls.element.rail('y'));
  element.appendChild(this.scrollbarYRail);
  this.scrollbarY = div(cls.element.thumb('y'));
  this.scrollbarYRail.appendChild(this.scrollbarY);
  this.scrollbarY.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarY, 'focus', focus);
  this.event.bind(this.scrollbarY, 'blur', blur);
  this.scrollbarYActive = null;
  this.scrollbarYHeight = null;
  this.scrollbarYTop = null;
  var railYStyle = get(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(railYStyle.right, 10);

  if (isNaN(this.scrollbarYRight)) {
    this.isScrollbarYUsingRight = false;
    this.scrollbarYLeft = toInt(railYStyle.left);
  } else {
    this.isScrollbarYUsingRight = true;
  }

  this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
  this.railBorderYWidth = toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
  set(this.scrollbarYRail, {
    display: 'block'
  });
  this.railYMarginHeight = toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
  set(this.scrollbarYRail, {
    display: ''
  });
  this.railYHeight = null;
  this.railYRatio = null;
  this.reach = {
    x: element.scrollLeft <= 0 ? 'start' : element.scrollLeft >= this.contentWidth - this.containerWidth ? 'end' : null,
    y: element.scrollTop <= 0 ? 'start' : element.scrollTop >= this.contentHeight - this.containerHeight ? 'end' : null
  };
  this.isAlive = true;
  this.settings.handlers.forEach(function (handlerName) {
    return handlers[handlerName](this$1);
  });
  this.lastScrollTop = Math.floor(element.scrollTop); // for onScroll only

  this.lastScrollLeft = element.scrollLeft; // for onScroll only

  this.event.bind(this.element, 'scroll', function (e) {
    return this$1.onScroll(e);
  });
  updateGeometry(this);
};

PerfectScrollbar.prototype.update = function update() {
  if (!this.isAlive) {
    return;
  } // Recalcuate negative scrollLeft adjustment


  this.negativeScrollAdjustment = this.isNegativeScroll ? this.element.scrollWidth - this.element.clientWidth : 0; // Recalculate rail margins

  set(this.scrollbarXRail, {
    display: 'block'
  });
  set(this.scrollbarYRail, {
    display: 'block'
  });
  this.railXMarginWidth = toInt(get(this.scrollbarXRail).marginLeft) + toInt(get(this.scrollbarXRail).marginRight);
  this.railYMarginHeight = toInt(get(this.scrollbarYRail).marginTop) + toInt(get(this.scrollbarYRail).marginBottom); // Hide scrollbars not to affect scrollWidth and scrollHeight

  set(this.scrollbarXRail, {
    display: 'none'
  });
  set(this.scrollbarYRail, {
    display: 'none'
  });
  updateGeometry(this);
  processScrollDiff(this, 'top', 0, false, true);
  processScrollDiff(this, 'left', 0, false, true);
  set(this.scrollbarXRail, {
    display: ''
  });
  set(this.scrollbarYRail, {
    display: ''
  });
};

PerfectScrollbar.prototype.onScroll = function onScroll(e) {
  if (!this.isAlive) {
    return;
  }

  updateGeometry(this);
  processScrollDiff(this, 'top', this.element.scrollTop - this.lastScrollTop);
  processScrollDiff(this, 'left', this.element.scrollLeft - this.lastScrollLeft);
  this.lastScrollTop = Math.floor(this.element.scrollTop);
  this.lastScrollLeft = this.element.scrollLeft;
};

PerfectScrollbar.prototype.destroy = function destroy() {
  if (!this.isAlive) {
    return;
  }

  this.event.unbindAll();
  remove(this.scrollbarX);
  remove(this.scrollbarY);
  remove(this.scrollbarXRail);
  remove(this.scrollbarYRail);
  this.removePsClasses(); // unset elements

  this.element = null;
  this.scrollbarX = null;
  this.scrollbarY = null;
  this.scrollbarXRail = null;
  this.scrollbarYRail = null;
  this.isAlive = false;
};

PerfectScrollbar.prototype.removePsClasses = function removePsClasses() {
  this.element.className = this.element.className.split(' ').filter(function (name) {
    return !name.match(/^ps([-_].+|)$/);
  }).join(' ');
};

var _default = PerfectScrollbar;
exports.default = _default;
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _perfectScrollbar = _interopRequireDefault(require("perfect-scrollbar"));

var _excluded = ["alignment", "bold", "italic", "underlined"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ps = new _perfectScrollbar.default("#cells", {
  wheelSpeed: 10,
  wheelPropagation: true
});
var defaultProperties = {
  "font-family": "Noto Sans",
  "font-size": 14,
  text: "",
  bold: false,
  italic: false,
  underlined: false,
  alignment: "left",
  color: "#444",
  bgcolor: "#fff",
  formula: "",
  upStream: [],
  downStream: []
};

for (var _i = 1; _i <= 100; _i++) {
  var str = "";
  var n = _i;

  while (n > 0) {
    var rem = n % 26;

    if (rem == 0) {
      str = "Z" + str;
      n = Math.floor(n / 26) - 1;
    } else {
      str = String.fromCharCode(rem - 1 + 65) + str;
      n = Math.floor(n / 26);
    }
  }

  $("#columns").append("<div class=\"column-name column-".concat(_i, "\" id=\"").concat(str, "\">").concat(str, "</div>"));
  $("#rows").append("<div class=\"row-name ".concat(_i, "\">").concat(_i, "</div>"));
}

var cellData = [];
var sheets = {
  Sheet1: {}
};
var saved = true;
var selectedSheet = "Sheet1";
var totalSheets = 1;
var lastSheetAdded = 1;
var sheetSelectedForSomeAction;

for (var _i2 = 1; _i2 <= 100; _i2++) {
  var row = $('<div class="cell-row"></div>'); // let rowData = [];

  for (var _j = 1; _j <= 100; _j++) {
    row.append("<div id=\"row-".concat(_i2, "-col-").concat(_j, "\" class=\"input-cell\" contenteditable=\"false\"></div>")); // rowData.push({ ...defaultProperties });
  }

  $("#cells").append(row); // cellData.push(rowData);
}

function getRowColId(elem) {
  var classArr = $(elem).attr("id").split("-");
  var rowId = parseInt(classArr[1]);
  var colId = parseInt(classArr[3]);
  return [rowId, colId];
}

function grabAdjacentCells(elem) {
  var classArr = $(elem).attr("id").split("-");
  var rowId = parseInt(classArr[1]);
  var colId = parseInt(classArr[3]); // console.log(cellData[rowId - 1][colId - 1]);

  var topCell = $("#row-".concat(rowId - 1, "-col-").concat(colId));
  var bottomCell = $("#row-".concat(rowId + 1, "-col-").concat(colId));
  var leftCell = $("#row-".concat(rowId, "-col-").concat(colId - 1));
  var rightCell = $("#row-".concat(rowId, "-col-").concat(colId + 1));
  return [topCell, rightCell, bottomCell, leftCell];
}

$(".input-cell").on("click", function (e) {
  // console.log($(this));
  console.log(sheets);

  var _grabAdjacentCells = grabAdjacentCells(this),
      _grabAdjacentCells2 = _slicedToArray(_grabAdjacentCells, 4),
      topCell = _grabAdjacentCells2[0],
      rightCell = _grabAdjacentCells2[1],
      bottomCell = _grabAdjacentCells2[2],
      leftCell = _grabAdjacentCells2[3]; // console.log(topCell.length);
  // if (topCell.length) console.log("topcell exists");


  if ($(this).hasClass("selected") && e.ctrlKey) {
    // unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    return unselectCells(this, topCell, rightCell, bottomCell, leftCell);
  } else {
    selectCell(e, this, topCell, rightCell, bottomCell, leftCell);
  } // const [rowId, colId] = getRowColId(this);
  // console.log(cellData[rowId - 1][colId - 1]);

});
$(".input-cell").dblclick(function (e) {
  $(this).attr("contenteditable", true);
  $(this).focus();
});
$(".input-cell").blur(function (e) {
  $(this).attr("contenteditable", false);
  updateCellData("text", $(this).text());
});

function getSelectedBooleans(topCell, rightCell, bottomCell, leftCell) {
  var topSelected, rightSelected, bottomSelected, leftSelected; // console.log(e.ctrlKey);

  if (topCell) {
    topSelected = topCell.hasClass("selected");
  }

  if (bottomCell) {
    bottomSelected = bottomCell.hasClass("selected");
  }

  if (rightCell) {
    rightSelected = rightCell.hasClass("selected");
  }

  if (leftCell) {
    leftSelected = leftCell.hasClass("selected");
  }

  return [topSelected, rightSelected, bottomSelected, leftSelected];
}

function selectCell(e, cell, topCell, rightCell, bottomCell, leftCell) {
  if (e.ctrlKey) {
    // if ($(cell).hasClass("selected")) {
    //   return unselectCells(cell, topCell, rightCell, bottomCell, leftCell);
    // }
    var _getSelectedBooleans = getSelectedBooleans(topCell, rightCell, bottomCell, leftCell),
        _getSelectedBooleans2 = _slicedToArray(_getSelectedBooleans, 4),
        topSelected = _getSelectedBooleans2[0],
        rightSelected = _getSelectedBooleans2[1],
        bottomSelected = _getSelectedBooleans2[2],
        leftSelected = _getSelectedBooleans2[3];

    if (topSelected) {
      $(cell).addClass("top-selected");
      topCell.addClass("bottom-selected");
    }

    if (rightSelected) {
      $(cell).addClass("right-selected");
      rightCell.addClass("left-selected");
    }

    if (bottomSelected) {
      $(cell).addClass("bottom-selected");
      bottomCell.addClass("top-selected");
    }

    if (leftSelected) {
      $(cell).addClass("left-selected");
      leftCell.addClass("right-selected");
    }
  } else {
    $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
  }

  $(cell).addClass("selected");
  changeHeader(getRowColId(cell));
}

function unselectCells(cell, topCell, rightCell, bottomCell, leftCell) {
  var _getSelectedBooleans3 = getSelectedBooleans(topCell, rightCell, bottomCell, leftCell),
      _getSelectedBooleans4 = _slicedToArray(_getSelectedBooleans3, 4),
      topSelected = _getSelectedBooleans4[0],
      rightSelected = _getSelectedBooleans4[1],
      bottomSelected = _getSelectedBooleans4[2],
      leftSelected = _getSelectedBooleans4[3];

  if (topSelected) {
    topCell.removeClass("bottom-selected");
    $(cell).removeClass("top-selected");
  }

  if (rightSelected) {
    rightCell.removeClass("left-selected");
    $(cell).removeClass("right-selected");
  }

  if (bottomSelected) {
    bottomCell.removeClass("top-selected");
    $(cell).removeClass("bottom-selected");
  }

  if (leftSelected) {
    leftCell.removeClass("right-selected");
    $(cell).removeClass("left-selected");
  }

  $(cell).removeClass("selected");
  $(cell).blur();
}

var startCellSelected = false;
var startCell = {};
var endCell = {};
$(".input-cell").mousemove(function (e) {
  e.preventDefault();

  if (e.buttons == 1) {
    if (!startCellSelected) {
      startCellSelected = true;

      var _getRowColId = getRowColId(this),
          _getRowColId2 = _slicedToArray(_getRowColId, 2),
          rowId = _getRowColId2[0],
          colId = _getRowColId2[1];

      startCell = {
        rowId: rowId,
        colId: colId
      }; // console.log("sc ", startCell);
      //
    }
  } else {
    startCellSelected = false;
  }
});
$(".input-cell").mouseenter(function (e) {
  if (e.buttons == 1) {
    var _getRowColId3 = getRowColId(this),
        _getRowColId4 = _slicedToArray(_getRowColId3, 2),
        rowId = _getRowColId4[0],
        colId = _getRowColId4[1];

    endCell = {
      rowId: rowId,
      colId: colId
    }; // console.log("ec", endCell);

    selectBetweenCell(startCell, endCell);
  }
});

function selectBetweenCell(start, end) {
  $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected"); // console.log(start, end);

  for (var _i3 = Math.min(start.rowId, end.rowId); _i3 <= Math.max(start.rowId, end.rowId); _i3++) {
    for (var _j2 = Math.min(start.colId, end.colId); _j2 <= Math.max(start.colId, end.colId); _j2++) {
      var cell = $("#row-".concat(_i3, "-col-").concat(_j2))[0];

      var _grabAdjacentCells3 = grabAdjacentCells(cell),
          _grabAdjacentCells4 = _slicedToArray(_grabAdjacentCells3, 4),
          topCell = _grabAdjacentCells4[0],
          rightCell = _grabAdjacentCells4[1],
          bottomCell = _grabAdjacentCells4[2],
          leftCell = _grabAdjacentCells4[3];

      selectCell({
        ctrlKey: true
      }, cell, topCell, rightCell, bottomCell, leftCell);
    }
  }
}

function changeHeader(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      rowId = _ref2[0],
      colId = _ref2[1];

  if (sheets[selectedSheet][rowId - 1] && sheets[selectedSheet][rowId - 1][colId - 1]) {
    var _sheets$selectedSheet = sheets[selectedSheet][rowId - 1][colId - 1],
        data = _sheets$selectedSheet.alignment,
        bold = _sheets$selectedSheet.bold,
        italic = _sheets$selectedSheet.italic,
        underlined = _sheets$selectedSheet.underlined,
        rest = _objectWithoutProperties(_sheets$selectedSheet, _excluded);

    $(".alignment").removeClass("selected");
    $(".alignment[data-type=".concat(data, "]")).addClass("selected");
    setHeaderStyle("#bold", bold);
    setHeaderStyle("#italic", italic);
    setHeaderStyle("#underlined", underlined);
    $("#fill-color").css("border-color", rest.bgcolor);
    $("#text-color").css("border-color", rest.color);
    $("#font-family").val(rest["font-family"]);
    $("#font-size").val(rest["font-size"]);
    $("#font-family").css("font-family", rest["font-family"]);
  } else {
    $(".alignment").removeClass("selected");
    $(".alignment[data-type=left]").addClass("selected");
    setHeaderStyle("#bold", defaultProperties["bold"]);
    setHeaderStyle("#italic", defaultProperties["italic"]);
    setHeaderStyle("#underlined", defaultProperties["underlined"]);
    $("#fill-color").css("border-color", defaultProperties["bgcolor"]);
    $("#text-color").css("border-color", defaultProperties["color"]);
    $("#font-family").val(defaultProperties["font-family"]);
    $("#font-size").val(defaultProperties["font-size"]);
    $("#font-family").css("font-family", defaultProperties["font-family"]);
  }
}

function setHeaderStyle(id, property) {
  if (property) $(id).addClass("selected");else $(id).removeClass("selected");
}

$(".alignment").click(function (e) {
  $(".alignment").removeClass("selected");
  $(this).addClass("selected");
  var align = $(this).attr("data-type");
  $(".input-cell.selected").css("text-align", align);
  updateCellData("alignment", align);
});
$("#bold").click(function (e) {
  if (!$(this).hasClass("selected")) {
    $(".input-cell.selected").css("font-weight", "bold");
    updateCellData("bold", true);
  } else {
    $(".input-cell.selected").css("font-weight", 400);
    updateCellData("bold", false);
  }

  $(this).toggleClass("selected");
});
$("#italic").click(function (e) {
  if (!$(this).hasClass("selected")) {
    $(".input-cell.selected").css("font-style", "italic");
    updateCellData("italic", true);
  } else {
    $(".input-cell.selected").css("font-style", "normal");
    updateCellData("italic", false);
  }

  $(this).toggleClass("selected");
});
$("#underlined").click(function (e) {
  if (!$(this).hasClass("selected")) {
    $(".input-cell.selected").css("text-decoration", "underline");
    updateCellData("underlined", true);
  } else {
    $(".input-cell.selected").css("text-decoration", "none");
    updateCellData("underlined", false);
  }

  $(this).toggleClass("selected");
});
$("#cells").scroll(function (e) {
  $("#columns").scrollLeft(this.scrollLeft);
  $("#rows").scrollTop(this.scrollTop);
}); // $(".pick-color").click(() => console.log("cliecked"));

$(".pick-color").colorPick({
  initialColor: "#abcd",
  allowRecent: true,
  recentMax: 5,
  allowCustomColor: false,
  palette: ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
  onColorSelected: function onColorSelected() {
    // this.element.css({ backgroundColor: this.color, color: this.color });
    if (this.color != "#ABCD") {
      var id = $(this.element.children()[1]).attr("id"); // console.log(id);

      $(this.element.children()[1]).css("border-color", this.color);

      if (id == "fill-color") {
        $(".input-cell.selected").css("background-color", this.color);
        updateCellData("bgcolor", this.color);
      } else {
        $(".input-cell.selected").css("color", this.color);
        updateCellData("color", this.color);
      }
    } // console.log(this.element.children()[0]);

  }
});
$(".add-sheet").click(function (e) {
  totalSheets++;
  lastSheetAdded++;
  $(".sheet-tab").removeClass("selected");
  $(".sheet-tab-container").append("<div class=\"sheet-tab selected\">Sheet".concat(lastSheetAdded, "</div>"));
  sheets[$(".sheet-tab.selected").text()] = {};
  addSheetListeners();
  emptyPreviousSheet();
  selectedSheet = $(".sheet-tab.selected").text();
  $(".sheet-tab.selected")[0].scrollIntoView({
    behaviour: "smooth"
  });
  saved = false;
});

function addSheetListeners() {
  $(".sheet-tab.selected").click(function (e) {
    if ($(this).text() != selectedSheet) {
      $(".sheet-tab").removeClass("selected");
      $(this).addClass("selected");
      emptyPreviousSheet();
      selectedSheet = $(this).text();
      $(".sheet-tab").removeClass("selected");
      $(this).addClass("selected");
      loadNewSheet();
    }
  });
  $(".sheet-tab.selected").on("contextmenu", function (e) {
    e.preventDefault();
    selectSheet(this);
    $(".sheet-options-modal").remove();
    $(".container").append("<div class=\"sheet-options-modal\">\n    <div class=\"option sheet-rename\">Rename</div>\n    <div class=\"option sheet-delete\">Delete</div>\n  </div>");
    $(".sheet-options-modal").css({
      left: e.pageX
    });
    $(".sheet-rename").click(handleRenameSheet);
    $(".sheet-delete").click(handleDeleteSheet);
  });
}

$(".sheet-tab").on("contextmenu", function (e) {
  e.preventDefault();
  console.log("clicked context");
  selectSheet(this);
  $(".sheet-options-modal").remove();
  $(".container").append("<div class=\"sheet-options-modal\">\n  <div class=\"option sheet-rename\">Rename</div>\n  <div class=\"option sheet-delete\">Delete</div>\n</div>");
  $(".sheet-options-modal").css({
    left: e.pageX
  });
  $(".sheet-rename").click(handleRenameSheet);
  $(".sheet-delete").click(handleDeleteSheet);
});

function selectSheet(elem) {
  emptyPreviousSheet();
  selectedSheet = $(elem).text();
  $(".sheet-tab").removeClass("selected");
  $(elem).addClass("selected");
  loadNewSheet();
}

$(".sheet-tab").click(function (e) {
  if ($(this).text() != selectedSheet) {
    selectSheet(this);
  }
});

function emptyPreviousSheet() {
  var rowKeys = Object.keys(sheets[selectedSheet]); // console.log("rowkeys", rowKeys);

  for (var _i4 = 0, _rowKeys = rowKeys; _i4 < _rowKeys.length; _i4++) {
    var _i5 = _rowKeys[_i4];
    var colKeys = Object.keys(sheets[selectedSheet][_i5]);

    for (var _i6 = 0, _colKeys = colKeys; _i6 < _colKeys.length; _i6++) {
      var _j3 = _colKeys[_i6];
      var cell = $("#row-".concat(parseInt(_i5) + 1, "-col-").concat(parseInt(_j3) + 1)); // console.log(cell);

      cell.text("");
      cell.css({
        "font-family": "Noto Sans",
        "font-size": 14,
        "font-weight": 400,
        "font-style": "none",
        "text-decoration": "none",
        "text-align": "left",
        color: "#444",
        "background-color": "#fff"
      });
    }
  }
}

function loadNewSheet() {
  var rowKeys = Object.keys(sheets[selectedSheet]);

  for (var _i7 = 0, _rowKeys2 = rowKeys; _i7 < _rowKeys2.length; _i7++) {
    var _i8 = _rowKeys2[_i7];
    var colKeys = Object.keys(sheets[selectedSheet][_i8]);

    for (var _i9 = 0, _colKeys2 = colKeys; _i9 < _colKeys2.length; _i9++) {
      var _j4 = _colKeys2[_i9];
      var cell = $("#row-".concat(parseInt(_i8) + 1, "-col-").concat(parseInt(_j4) + 1));
      cell.text(sheets[selectedSheet][_i8][_j4]["text"]);
      cell.css({
        "font-family": sheets[selectedSheet][_i8][_j4]["font-family"],
        "font-size": sheets[selectedSheet][_i8][_j4]["font-size"],
        "font-weight": sheets[selectedSheet][_i8][_j4]["bold"] ? "bold" : 400,
        "font-style": sheets[selectedSheet][_i8][_j4]["italic"] ? "italic" : "none",
        "text-decoration": sheets[selectedSheet][_i8][_j4]["underlined"] ? "underline" : "none",
        "text-align": sheets[selectedSheet][_i8][_j4]["alignment"],
        color: sheets[selectedSheet][_i8][_j4]["color"],
        "background-color": sheets[selectedSheet][_i8][_j4]["bgcolor"]
      });
    }
  }
}

function handleRenameSheet(e) {
  var modal = $("<div class=\"sheet-modal-parent\">\n  <div class=\"sheet-rename-modal\">\n      <div class=\"sheet-modal-title\">Rename Sheet</div>\n      <div class=\"sheet-modal-input-container\">\n          <span class=\"sheet-modal-input-title\">Rename Sheet to:</span>\n          <input class=\"sheet-modal-input\" type=\"text\" />\n      </div>\n      <div class=\"sheet-modal-confirmation\">\n          <div class=\"button yes-button\">OK</div>\n          <div class=\"button no-button\">Cancel</div>\n      </div>\n  </div>\n</div>");
  $(".container").append(modal);
  $(".no-button").click(function (e) {
    $(".sheet-modal-parent").remove();
  });
  $(".yes-button").click(function () {
    var val = $(".sheet-modal-input").val();

    if (val && !Object.keys(sheets).includes(val)) {
      sheets[val] = _objectSpread({}, sheets[selectedSheet]);
      var copySheets = {};
      Object.keys(sheets).forEach(function (sheet) {
        if (sheet != selectedSheet) {
          copySheets[sheet] = _objectSpread({}, sheets[sheet]);
        } else {
          copySheets[val] = _objectSpread({}, sheets[sheet]);
        }
      });
      $(".sheet-tab").each(function (index, elem) {
        if ($(elem).text() === selectedSheet) {
          $(elem).text(val);
        }
      });
      sheets = _objectSpread({}, copySheets);
      selectedSheet = val;
      saved = false;
    } else {
      $(".rename-error").remove();
      $(".sheet-modal-input-container").append("<div class=\"rename-error\">Sheet already exists or please enter a value</div>");
    }

    $(".sheet-modal-parent").remove();
  });
}

$(".container").click(function (e) {
  $(".sheet-options-modal").remove();
});

function handleDeleteSheet(e) {
  var modal = $("<div class=\"sheet-modal-parent\">\n  <div class=\"sheet-delete-modal\">\n      <div class=\"sheet-modal-title\">Sheet Name</div>\n      <div class=\"sheet-modal-detail-container\">\n          <span class=\"sheet-modal-detail-title\">Are you sure?</span>\n      </div>\n      <div class=\"sheet-modal-confirmation\">\n          <div class=\"button yes-button\">\n              <div class=\"material-icons delete-icon\">delete</div>\n              Delete\n          </div>\n          <div class=\"button no-button\">Cancel</div>\n      </div>\n  </div>\n</div>");
  $(".container").append(modal);
  $(".no-button").click(function (e) {
    $(".sheet-modal-parent").remove();
  });
  $(".yes-button").click(function (e) {
    var keys = Object.keys(sheets);
    var deletedSheet = selectedSheet;
    keys.forEach(function (sheet, index) {
      console.log("deleted", deletedSheet);

      if (sheet === deletedSheet) {
        console.log("index", index);

        if (index == keys.length - 1) {
          selectSheet($(".sheet-tab")[0]);
        } else {
          selectSheet($(".sheet-tab")[index + 1]);
        }

        delete sheets[deletedSheet];
      }
    });
    $(".sheet-tab").each(function (idx, elem) {
      if ($(elem).text() === deletedSheet) {
        $(elem).remove();
      }
    });
    $(".sheet-modal-parent").remove();
    totalSheets--;
    saved = false;
  });
}

$(".left-scroller").click(function (e) {
  var keys = Object.keys(sheets);
  var index = keys.indexOf(selectedSheet);

  if (index != 0) {
    selectSheet($(".sheet-tab")[index - 1]);
    $(".sheet-tab")[index - 1].scrollIntoView({
      behaviour: "smooth"
    });
  }
});
$(".right-scroller").click(function (e) {
  var keys = Object.keys(sheets);
  var index = keys.indexOf(selectedSheet);

  if (index != keys.length - 1) {
    selectSheet($(".sheet-tab")[index + 1]);
    $(".sheet-tab")[index + 1].scrollIntoView({
      behaviour: "smooth"
    });
  }
});
$(".menu-selector").change(function (e) {
  var value = $(this).val();
  var id = $(this).attr("id");

  if (id == "font-family") {
    $(".input-cell.selected").css("font-family", value);
    updateCellData("font-family", value);
  } else {
    var num = parseInt(value);
    $(".input-cell.selected").css("font-size", num);
    updateCellData("font-size", num);
  }
});

function updateCellData(property, value) {
  var oldCellData = JSON.stringify(sheets);

  if (value != defaultProperties[property]) {
    $(".input-cell.selected").each(function (idx, data) {
      var _getRowColId5 = getRowColId(data),
          _getRowColId6 = _slicedToArray(_getRowColId5, 2),
          rowId = _getRowColId6[0],
          colId = _getRowColId6[1];

      if (sheets[selectedSheet][rowId - 1] == undefined) {
        sheets[selectedSheet][rowId - 1] = {};
        sheets[selectedSheet][rowId - 1][colId - 1] = _objectSpread(_objectSpread({}, defaultProperties), {}, {
          upStream: [],
          downStream: []
        });
        sheets[selectedSheet][rowId - 1][colId - 1][property] = value;
      } else {
        if (sheets[selectedSheet][rowId - 1][colId - 1] == undefined) {
          sheets[selectedSheet][rowId - 1][colId - 1] = _objectSpread(_objectSpread({}, defaultProperties), {}, {
            upStream: [],
            downStream: []
          });
          sheets[selectedSheet][rowId - 1][colId - 1][property] = value;
        } else {
          sheets[selectedSheet][rowId - 1][colId - 1][property] = value;
        }
      }
    });
  } else {
    $(".input-cell.selected").each(function (idx, data) {
      var _getRowColId7 = getRowColId(data),
          _getRowColId8 = _slicedToArray(_getRowColId7, 2),
          rowId = _getRowColId8[0],
          colId = _getRowColId8[1];

      if (sheets[selectedSheet][rowId - 1] && sheets[selectedSheet][rowId - 1][colId - 1]) {
        sheets[selectedSheet][rowId - 1][colId - 1][property] = value;

        if (JSON.stringify(sheets[selectedSheet][rowId - 1][colId - 1]) == JSON.stringify(defaultProperties)) {
          delete sheets[selectedSheet][rowId - 1][colId - 1];
          if (Object.keys(sheets[selectedSheet][rowId - 1]).length == 0) delete sheets[selectedSheet][rowId - 1];
        }
      }
    });
  }

  if (oldCellData !== JSON.stringify(sheets)) {
    saved = false;
  }
}

$("#menu-file").click(function (e) {
  var fileModal = $(" \n  <div class=\"file-modal-parent\">\n  <div class=\"file-modal\">\n  <div class=\"file-options-modal\">\n      <div class=\"close\">\n          <div class=\"material-icons close-icon\">arrow_circle_down</div>\n          <div>Close</div>\n      </div>\n      <div class=\"new\">\n          <div class=\"material-icons new-icon\">insert_drive_file</div>\n          <div>New</div>\n      </div>\n      <div class=\"open\">\n          <div class=\"material-icons open-icon\">folder_open</div>\n          <div>Open</div>\n      </div>\n      <div class=\"save\">\n          <div class=\"material-icons save-icon\">save</div>\n          <div>Save</div>\n      </div>\n  </div>\n  <div class=\"file-recent-modal\"></div>\n</div></div>");
  $(".container").append(fileModal);
  $(".close").click(function (e) {
    console.log("clicked");
    $(".file-modal-parent").remove();
  });
  $(".file-modal-parent").click(function (e) {
    $(this).remove();
  });
  $(".file-modal").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
  $(".open").click(function (e) {
    openFile();
    $(".file-modal-parent").remove();
  });
  $(".new").click(function (e) {
    $(".file-modal-parent").remove();

    if (!saved) {
      var sureModal = $("<div class=\"sheet-modal-parent\">\n       <div class=\"sheet-delete-modal\">\n           <div class=\"sheet-modal-title\">".concat($(".title").text(), "</div>\n           <div class=\"sheet-modal-detail-container\">\n               <span class=\"sheet-modal-detail-title\">Do you want to save the unsaved changes?</span>\n           </div>\n           <div class=\"sheet-modal-confirmation\">\n               <div class=\"button yes-button\">\n                   Yes\n               </div>\n               <div class=\"button no-button\">No</div>\n           </div>\n       </div>\n     </div>"));
      $(".container").append(sureModal);
      $(".yes-button").click(function (e) {
        $(".sheet-modal-parent").remove();
        saveFile(true);
      });
      $(".no-button").click(function (e) {
        $(".sheet-modal-parent").remove();
        openNewFile();
      });
    } else {
      openNewFile();
    }
  });
  $(".save").click(function (e) {
    $(".file-modal-parent").remove();
    saveFile();
  });
});

function openNewFile() {
  emptyPreviousSheet();
  selectedSheet = "Sheet1";
  sheets = {
    Sheet1: {}
  };
  totalSheets = 1;
  lastSheetAdded = 1;
  $(".sheet-tab").remove();
  $(".sheet-tab-container").append("<div class=\"sheet-tab selected\">Sheet1</div>");
  $(".title").text("Excel-Book");
  $("#row-1-col-1").click();
}

function saveFile(newClicked) {
  var saveModal = $("<div class=\"sheet-modal-parent\">\n    <div class=\"sheet-rename-modal\">\n        <div class=\"sheet-modal-title\">Save File</div>\n        <div class=\"sheet-modal-input-container\">\n            <span class=\"sheet-modal-input-title\">Enter File Name:</span>\n            <input class=\"sheet-modal-input\" type=\"text\" />\n        </div>\n        <div class=\"sheet-modal-confirmation\">\n            <div class=\"button yes-button\">OK</div>\n            <div class=\"button no-button\">Cancel</div>\n        </div>\n    </div>\n  </div>");
  $(".container").append(saveModal);
  $(".no-button").click(function (e) {
    $(".sheet-modal-parent").remove();
  });
  $(".yes-button").click(function (e) {
    $(".title").text($(".sheet-modal-input").val());
    var a = document.createElement("a");
    a.href = "data:application/json,".concat(encodeURIComponent(JSON.stringify(sheets)));
    console.log(a);
    a.download = $(".title").text() + ".json";
    $(".container").append(a);
    a.click();
    a.remove();
    saved = true;
    $(".sheet-modal-parent").remove();

    if (newClicked) {
      openNewFile();
    }
  });
}

function openFile() {
  var inputFile = $("<input accept=\"application/json\" type=\"file\" />");
  $(".container").append(inputFile);
  inputFile.click();
  inputFile.change(function (e) {
    var file = e.target.files[0];
    $(".title").text(file.name.split(".json")[0]);
    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
      emptyPreviousSheet();
      $(".sheet-tab").remove();
      sheets = JSON.parse(reader.result);
      console.log(sheets);
      var keys = Object.keys(sheets);
      lastSheetAdded = 1;

      for (var _i10 = 0, _keys = keys; _i10 < _keys.length; _i10++) {
        var _i11 = _keys[_i10];

        if (_i11.includes("Sheet")) {
          var splittedSheetArray = _i11.split("Sheet");

          if (splittedSheetArray.length == 2 && !isNaN(splittedSheetArray[1])) {
            lastSheetAdded = parseInt(splittedSheetArray[1]);
          }
        }

        $(".sheet-tab-container").append("<div class=\"sheet-tab selected\">".concat(_i11, "</div>"));
      }

      addSheetListeners();
      $(".sheet-tab").removeClass("selected");
      $($(".sheet-tab")[0]).addClass("selected");
      selectedSheet = keys[0];
      totalSheets = keys.length;
      loadNewSheet();
      inputFile.remove();
    };
  });
}

var clipBoard;
var contentCutted;
$(".copy,.cut").click(function (e) {
  if ($(this).text() === "content_cut") contentCutted = true;
  clipBoard = {
    startCell: [],
    cellData: {}
  };
  clipBoard.startCell = getRowColId($(".input-cell.selected")[0]);
  var _clipBoard = clipBoard,
      cellData = _clipBoard.cellData;
  $(".input-cell.selected").each(function (idx, elem) {
    var _getRowColId9 = getRowColId(elem),
        _getRowColId10 = _slicedToArray(_getRowColId9, 2),
        row = _getRowColId10[0],
        col = _getRowColId10[1];

    if (sheets[selectedSheet][row - 1] && sheets[selectedSheet][row - 1][col - 1]) {
      if (!cellData[row]) {
        cellData[row] = {};
      }

      cellData[row][col] = _objectSpread({}, sheets[selectedSheet][row - 1][col - 1]);

      if (contentCutted) {
        delete sheets[selectedSheet][row - 1][col - 1];
        if (Object.keys(sheets[selectedSheet][row - 1]).length == 0) delete sheets[selectedSheet][row - 1];
        var cell = $("#row-".concat(parseInt(row), "-col-").concat(parseInt(col)));
        cell.text("");
        cell.css({
          "font-family": "Noto Sans",
          "font-size": 14,
          "font-weight": 400,
          "font-style": "none",
          "text-decoration": "none",
          "text-align": "left",
          color: "#444",
          "background-color": "#fff"
        });
      }
    }
  });
  console.log(clipBoard);
});
$(".paste").click(function (e) {
  var sCell = getRowColId($(".input-cell.selected")[0]);
  var _clipBoard2 = clipBoard,
      cellData = _clipBoard2.cellData;
  var rows = Object.keys(cellData);
  console.log(rows);

  for (var _i12 = 0, _rows = rows; _i12 < _rows.length; _i12++) {
    i = _rows[_i12];
    var cols = Object.keys(cellData[i]);

    for (var _i13 = 0, _cols = cols; _i13 < _cols.length; _i13++) {
      j = _cols[_i13];
      var rowDiff = parseInt(i) - clipBoard.startCell[0];
      var colDiff = parseInt(j) - clipBoard.startCell[1];

      if (!sheets[selectedSheet][sCell[0] + rowDiff - 1]) {
        sheets[selectedSheet][sCell[0] + rowDiff - 1] = {};
      }

      sheets[selectedSheet][sCell[0] + rowDiff - 1][sCell[1] + colDiff - 1] = cellData[i][j];
    }
  }

  loadNewSheet();

  if (contentCutted) {
    contentCutted = false;
    clipBoard = {
      startCell: [],
      cellData: {}
    };
  }
});
$("#formula-input").blur(function (e) {
  if ($(".input-cell.selected").length > 0) {
    var formula = $(this).text(); // console.log($(this).val());

    var splitArr = formula.split(" ");
    var elements = [];

    var _iterator = _createForOfIteratorHelper(splitArr),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _i14 = _step.value;

        if (_i14.length >= 2) {
          _i14 = _i14.replace("(", "");
          _i14 = _i14.replace(")", "");
          elements.push(_i14);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    $(".input-cell.selected").each(function (index, elem) {
      if (updateStream(elem, elements)) {
        console.log("passed");
      } else {
        console.log("not");
      }
    });
    console.log(elements);
  } else {
    alert("!Please select a cell to apply the formula");
  }
});

function updateStream(elem, elements) {
  var _getRowColId11 = getRowColId(elem),
      _getRowColId12 = _slicedToArray(_getRowColId11, 2),
      rowId = _getRowColId12[0],
      colId = _getRowColId12[1];

  var selfCode = $(".column-".concat(colId)).attr("id") + rowId;

  if (elements.includes(selfCode)) {
    return false;
  }

  return true;
}

console.log("hello parcel");
},{"perfect-scrollbar":"node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52069" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map