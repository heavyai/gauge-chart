'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React$1 = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default$1 = /*#__PURE__*/_interopDefaultLegacy(React$1);

var dist = {};

Object.defineProperty(dist, '__esModule', { value: true });

var React = React__default$1["default"];

function _interopDefaultLegacy$1 (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy$1(React);

/*
  This is the meat of the library.
  Set it up in your component like this:

  const SomeReactComponent( { someValue } ) => {

    // make a local copy of the variable that you're going to interpolate.
    const [interpolatedSomeValue, setInterpolatedSomeValue] = useState(someValue);

    // and then actually interpolate it.
    useInterpolate(someValue, setInterpolatedSomeValue)

    // later, when you would have done this:
    // <div width = {someValue}>Some DIV element</div>
    // instead do this:
    <div width={interpolatedSomeValue}>Some DIV element</div>

    // And you are done.
  }

  There is a third argument - an options object which you can pass along:

    getDelta - should be a function which accepts a single object, which contains
      three values - { to, from, percent }
      from is the value at the start of the interpolation
      to is the value at the end of the interpolation
      percent is a float from 0->1 showing how far along the animation we are.
      Pass this arg to change easing speed or animation effects, such as to use
      a quadratic ease function or animate text typing.

    duration - length of the animation in ms

    getHasChanges - a function to determine if there are changes to the values.
      should accept an object with two keys - current and previous
      current is an object with key/value mapping at the end of the interpolation.
      previous is an object with key/value mapping when the interpolation started.

    initial - sometimes you want an interpolation to start from a different value
      than the one initially set on the component when it is first mounted.
      You can pass in a set of initial values to use here.

    loop - repeat the animation from the beginning the specified number of times.
      e.g., 5 repeats 5x, 10 repeats 10x.
      0 is the default where it will not repeat.
      -1 repeats infinite times.

      Again, rememeber, it loops from the beginning.

*/

/*
  The default delta easing. Given percent, from, and to.
  Returns a value between from and to, at a given percentage, with linear easing.

  e.g.,
  animatorDefaultEasing({from : 50, to : 100, percent : .5})
  // returns 75, since it's halfway between 50 and 100.

  You can use this function if it is useful to you, and otherwise provide your own.
*/

var animatorDefaultEasing = function animatorDefaultEasing(_ref) {
  var percent = _ref.percent,
      from = _ref.from,
      to = _ref.to;
  return from + Math.min(1, percent) * (to - from);
};
/*
  By default, if we have no previous values, we have no changes.
  otherwise, if the two objects are not identical, we have changes.
*/

var defaultHasChanges = function defaultHasChanges(current, previous) {
  return previous !== undefined && current !== previous;
};

var useInterpolate = function useInterpolate(current, setter) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$getDelta = _ref2.getDelta,
      getDelta = _ref2$getDelta === void 0 ? animatorDefaultEasing : _ref2$getDelta,
      _ref2$duration = _ref2.duration,
      duration = _ref2$duration === void 0 ? 500 : _ref2$duration,
      _ref2$getHasChanges = _ref2.getHasChanges,
      getHasChanges = _ref2$getHasChanges === void 0 ? defaultHasChanges : _ref2$getHasChanges,
      initial = _ref2.initial,
      _ref2$loop = _ref2.loop,
      loop = _ref2$loop === void 0 ? 0 : _ref2$loop,
      _ref2$onCompleteCallb = _ref2.onCompleteCallback,
      onCompleteCallback = _ref2$onCompleteCallb === void 0 ? function () {} : _ref2$onCompleteCallb;

  // requestAnimationFrame starts ticking as soon as the page is loaded. We'll need
  // to do conversions between absolute page load time vs relative interpolation time.
  var startTime = React.useRef(performance.now()); // keep track of the last set of values at the start of the interpolation, defaulting
  // to the initial values.

  var previous = React.useRef(initial); // keep track of the last frame of animation, in case we want to cancel it.

  var lastFrame = React.useRef({}); // and further key each animation so we won't accidentally re-run something.
  // const renderKey = useRef(1)

  var hasChanges = getHasChanges(current, previous.current); // if we have changes and are re-interpolating AND an animation frame is pending,
  // then cancel it out and set our "last" values to wherever the interpolation had
  // moved us to at that point. Then wipe out our lastFrame.

  if (hasChanges && lastFrame.current.frame) {
    cancelAnimationFrame(lastFrame.current.frame);
    previous.current = lastFrame.current.delta || initial;
    lastFrame.current = {};
  } // we enter the effect when hasChanges has changed.


  React.useEffect(function () {
    // blank out our last startTime, since we'll rewrite it in the animation frame.
    startTime.current = undefined; // keep a ref to our previous values.

    var prevVals = previous.current; // and increment our renderKey.
    // const myKey = renderKey.current++
    // the effect fires if hasChanges has changed. But we don't actually want to
    // fire the animation unless hasChanges is actually true.

    if (hasChanges) {
      // request an animation frame and save it.
      lastFrame.current.frame = requestAnimationFrame(function animate(time) {
        // this is disabled for now for more testing.

        /*
        if (myKey !== renderKey.current) {
          return;
        }
        //*/
        // save the startTime on the first frame if we need to.
        startTime.current = startTime.current || time; // and convert from absolute page time to relative interpolation time.

        time -= startTime.current; // if our current time < duration, we're still interpolating.
        // get newDelta values, call the setter with them, and save them along
        // with requesting a new frame.

        if (time < duration || loop--) {
          // if (time < duration) {
          var newDelta = getDelta({
            from: prevVals,
            to: current,
            percent: time / duration
          });
          setter(function () {
            return newDelta;
          });
          lastFrame.current.delta = newDelta;
          lastFrame.current.frame = requestAnimationFrame(animate);

          if (loop && time >= duration) {
            previous.current = prevVals;
            startTime.current = undefined;
          }
        } else {
          // otherwise, we've the duration. So we just call the setter with our final
          // values, update our previous value, and wipe out the last frame.
          setter(function () {
            return current;
          });
          previous.current = current;
          lastFrame.current = {};
          onCompleteCallback({
            from: prevVals,
            to: current
          });
        }
      });
    } // always save the new current values as the previous ones whenever we enter.


    previous.current = current; // eslint-disable-next-line
  }, [hasChanges]);
};

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

