import * as React from 'react';
import * as moment from 'moment';
import { polyfill } from 'react-lifecycles-compat';
import MonthCalendar from 'rc-calendar/lib/MonthCalendar';
import RcDatePicker from 'rc-calendar/lib/Picker';
import classNames from 'classnames';
import omit from 'omit.js';
import Icon from '../icon';
import warning from '../_util/warning';
import interopDefault from '../_util/interopDefault';
import getDataOrAriaProps from '../_util/getDataOrAriaProps';

export interface PickerProps {
  value?: moment.Moment | moment.Moment[];
  prefixCls: string;
}

export default function createPicker(TheCalendar: React.ComponentClass): any {
  class CalenderWrapper extends React.Component<any, any> {
    static defaultProps = {
      prefixCls: 'ant-calendar',
      allowClear: true,
      showToday: true,
    };

    static getDerivedStateFromProps(nextProps: PickerProps, prevState: any) {
      let state = null;
      if ('value' in nextProps) {
        state = {
          value: nextProps.value,
        };
        if (nextProps.value !== prevState.value) {
          state = {
            ...state,
            showDate: nextProps.value,
          };
        }
      }
      return state;
    }

    private input: any;

    constructor(props: any) {
      super(props);
      const value = props.value || props.defaultValue;
      if (value) {
        if (props.multiple) {
          if (value.length) {
            value.forEach((singleValue: moment.Moment) => this.checkValue(singleValue));
          }
        } else {
          this.checkValue(value);
        }
      }
      this.state = {
        value,
        showDate: value,
      };
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
      this.focus();
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
      const { prefixCls, locale, localeCode, suffixIcon, multiple, selectWeekDays, selectMonths } = props;

      const placeholder = ('placeholder' in props)
        ? props.placeholder : locale.lang.placeholder;

      const disabledTime = props.showTime ? props.disabledTime : null;

      const calendarClassName = classNames({
        [`${prefixCls}-time`]: props.showTime,
        [`${prefixCls}-month`]: MonthCalendar === TheCalendar,
      });

      if (value && localeCode) {
        if (multiple) {
          if (value.length) {
            value.forEach((singleValue: moment.Moment) => singleValue.locale(singleValue));
          }
        } else {
          value.locale(localeCode);
        }
      }

      let pickerProps: Object = {};
      let calendarProps: any = {};
      const pickerStyle: { width?: number } = {};
      if (props.showTime) {
        calendarProps = {
          // fix https://github.com/ant-design/ant-design/issues/1902
          onSelect: this.handleChange,
        };
        pickerStyle.width = 195;
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
          selectWeekDays={selectWeekDays}
          selectMonths={selectMonths}
          value={showDate}
        />
      );

      const clearIcon = (!props.disabled && props.allowClear && value) ? (
        props.clearIcon ? (
          <span onClick={this.clearSelection}>
            {props.clearIcon}
          </span>
        ) : (
          <Icon
            type="close-circle"
            className={`${prefixCls}-picker-clear`}
            onClick={this.clearSelection}
            theme="filled"
          />
        )
      ) : null;

      const inputIcon = suffixIcon && (
        React.isValidElement<{ className?: string }>(suffixIcon)
          ? React.cloneElement(
            suffixIcon,
            {
              className: classNames({
                [suffixIcon.props.className!]: suffixIcon.props.className,
                [`${prefixCls}-picker-icon`]: true,
              }),
            },
          ) : <span className={`${prefixCls}-picker-icon`}>{suffixIcon}</span>) || (
          <Icon type="calendar" className={`${prefixCls}-picker-icon`} />
        );

      const dataOrAriaProps = getDataOrAriaProps(props);

      const input = ({ value: inputValue }: { value: moment.Moment | moment.Moment[] | null }) => {
        let formattedInputValue = '';

        if (inputValue) {
          if (props.formatInput) {
            formattedInputValue = props.formatInput(inputValue);
          } else {
            if (multiple) {
              formattedInputValue = inputValue.map((singleValue: moment.Moment) => singleValue.format(props.format)).join(', ');
            } else {
              formattedInputValue = inputValue.format(props.format);
            }
          }
        }

        return (
          <div>
            <input
              ref={this.saveInput}
              disabled={props.disabled}
              readOnly
              value={formattedInputValue}
              placeholder={placeholder}
              className={props.pickerInputClass}
              {...dataOrAriaProps}
            />
            {clearIcon}
            {props.pickerIcon || inputIcon}
          </div>
        )
      };

      return (
        <span
          id={props.id}
          className={classNames(props.className, props.pickerClass)}
          style={{ ...pickerStyle, ...props.style }}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
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
  }
  polyfill(CalenderWrapper);
  return CalenderWrapper;
}
