import * as React from 'react';
import * as moment from 'moment';
import MonthCalendar from 'rc-calendar/lib/MonthCalendar';
import RcDatePicker from 'rc-calendar/lib/Picker';
import classNames from 'classnames';
import omit from 'omit.js';
import Icon from '../icon';
import warning from '../_util/warning';
import interopDefault from '../_util/interopDefault';

export interface PickerProps {
  value?: moment.Moment | moment.Moment[];
  prefixCls: string;
}

export default function createPicker(TheCalendar: React.ComponentClass): any {
  return class CalenderWrapper extends React.Component<any, any> {
    static defaultProps = {
      prefixCls: 'ant-calendar',
      allowClear: true,
      showToday: true,
    };

    private input: any;

    constructor(props: any) {
      super(props);
      const value = props.value || props.defaultValue;
      if (props.multiple && value && value.length) {
        value.forEach((singleValue: moment.Moment) => this.checkValue(singleValue));
      } else {
        this.checkValue(value);
      }
      this.state = {
        value,
        showDate: value,
      };
    }

    componentWillReceiveProps(nextProps: PickerProps) {
      if ('value' in nextProps) {
        this.setState({
          value: nextProps.value,
          showDate: nextProps.value,
        });
      }
    }

    checkValue = (value: moment.Moment) => {
      if (value && !interopDefault(moment).isMoment(value)) {
        throw new Error(
          'The value/defaultValue of DatePicker or MonthPicker must be ' +
          'a moment object or an array of moment objects after `antd@2.0`, see: https://u.ant.design/date-picker-value',
        );
      }
    }

    renderFooter = (...args: any[]) => {
      const { prefixCls, renderExtraFooter } = this.props;
      return renderExtraFooter ? (
        <div className={`${prefixCls}-footer-extra`}>
          {renderExtraFooter(...args)}
        </div>
      ) : null;
    }

    clearSelection = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleChange(null);
    }

    handleChange = (value: any) => {
      const props = this.props;
      if (!('value' in props)) {
        this.setState({
          value,
          showDate: value,
        });
      }
      if (props.multiple) {
        let formattedValue;
        if (value && value.length) {
          formattedValue = value.map((singleValue: moment.Moment) => singleValue.format(props.format)).join(', ');
        }
        props.onChange(value, formattedValue);
      } else {
        props.onChange(value, (value && value.format(props.format)) || '');
      }
    }

    handleCalendarChange = (value: moment.Moment | moment.Moment[]) => {
      this.setState({ showDate: value });
    }

    focus() {
      this.input.focus();
    }

    blur() {
      this.input.blur();
    }

    saveInput = (node: any) => {
      this.input = node;
    }

    render() {
      const { value, showDate } = this.state;
      const props = omit(this.props, ['onChange']);
      const { prefixCls, locale, localeCode, multiple, selectWeeks, selectMonths } = props;

      const placeholder = ('placeholder' in props)
        ? props.placeholder : locale.lang.placeholder;

      const disabledTime = props.showTime ? props.disabledTime : null;

      const calendarClassName = classNames({
        [`${prefixCls}-time`]: props.showTime,
        [`${prefixCls}-month`]: MonthCalendar === TheCalendar,
      });

      if (value && localeCode) {
        if (multiple && value.length) {
          value.forEach((singleValue: moment.Moment) => singleValue.locale(singleValue));
        } else {
          value.locale(localeCode);
        }
      }

      let pickerProps: Object = {};
      let calendarProps: any = {};
      if (props.showTime) {
        calendarProps = {
          // fix https://github.com/ant-design/ant-design/issues/1902
          onSelect: this.handleChange,
        };
      } else {
        pickerProps = {
          onChange: this.handleChange,
        };
      }
      if ('mode' in props) {
        calendarProps.mode = props.mode;
      }

      warning(!('onOK' in props), 'It should be `DatePicker[onOk]` or `MonthPicker[onOk]`, instead of `onOK`!');
      const calendar = (
        <TheCalendar
          {...calendarProps}
          disabledDate={props.disabledDate}
          disabledTime={disabledTime}
          locale={locale.lang}
          timePicker={props.timePicker}
          defaultValue={props.defaultPickerValue || (multiple ? [interopDefault(moment)()] : interopDefault(moment)())}
          dateInputPlaceholder={placeholder}
          prefixCls={prefixCls}
          className={calendarClassName}
          onOk={props.onOk}
          dateRender={props.dateRender}
          format={props.format}
          showToday={props.showToday}
          monthCellContentRender={props.monthCellContentRender}
          renderFooter={this.renderFooter}
          onPanelChange={props.onPanelChange}
          onChange={this.handleCalendarChange}
          multiple={multiple}
          selectWeeks={selectWeeks}
          selectMonths={selectMonths}
          value={showDate}
        />
      );

      const clearIcon = (!props.disabled && props.allowClear && value) ? (
        <Icon
          type="cross-circle"
          className={`${prefixCls}-picker-clear`}
          onClick={this.clearSelection}
        />
      ) : null;

      let inputValue = '';

      if (value) {
        if (props.formatInput) {
          inputValue = props.formatInput(value);
        } else {
          if (multiple) {
            inputValue = value.map((singleValue: moment.Moment) => singleValue.format(props.format)).join(', ');
          } else {
            inputValue = value.format(props.format);
          }
        }
      }

      const input = () => (
        <div>
          <input
            ref={this.saveInput}
            disabled={props.disabled}
            readOnly
            value={inputValue}
            placeholder={placeholder}
            className={props.pickerInputClass}
          />
          {clearIcon}
          <span className={`${prefixCls}-picker-icon`} />
        </div>
      );

      return (
        <span
          id={props.id}
          className={classNames(props.className, props.pickerClass)}
          style={props.style}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        >
          <RcDatePicker
            {...props}
            {...pickerProps}
            calendar={calendar}
            value={value}
            prefixCls={`${prefixCls}-picker-container`}
            style={props.popupStyle}
          >
            {input}
          </RcDatePicker>
        </span>
      );
    }
  };
}