var DEFAULT_DURATION = 500;

/*
  I'm playing around with how I want to structure this code.
  For now, an Animation is identical to an AnimationGroup, except it only accepts
  one component via a render prop instead of a list of children.

  You probably don't want to use this directly and probably want to import Animator
  instead.

  In fact, go look at the more thorough documentation over in Animator.
*/

var ANIMATOR_INITIAL = "animator-initial";

var Animation = function Animation(_ref) {
  var _ref$values = _ref.values,
      values = _ref$values === void 0 ? [] : _ref$values,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? DEFAULT_DURATION : _ref$duration,
      child = _ref.child,
      _ref$easing = _ref.easing,
      easing = _ref$easing === void 0 ? {} : _ref$easing,
      _ref$defaultEasing = _ref.defaultEasing,
      defaultEasing = _ref$defaultEasing === void 0 ? animatorDefaultEasing : _ref$defaultEasing,
      _ref$initial = _ref.initial,
      initial = _ref$initial === void 0 ? {} : _ref$initial,
      _ref$loop = _ref.loop,
      loop = _ref$loop === void 0 ? 0 : _ref$loop,
      onCompleteCallback = _ref.onCompleteCallback;
  // given our values array, look to the child to figure out our current values.
  var current = values.reduce(function (bucket, v) {
    return _objectSpread2(_objectSpread2({}, bucket), {}, _defineProperty$1({}, v, child.props[v]));
  }, {}); // we're going to build a new initial object

  var fullInitial = {}; // pull out any initial values set on the child

  var childInit = child.props[ANIMATOR_INITIAL] || {}; // now iterate over our values (which is a list of keys)
  // and set the initial value to the child's init value, our component init value, or the
  // child's current prop value.

  values.forEach(function (v) {
    var _ref2, _childInit$v;

    fullInitial[v] = (_ref2 = (_childInit$v = childInit[v]) !== null && _childInit$v !== void 0 ? _childInit$v : initial[v]) !== null && _ref2 !== void 0 ? _ref2 : current[v];
  }); // standard useInterpolate call - save localValues to hand through to the child.

  var _useState = React.useState(fullInitial),
      _useState2 = _slicedToArray(_useState, 2),
      localValues = _useState2[0],
      setLocalValues = _useState2[1];

  useInterpolate(current, setLocalValues, {
    // here we have changes if any key in our current set of values has changed from
    // our last set of values.
    //
    // remember - this is not all props on the child, this is just the props in our
    // values array.
    getHasChanges: function getHasChanges(c, previous) {
      return Boolean(Object.keys(c).find(function (key) {
        return previous && c[key] !== previous[key];
      }));
    },
    duration: duration,
    initial: fullInitial,
    loop: loop,
    // our getDelta function needs to construct a new object with each value interpolated
    // along the way.
    getDelta: function getDelta(_ref3) {
      var percent = _ref3.percent,
          from = _ref3.from,
          to = _ref3.to;
      return Object.keys(to).reduce(function (bucket, v) {
        var easingFunc = easing[v] || defaultEasing;
        var newValue = easingFunc({
          from: from[v],
          to: to[v],
          percent: percent,
          value: v
        });
        return _objectSpread2(_objectSpread2({}, bucket), {}, _defineProperty$1({}, v, newValue));
      }, {});
    },
    onCompleteCallback: onCompleteCallback
  }); // finally, we're going to clone the child with the new props
  // but toss out the animator-initial value: we don't need it any more and don't
  // want it writing to the DOM.

  return /*#__PURE__*/React__default['default'].cloneElement(child, _objectSpread2(_objectSpread2({}, localValues), {}, _defineProperty$1({}, ANIMATOR_INITIAL, undefined)));
};

