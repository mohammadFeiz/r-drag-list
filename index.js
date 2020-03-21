"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

require("./index.css");

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RList = /*#__PURE__*/function (_Component) {
  _inherits(RList, _Component);

  var _super = _createSuper(RList);

  function RList(props) {
    var _this;

    _classCallCheck(this, RList);

    _this = _super.call(this, props);
    var _this$props = _this.props,
        height = _this$props.height,
        size = _this$props.size,
        value = _this$props.value;
    _this.itemHeight = height / size;
    _this.offset = Math.floor(size / 2);

    _this.getItems();

    _this.state = {
      top: _this.getTop(_this.getTopByValue(value)),
      getItems: _this.getItems.bind(_assertThisInitialized(_this))
    };
    _this.time = 0;
    _this.date = new Date();
    _this.touch = _this.isMobile();
    return _this;
  }

  _createClass(RList, [{
    key: "isMobile",
    value: function isMobile() {
      return 'ontouchstart' in document.documentElement;
    }
  }, {
    key: "eventHandler",
    value: function eventHandler(selector, event, action) {
      var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'bind';
      var me = {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
      };
      event = this.isMobile() ? me[event] : event;
      var element = typeof selector === "string" ? selector === "window" ? (0, _jquery.default)(window) : (0, _jquery.default)(selector) : selector;
      element.unbind(event, action);

      if (type === 'bind') {
        element.bind(event, action);
      }
    }
  }, {
    key: "getClient",
    value: function getClient(e) {
      var mobile = this.isMobile();
      return mobile ? {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      } : {
        x: e.clientX,
        y: e.clientY
      };
    }
  }, {
    key: "mouseDown",
    value: function mouseDown(e) {
      clearInterval(this.interval);
      this.deltaPX = 0;
      var top = this.state.top;
      this.so = {
        top: top,
        y: this.getClient(e).y
      };
      this.eventHandler('window', 'mousemove', _jquery.default.proxy(this.mouseMove, this));
      this.eventHandler('window', 'mouseup', _jquery.default.proxy(this.mouseUp, this));
    }
  }, {
    key: "mouseMove",
    value: function mouseMove(e) {
      var _this$props2 = this.props,
          dragChange = _this$props2.dragChange,
          accel = _this$props2.accel;

      if (accel) {
        var time = new Date().getTime();
        this.deltaT = time - this.time;
        this.time = time;
        var y = this.getClient(e).y;
        this.deltaPX = y - this.y;
        this.y = y;
      }

      this.setTop(this.so.top - (this.so.y - this.getClient(e).y), 1, dragChange);
    }
  }, {
    key: "accel",
    value: function accel() {
      var _this2 = this;

      var top = this.state.top;
      var dragChange = this.props.dragChange;
      clearInterval(this.interval);
      this.speed = this.deltaPX / this.deltaT * 20 * 0.4;

      if (Math.abs(this.speed) < 1) {
        this.setTop(Math.round(top / this.itemHeight) * this.itemHeight, 0, !dragChange);
        return;
      }

      var minTop = this.getMinTop(),
          maxTop = this.getMaxTop();
      this.interval = setInterval(function () {
        var top = _this2.state.top;
        top += _this2.speed;
        _this2.speed *= 0.98; //console.log(this.speed)

        if (Math.abs(_this2.speed) < 0.7) {
          _this2.setTop(Math.round(top / _this2.itemHeight) * _this2.itemHeight, 0, !dragChange);

          clearInterval(_this2.interval);
          return;
        }

        if (top < minTop) {
          top = minTop;

          _this2.setTop(top, 0, !dragChange);

          clearInterval(_this2.interval);
          return;
        }

        if (top > maxTop) {
          top = maxTop;

          _this2.setTop(top, 0, !dragChange);

          clearInterval(_this2.interval);
          return;
        }

        _this2.setTop(top, 0, dragChange);
      }, 20);
    }
  }, {
    key: "mouseUp",
    value: function mouseUp() {
      this.eventHandler('window', 'mousemove', this.mouseMove, 'unbind');
      this.eventHandler('window', 'mouseup', this.mouseUp, 'unbind');
      var _this$props3 = this.props,
          accel = _this$props3.accel,
          dragChange = _this$props3.dragChange;

      if (accel) {
        this.accel();
      } else {
        var top = this.state.top;
        this.setTop(Math.round(top / this.itemHeight) * this.itemHeight, 0, !dragChange);
      }
    }
  }, {
    key: "getMinTop",
    value: function getMinTop() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var length = this.props.length;
      return (length - 1 - this.offset + offset) * -this.itemHeight;
    }
  }, {
    key: "getMaxTop",
    value: function getMaxTop() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return (this.offset + offset) * this.itemHeight;
    }
  }, {
    key: "getTop",
    value: function getTop(top) {
      var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var minTop = this.getMinTop(delta),
          maxTop = this.getMaxTop(delta);

      if (top < minTop) {
        top = minTop;
      } else if (top > maxTop) {
        top = maxTop;
      }

      return top;
    }
  }, {
    key: "setTop",
    value: function setTop(top, delta, callOnchange) {
      var _this$props4 = this.props,
          onchange = _this$props4.onchange,
          dragChange = _this$props4.dragChange,
          set = _this$props4.set;
      var prevValue = this.state.prevValue;
      top = this.getTop(top, delta);
      var value = this.getValueByTop(top);

      if (prevValue !== value && callOnchange) {
        prevValue = value;
        onchange(set(value));
      }

      this.setState({
        top: top,
        prevValue: prevValue
      });
    }
  }, {
    key: "moveBy",
    value: function moveBy(delta, type) {
      var top = this.state.top;
      top -= Math.round(delta) * this.itemHeight;
      this.setTop(top, 0, type);
    }
  }, {
    key: "moveTo",
    value: function moveTo(value, type) {
      this.setTop(this.getTopByValue(value), 0, type);
    }
  }, {
    key: "getTopByValue",
    value: function getTopByValue(value) {
      return (this.offset - value) * this.itemHeight;
    }
  }, {
    key: "getValueByTop",
    value: function getValueByTop(top) {
      top = this.getTop(top);
      return Math.round((this.itemHeight * this.offset - top) / this.itemHeight);
    }
  }, {
    key: "getItems",
    value: function getItems() {
      var _this$props5 = this.props,
          length = _this$props5.length,
          get = _this$props5.get,
          align = _this$props5.align;
      var alignMap = {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center'
      };
      var items = [];

      for (var i = 0; i <= length - 1; i++) {
        var value = get(i);
        value = value === undefined ? i : value;
        items.push( /*#__PURE__*/_react.default.createElement("div", {
          key: i,
          className: "drag-input-item",
          style: {
            height: this.itemHeight,
            justifyContent: alignMap[align]
          }
        }, value));
      }

      this.items = items;
      this.setState({
        length: length,
        get: get.toString()
      });
    }
  }, {
    key: "keyDown",
    value: function keyDown(e) {
      var _this$props6 = this.props,
          length = _this$props6.length,
          dragChange = _this$props6.dragChange;
      var code = e.keyCode;

      if (code === 38) {
        //up
        this.moveBy(-1, dragChange);
        this.arrow = true;
      } else if (code === 40) {
        //down
        this.moveBy(1, dragChange);
        this.arrow = true;
      } else if (code === 36) {
        //home
        this.moveTo(0, true);
      } else if (code === 35) {
        //end
        this.moveTo(length - 1, true);
      }
    }
  }, {
    key: "keyUp",
    value: function keyUp() {
      if (this.arrow) {
        var top = this.state.top;
        var dragChange = this.props.dragChange;
        this.setTop(Math.round(top / this.itemHeight) * this.itemHeight, 0, !dragChange);
        this.arrow = false;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var top = this.state.top;
      var _this$props7 = this.props,
          height = _this$props7.height,
          width = _this$props7.width;

      var props = _defineProperty({
        className: 'drag-input',
        style: {
          height: height,
          width: width
        },
        tabIndex: 0,
        onWheel: function onWheel(e) {
          return _this3.moveBy(e.deltaY / 100, true);
        },
        onKeyDown: this.keyDown.bind(this),
        onKeyUp: this.keyUp.bind(this)
      }, this.touch ? 'onTouchStart' : 'onMouseDown', this.mouseDown.bind(this));

      var listProps = {
        className: 'drag-input-list',
        style: {
          top: top + 'px'
        }
      };
      return /*#__PURE__*/_react.default.createElement("div", props, /*#__PURE__*/_react.default.createElement("div", listProps, this.items));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.length !== state.length || props.get.toString() !== state.get) {
        state.getItems();
      }

      return null;
    }
  }]);

  return RList;
}(_react.Component);

exports.default = RList;
RList.defaultProps = {
  length: 10,
  height: 60,
  size: 3,
  width: 48,
  value: 0,
  get: function get(v) {
    return v;
  },
  set: function set(v) {
    return v;
  },
  dragChange: true,
  accel: true,
  align: 'start'
};