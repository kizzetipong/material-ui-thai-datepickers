"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Calendar = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _keycode = _interopRequireDefault(require("keycode"));

var _withStyles = _interopRequireDefault(require("@material-ui/core/styles/withStyles"));

var _reactEventListener = _interopRequireDefault(require("react-event-listener"));

var _lodash = _interopRequireDefault(require("lodash.throttle"));

var _dateUtils = require("../../_helpers/date-utils");

var _CalendarHeader = _interopRequireDefault(require("./CalendarHeader"));

var _Day = _interopRequireDefault(require("./Day"));

var _DayWrapper = _interopRequireDefault(require("./DayWrapper"));

var _propTypes2 = _interopRequireDefault(require("../../constants/prop-types"));

var _WithUtils = _interopRequireDefault(require("../../_shared/WithUtils"));

var _SlideTransition = _interopRequireDefault(require("./SlideTransition"));

/* eslint-disable no-unused-expressions */
var Calendar =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(Calendar, _Component);

  function Calendar() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.state = {
      slideDirection: 'left',
      currentMonth: _this.props.utils.getStartOfMonth(_this.props.date)
    };

    _this.onDateSelect = function (day, isFinish) {
      if (isFinish === void 0) {
        isFinish = true;
      }

      var _this$props = _this.props,
          date = _this$props.date,
          utils = _this$props.utils;

      _this.props.onChange(utils.mergeDateAndTime(day, date), isFinish);
    };

    _this.handleChangeMonth = function (newMonth, slideDirection) {
      _this.setState({
        currentMonth: newMonth,
        slideDirection: slideDirection
      });
    };

    _this.throttledHandleChangeMonth = (0, _lodash.default)(_this.handleChangeMonth, 350);

    _this.validateMinMaxDate = function (day) {
      var _this$props2 = _this.props,
          minDate = _this$props2.minDate,
          maxDate = _this$props2.maxDate,
          utils = _this$props2.utils;
      return minDate && utils.isBeforeDay(day, utils.date(minDate)) || maxDate && utils.isAfterDay(day, utils.date(maxDate));
    };

    _this.shouldDisablePrevMonth = function () {
      var _this$props3 = _this.props,
          utils = _this$props3.utils,
          disablePast = _this$props3.disablePast,
          minDate = _this$props3.minDate;
      var now = utils.date();
      return !utils.isBefore(utils.getStartOfMonth(disablePast && utils.isAfter(now, minDate) ? now : utils.date(minDate)), _this.state.currentMonth);
    };

    _this.shouldDisableNextMonth = function () {
      var _this$props4 = _this.props,
          utils = _this$props4.utils,
          disableFuture = _this$props4.disableFuture,
          maxDate = _this$props4.maxDate;
      var now = utils.date();
      return !utils.isAfter(utils.getStartOfMonth(disableFuture && utils.isBefore(now, maxDate) ? now : utils.date(maxDate)), _this.state.currentMonth);
    };

    _this.shouldDisableDate = function (day) {
      var _this$props5 = _this.props,
          disablePast = _this$props5.disablePast,
          disableFuture = _this$props5.disableFuture,
          shouldDisableDate = _this$props5.shouldDisableDate,
          utils = _this$props5.utils;
      return disableFuture && utils.isAfterDay(day, utils.date()) || disablePast && utils.isBeforeDay(day, utils.date()) || _this.validateMinMaxDate(day) || shouldDisableDate(day);
    };

    _this.moveToDay = function (day) {
      if (day && !_this.shouldDisableDate(day)) {
        _this.props.onChange(day);
      }
    };

    _this.handleKeyDown = function (event) {
      var _this$props6 = _this.props,
          theme = _this$props6.theme,
          date = _this$props6.date,
          utils = _this$props6.utils;

      switch ((0, _keycode.default)(event)) {
        case 'up':
          _this.moveToDay(utils.addDays(date, -7));

          break;

        case 'down':
          _this.moveToDay(utils.addDays(date, 7));

          break;

        case 'left':
          theme.direction === 'ltr' ? _this.moveToDay(utils.addDays(date, -1)) : _this.moveToDay(utils.addDays(date, 1));
          break;

        case 'right':
          theme.direction === 'ltr' ? _this.moveToDay(utils.addDays(date, 1)) : _this.moveToDay(utils.addDays(date, -1));
          break;

        default:
          // if keycode is not handled, stop execution
          return;
      } // if event was handled prevent other side effects (e.g. page scroll)


      event.preventDefault();
    };

    _this.renderWeeks = function () {
      var utils = _this.props.utils;
      var currentMonth = _this.state.currentMonth;
      var weeks = utils.getWeekArray(currentMonth);
      return weeks.map(function (week) {
        return _react.default.createElement("div", {
          key: "week-" + week[0].toString(),
          className: _this.props.classes.week
        }, _this.renderDays(week));
      });
    };

    _this.renderDays = function (week) {
      var _this$props7 = _this.props,
          date = _this$props7.date,
          renderDay = _this$props7.renderDay,
          utils = _this$props7.utils;
      var selectedDate = utils.startOfDay(date);
      var currentMonthNumber = utils.getMonth(_this.state.currentMonth);
      var now = utils.date();
      return week.map(function (day) {
        var disabled = _this.shouldDisableDate(day);

        var dayInCurrentMonth = utils.getMonth(day) === currentMonthNumber;

        var dayComponent = _react.default.createElement(_Day.default, {
          current: utils.isSameDay(day, now),
          hidden: !dayInCurrentMonth,
          disabled: disabled,
          selected: utils.isSameDay(selectedDate, day)
        }, utils.getDayText(day));

        if (renderDay) {
          dayComponent = renderDay(day, selectedDate, dayInCurrentMonth, dayComponent);
        }

        return _react.default.createElement(_DayWrapper.default, {
          key: day.toString(),
          value: day,
          dayInCurrentMonth: dayInCurrentMonth,
          disabled: disabled,
          onSelect: _this.onDateSelect
        }, dayComponent);
      });
    };

    return _this;
  }

  Calendar.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, state) {
    if (!nextProps.utils.isEqual(nextProps.date, state.lastDate)) {
      return {
        lastDate: nextProps.date,
        currentMonth: nextProps.utils.getStartOfMonth(nextProps.date)
      };
    }

    return null;
  };

  var _proto = Calendar.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props8 = this.props,
        date = _this$props8.date,
        minDate = _this$props8.minDate,
        maxDate = _this$props8.maxDate,
        utils = _this$props8.utils,
        disableFuture = _this$props8.disableFuture,
        disablePast = _this$props8.disablePast;

    if (this.shouldDisableDate(date)) {
      this.onDateSelect((0, _dateUtils.findClosestEnabledDate)({
        date: date,
        utils: utils,
        minDate: minDate,
        maxDate: maxDate,
        disablePast: disablePast,
        disableFuture: disableFuture,
        shouldDisableDate: this.shouldDisableDate
      }), false);
    }
  };

  _proto.render = function render() {
    var _this$state = this.state,
        currentMonth = _this$state.currentMonth,
        slideDirection = _this$state.slideDirection;
    var _this$props9 = this.props,
        classes = _this$props9.classes,
        utils = _this$props9.utils,
        allowKeyboardControl = _this$props9.allowKeyboardControl,
        yearOffset = _this$props9.yearOffset;
    return _react.default.createElement(_react.Fragment, null, allowKeyboardControl && _react.default.createElement(_reactEventListener.default, {
      target: "window",
      onKeyDown: this.handleKeyDown
    }), _react.default.createElement(_CalendarHeader.default, {
      slideDirection: slideDirection,
      currentMonth: currentMonth,
      onMonthChange: this.throttledHandleChangeMonth,
      leftArrowIcon: this.props.leftArrowIcon,
      rightArrowIcon: this.props.rightArrowIcon,
      disablePrevMonth: this.shouldDisablePrevMonth(),
      disableNextMonth: this.shouldDisableNextMonth(),
      utils: utils,
      yearOffset: yearOffset
    }), _react.default.createElement(_SlideTransition.default, {
      slideDirection: slideDirection,
      transKey: currentMonth.toString(),
      className: classes.transitionContainer
    }, _react.default.createElement("div", {
      /* eslint-disable-next-line */
      autoFocus: true // Autofocus required for getting work keyboard navigation feature

    }, this.renderWeeks())));
  };

  return Calendar;
}(_react.Component);