var AnimationGroup = function AnimationGroup(props) {
  var args = _objectSpread2({}, props);

  delete args.children;
  return React__default['default'].Children.map(props.children, function (child) {
    return /*#__PURE__*/React__default['default'].createElement(Animation, Object.assign({}, args, {
      child: child
    }));
  });
};

/*
  I'm playing around with how I want to structure this code.
  For now, just use Animator and it'll work with as many children as you pass it,
  deferring the actual work to an Animation or AnimationGroup component.

  Say you have this element in an SVG graphic:
  <rect x = {0} y = {10} width = {width} height = {10} fill = "blue" />

  And you want to animate that width value, so when you change the value, the bar
  animates to the new size. All you need to do is wrapper it with an Animator.

  <Animator values = {["width"]}>
    <rect x = {x} y = {y} width = {width} height = {10} fill = "blue" />
  </Animator>

  If you want to animate all of those variables:
  <Animator values = {["width", "x", "y"]}>
    <rect x = {x} y = {y} width = {width} height = {10} fill = "blue" />
  </Animator>

  Now if any (or all!) of x, y, or width change, it'll animate to the new position.

  Animator (and the other verions it wrappers) accepts several props:

    values - an array of strings to watch for changes. These props MUST be named
      on the child components for them to be handed through.
    duration - length of the interpolation duration in ms. Defaults to 500
    easing - an object of { [value] : easingFunction }
      the easingFunction is the same as the getDelta function in useInterpolate.
      Accepts an arg of a single object of {from, to, percent}
    defaultEasing - change the default easing used if a specific easing for a given
      value is not provided.
    initial - an object containing { [value] : initialValue } This is optional.
      The initial object is used if you want to start from a different position.

      For example:
        <Animator values = {["x"]}>
          <rect x = {x} y = {0} width = {50} height = {50} />
        </Animator>

      Let's say the first time you mount the component, x = 50. It will draw immediately
      at x ={50} w/o animation.

      initial is used to provide that first transition into the DOM.
        <Animator values = {["x"]} initial = {{x : 0}}>
          <rect x = {x} y = {0} width = {50} height = {50} />
        </Animator>
      This will mount the component with an x value of 0 and then interpolate it until it
      reaches 50.

      This is to keep your data value (which is x = 50) separate from a sugared animation value
      (have it fly in from 0)

    It's possible that child components should animate starting at different positions.
    Animator looks for a prop on its children called `animator-initial`. If present, initial
    values in there will be used.

    The precedence for an intial value is:
      child.animator-initial[value]
      Animator.initial[value]
      child.props[value]

*/

var Animator = function Animator(props) {
  var args = _objectSpread2({
    duration: DEFAULT_DURATION
  }, props);

  return React__default['default'].Children.count(args.children) > 1 ? /*#__PURE__*/React__default['default'].createElement(AnimationGroup, args) : /*#__PURE__*/React__default['default'].createElement(Animation, Object.assign({}, args, {
    child: React__default['default'].Children.only(args.children)
  }));
};

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var _excluded = ["render"];

/*
  very simple component, just around as a reflector. Takes a render prop, then hands
  all props it was given through to that render prop.

  This is useful for cases where you want to provide an interpolated value to a child
  component, but NOT as a prop of that component.

  Or just roll your own flavor of this, I'm not your dad.
*/
var AnimationConsumer = function AnimationConsumer(_ref) {
  var render = _ref.render,
      props = _objectWithoutProperties(_ref, _excluded);

  return render(props);
};

dist.Animation = Animation;
dist.AnimationConsumer = AnimationConsumer;
dist.AnimationGroup = AnimationGroup;
var Animator_1 = dist.Animator = Animator;
dist.DEFAULT_DURATION = DEFAULT_DURATION;
dist.animatorDefaultEasing = animatorDefaultEasing;
dist.useInterpolate = useInterpolate;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var classnames = {exports: {}};

/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

(function (module) {
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if (module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}
}());
}(classnames));

var cx = classnames.exports;

var deg2rad = function deg2rad(angle) {
  return angle * Math.PI / 180;
};

var polarToCartesian = function polarToCartesian(_ref) {
  var angle = _ref.angle,
      _ref$startPos = _ref.startPos,
      startPos = _ref$startPos === void 0 ? 0 : _ref$startPos,
      _ref$radius = _ref.radius,
      radius = _ref$radius === void 0 ? 50 : _ref$radius,
      _ref$cx = _ref.cx,
      cx = _ref$cx === void 0 ? 50 : _ref$cx,
      _ref$cy = _ref.cy,
      cy = _ref$cy === void 0 ? 50 : _ref$cy;
  var rad = deg2rad(angle) - startPos;
  return {
    x: cx - radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad)
  };
};

var formatAsPercentage = function formatAsPercentage(num) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return "".concat((num * 100).toFixed(decimals), "%");
};

var WedgeLabel = function WedgeLabel(_ref) {
  var origin = _ref.origin,
      angle = _ref.angle,
      label = _ref.label,
      color = _ref.color,
      radius = _ref.radius,
      _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? 2 : _ref$offset,
      _ref$textAnchor = _ref.textAnchor,
      textAnchor = _ref$textAnchor === void 0 ? "start" : _ref$textAnchor,
      _ref$alignmentBaselin = _ref.alignmentBaseline,
      alignmentBaseline = _ref$alignmentBaselin === void 0 ? "auto" : _ref$alignmentBaselin,
      className = _ref.className;
  var labelCoords = polarToCartesian({
    angle: angle,
    radius: radius + offset,
    cx: origin.x,
    cy: origin.y
  });
  return /*#__PURE__*/React__default$1["default"].createElement("g", {
    className: "gauge-wedge-label-group"
  }, /*#__PURE__*/React__default$1["default"].createElement("text", {
    className: cx("gauge-text", "gauge-wedge-label-text", _defineProperty({}, className, Boolean(className))),
    x: labelCoords.x,
    y: labelCoords.y,
    fill: color,
    textAnchor: textAnchor,
    alignmentBaseline: alignmentBaseline
  }, label));
};