exports.Calendar = Calendar;
Calendar.propTypes = {
  date: _propTypes.default.object.isRequired,
  minDate: _propTypes2.default.date,
  maxDate: _propTypes2.default.date,
  classes: _propTypes.default.object.isRequired,
  onChange: _propTypes.default.func.isRequired,
  disablePast: _propTypes.default.bool,
  disableFuture: _propTypes.default.bool,
  leftArrowIcon: _propTypes.default.node,
  rightArrowIcon: _propTypes.default.node,
  renderDay: _propTypes.default.func,
  theme: _propTypes.default.object.isRequired,
  shouldDisableDate: _propTypes.default.func,
  utils: _propTypes.default.object.isRequired,
  allowKeyboardControl: _propTypes.default.bool,
  yearOffset: _propTypes.default.number
};
Calendar.defaultProps = {
  minDate: '1900-01-01',
  maxDate: '2100-01-01',
  disablePast: false,
  disableFuture: false,
  leftArrowIcon: undefined,
  rightArrowIcon: undefined,
  renderDay: undefined,
  allowKeyboardControl: false,
  shouldDisableDate: function shouldDisableDate() {
    return false;
  },
  yearOffset: 0
};

var styles = function styles(theme) {
  return {
    transitionContainer: {
      minHeight: 36 * 6,
      marginTop: theme.spacing.unit * 1.5
    },
    week: {
      display: 'flex',
      justifyContent: 'center'
    }
  };
};

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiPickersCalendar',
  withTheme: true
})((0, _WithUtils.default)()(Calendar));

exports.default = _default;