var Wedge = function Wedge(_ref) {
  var startAngle = _ref.startAngle,
      endAngle = _ref.endAngle,
      color = _ref.color,
      innerRadius = _ref.innerRadius,
      outerRadius = _ref.outerRadius,
      origin = _ref.origin,
      label = _ref.label,
      index = _ref.index,
      callback = _ref.callback;
  var innerStart = polarToCartesian({
    angle: startAngle,
    radius: innerRadius,
    cx: origin.x,
    cy: origin.y
  });
  var innerEnd = polarToCartesian({
    angle: startAngle,
    radius: outerRadius,
    cx: origin.x,
    cy: origin.y
  });
  var outerStart = polarToCartesian({
    angle: endAngle,
    radius: innerRadius,
    cx: origin.x,
    cy: origin.y
  });
  var outerEnd = polarToCartesian({
    angle: endAngle,
    radius: outerRadius,
    cx: origin.x,
    cy: origin.y
  });
  var handler = callback ? function () {
    return callback(index);
  } : undefined;
  return /*#__PURE__*/React__default$1["default"].createElement("g", {
    className: "wedge"
  }, /*#__PURE__*/React__default$1["default"].createElement("path", {
    d: "\n        M".concat(innerStart.x, ",").concat(innerStart.y, "\n        L").concat(innerEnd.x, ",").concat(innerEnd.y, "\n        A").concat(outerRadius, " ").concat(outerRadius, " 0 0 1 ").concat(outerEnd.x, " ").concat(outerEnd.y, "\n        L").concat(outerStart.x, ",").concat(outerStart.y, "\n        A").concat(innerRadius, " ").concat(innerRadius, " 0 0 0 ").concat(innerStart.x, " ").concat(innerStart.y, "\n        Z\n      "),
    fill: color,
    onClick: handler,
    style: {
      cursor: handler ? "pointer" : undefined
    }
  }), /*#__PURE__*/React__default$1["default"].createElement(WedgeLabel, {
    angle: startAngle,
    label: label,
    origin: origin,
    radius: outerRadius,
    textAnchor: startAngle > 90 ? "start" : "end"
  }));
};

var Meter = function Meter(_ref) {
  var _ref$startAngle = _ref.startAngle,
      startAngle = _ref$startAngle === void 0 ? 0 : _ref$startAngle,
      _ref$endAngle = _ref.endAngle,
      endAngle = _ref$endAngle === void 0 ? 180 : _ref$endAngle,
      wedges = _ref.wedges,
      innerRadius = _ref.innerRadius,
      outerRadius = _ref.outerRadius,
      origin = _ref.origin,
      startLabel = _ref.startLabel,
      endLabel = _ref.endLabel,
      decimals = _ref.decimals,
      callback = _ref.callback;
  var runningStartAngle = startAngle;
  var runningSize = 0;
  return /*#__PURE__*/React__default$1["default"].createElement("g", {
    className: "gauge-meter"
  }, wedges.map(function (wedge, i) {
    var _wedge$label;

    var wedgeStartAngle = runningStartAngle;
    runningStartAngle += wedge.size * endAngle;
    var runningStartSize = runningSize;
    runningSize += wedge.size;
    return /*#__PURE__*/React__default$1["default"].createElement(Animator_1, {
      values: ["startAngle", "endAngle"],
      key: i
    }, /*#__PURE__*/React__default$1["default"].createElement(Wedge, {
      key: i,
      startAngle: wedgeStartAngle,
      endAngle: runningStartAngle,
      size: wedge.size,
      color: wedge.color,
      label: startAngle === wedgeStartAngle ? wedge.label : (_wedge$label = wedge.label) !== null && _wedge$label !== void 0 ? _wedge$label : formatAsPercentage(runningStartSize, decimals),
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      origin: origin,
      index: i,
      callback: wedge.callback || callback
    }));
  }), /*#__PURE__*/React__default$1["default"].createElement(WedgeLabel, {
    angle: startAngle,
    label: startLabel,
    origin: origin,
    radius: outerRadius,
    textAnchor: "start",
    alignmentBaseline: "hanging"
  }), /*#__PURE__*/React__default$1["default"].createElement(WedgeLabel, {
    angle: endAngle,
    label: endLabel,
    origin: origin,
    radius: outerRadius,
    textAnchor: "end",
    alignmentBaseline: "hanging"
  }));
};

var Needle = function Needle(_ref) {
  var origin = _ref.origin,
      angle = _ref.angle,
      color = _ref.color,
      stroke = _ref.stroke,
      _ref$radius = _ref.radius,
      radius = _ref$radius === void 0 ? 50 : _ref$radius,
      _ref$needleWidth = _ref.needleWidth,
      needleWidth = _ref$needleWidth === void 0 ? 6 : _ref$needleWidth,
      label = _ref.label,
      outside = _ref.outside,
      _ref$labelOffset = _ref.labelOffset,
      labelOffset = _ref$labelOffset === void 0 ? 15 : _ref$labelOffset,
      callback = _ref.callback,
      _ref$classes = _ref.classes,
      classes = _ref$classes === void 0 ? [] : _ref$classes;
  var needleAngle = angle - 90;
  return /*#__PURE__*/React__default$1["default"].createElement("g", {
    className: "gauge-needle-group"
  }, /*#__PURE__*/React__default$1["default"].createElement("g", {
    transform: "rotate(".concat(needleAngle, ", ").concat(origin.x, " ").concat(origin.y, ")")
  }, /*#__PURE__*/React__default$1["default"].createElement("path", {
    className: cx("gauge-needle", {
      outside: outside
    }, classes),
    d: "M".concat(origin.x - needleWidth / 2, " ").concat(origin.y, "\n        A").concat(needleWidth / 2, " ").concat(needleWidth / 2, " 0 0 0 ").concat(origin.x + needleWidth / 2, " ").concat(origin.y, "\n        L").concat(origin.x, " ").concat(origin.y - radius, "\n        Z"),
    fill: color,
    stroke: stroke,
    strokeWidth: "1",
    onClick: callback,
    style: {
      cursor: callback ? "pointer" : undefined
    }
  })), /*#__PURE__*/React__default$1["default"].createElement("text", {
    className: "gauge-text gauge-needle-text",
    x: origin.x,
    y: origin.y + labelOffset,
    fill: color,
    fontSize: 12,
    textAnchor: "middle"
  }, label));
};

var Target = function Target(_ref) {
  var _ref$origin = _ref.origin,
      origin = _ref$origin === void 0 ? {} : _ref$origin,
      _ref$angle = _ref.angle,
      angle = _ref$angle === void 0 ? 0 : _ref$angle,
      _ref$innerRadius = _ref.innerRadius,
      innerRadius = _ref$innerRadius === void 0 ? 25 : _ref$innerRadius,
      _ref$outerRadius = _ref.outerRadius,
      outerRadius = _ref$outerRadius === void 0 ? 50 : _ref$outerRadius,
      stroke = _ref.stroke,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 1 : _ref$width,
      label = _ref.label;
  var x = origin.x,
      y = origin.y;
  var startPoint = polarToCartesian({
    angle: angle,
    radius: innerRadius,
    cx: x,
    cy: y
  });
  var endPoint = polarToCartesian({
    angle: angle,
    radius: outerRadius,
    cx: x,
    cy: y
  });
  return /*#__PURE__*/React__default$1["default"].createElement("g", {
    className: "gauge-target-group"
  }, /*#__PURE__*/React__default$1["default"].createElement("line", {
    className: "gauge-target-line",
    x1: startPoint.x,
    y1: startPoint.y,
    x2: endPoint.x,
    y2: endPoint.y,
    stroke: stroke,
    width: width
  }), /*#__PURE__*/React__default$1["default"].createElement(WedgeLabel, {
    angle: angle,
    label: label,
    origin: origin,
    radius: outerRadius,
    textAnchor: angle > 90 ? "start" : "end",
    color: stroke,
    className: "gauge-target-label-text"
  }));
};

var CHART_WIDTH = 250;
var CHART_HEIGHT = 135;

var GaugeChart = function GaugeChart(_ref) {
  var _ref$origin = _ref.origin,
      origin = _ref$origin === void 0 ? {
    x: CHART_WIDTH / 2,
    y: CHART_HEIGHT - 20
  } : _ref$origin,
      _ref$startAngle = _ref.startAngle,
      startAngle = _ref$startAngle === void 0 ? 0 : _ref$startAngle,
      _ref$endAngle = _ref.endAngle,
      endAngle = _ref$endAngle === void 0 ? 180 : _ref$endAngle,
      _ref$wedges = _ref.wedges,
      wedges = _ref$wedges === void 0 ? [] : _ref$wedges,
      value = _ref.value,
      valueLabel = _ref.valueLabel,
      targetValue = _ref.targetValue,
      targetLabel = _ref.targetLabel,
      min = _ref.min,
      givenMax = _ref.max,
      _ref$innerRadius = _ref.innerRadius,
      innerRadius = _ref$innerRadius === void 0 ? CHART_WIDTH / 4 : _ref$innerRadius,
      _ref$outerRadius = _ref.outerRadius,
      outerRadius = _ref$outerRadius === void 0 ? CHART_WIDTH / 2 * 0.83 : _ref$outerRadius,
      startLabel = _ref.startLabel,
      endLabel = _ref.endLabel,
      _ref$decimals = _ref.decimals,
      decimals = _ref$decimals === void 0 ? 0 : _ref$decimals,
      minNeedleAngle = _ref.minNeedleAngle,
      maxNeedleAngle = _ref.maxNeedleAngle,
      needleColor = _ref.needleColor,
      needleStroke = _ref.needleStroke,
      outsideNeedleColor = _ref.outsideNeedleColor,
      outsideNeedleStroke = _ref.outsideNeedleStroke,
      duration = _ref.duration,
      wedgeCallback = _ref.wedgeCallback,
      needleLabelOffset = _ref.needleLabelOffset,
      needleCallback = _ref.needleCallback,
      needleClasses = _ref.needleClasses;
  var max = givenMax <= min ? min + 1 : givenMax;
  var needleAngle = (value - min) / (max - min) * (endAngle - startAngle);
  var outsideNeedle = needleAngle < startAngle && minNeedleAngle !== undefined || needleAngle > endAngle && maxNeedleAngle !== undefined;

  if (needleAngle < startAngle && minNeedleAngle !== undefined) {
    needleAngle = minNeedleAngle;
    needleColor = outsideNeedleColor;
    needleStroke = outsideNeedleStroke;
  }

  if (needleAngle > endAngle && maxNeedleAngle !== undefined) {
    needleAngle = maxNeedleAngle;
    needleColor = outsideNeedleColor;
    needleStroke = outsideNeedleStroke;
  }

  var targetAngle = (targetValue - min) / (max - min) * (endAngle - startAngle);
  return /*#__PURE__*/React__default$1["default"].createElement("svg", {
    viewBox: "0 0 ".concat(CHART_WIDTH, " ").concat(CHART_HEIGHT),
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      width: "100%",
      height: "100%"
    },
    className: "gauge-chart"
  }, /*#__PURE__*/React__default$1["default"].createElement(Meter, {
    wedges: wedges,
    innerRadius: innerRadius,
    outerRadius: outerRadius,
    origin: origin,
    startLabel: startLabel,
    endLabel: endLabel,
    decimals: decimals,
    startAngle: startAngle,
    endAngle: endAngle,
    callback: wedgeCallback
  }), /*#__PURE__*/React__default$1["default"].createElement(Animator_1, {
    values: ["angle"],
    duration: duration
  }, /*#__PURE__*/React__default$1["default"].createElement(Needle, {
    angle: needleAngle,
    radius: outerRadius,
    origin: origin,
    label: valueLabel !== null && valueLabel !== void 0 ? valueLabel : formatAsPercentage((value - min) / (max - min), decimals),
    color: needleColor,
    stroke: needleStroke,
    outside: outsideNeedle,
    labelOffset: needleLabelOffset,
    callback: needleCallback,
    classes: needleClasses
  })), typeof targetValue === "number" && targetAngle >= startAngle && targetAngle <= endAngle && /*#__PURE__*/React__default$1["default"].createElement(Animator_1, {
    values: ["angle"],
    duration: duration
  }, /*#__PURE__*/React__default$1["default"].createElement(Target, {
    angle: targetAngle,
    innerRadius: innerRadius,
    outerRadius: outerRadius,
    origin: origin,
    label: targetLabel !== null && targetLabel !== void 0 ? targetLabel : formatAsPercentage((targetValue - min) / (max - min), decimals)
  })));
};

exports.GaugeChart = GaugeChart;
exports.deg2rad = deg2rad;
exports.formatAsPercentage = formatAsPercentage;
exports.polarToCartesian = polarToCartesian;
//# sourceMappingURL=index.js.map
