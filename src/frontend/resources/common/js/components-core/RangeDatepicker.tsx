import React from "react";
import moment from "moment";
import { ReactDatePickerProps } from "react-datepicker";

import S from "../utilities/Main";

import Datepicker from "./Datepicker";
import LayoutBlock from "../components-inc/LayoutBlock";

import SvgClose from "@material-ui/icons/Clear";
import "../../css/components-core/range-datepicker.css";

interface Props extends ReactDatePickerProps {
  datepickerState: RangeDatepickerState;
  dateRangeFormat?: string;
  emptyDateString?: string;
  onChange: any;
}

interface State {
  datepickerOpen: boolean;
}

export default class RangeDatepicker extends React.Component<Props, State> {
  static defaultProps: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      datepickerOpen: this.props.datepickerState.open,
    };
  }

  onChangeOpen = () => {
    this.setState({ datepickerOpen: !this.state.datepickerOpen });
  };

  onChange = dates => {
    const [start, end] = dates;
    const open = end === null;

    const startTime = this.isDateValid(start) ? start.getTime() : S.NOT_EXISTS;
    const endTime = this.isDateValid(end) ? end.getTime() : S.NOT_EXISTS;

    this.props.onChange(startTime, endTime);

    this.setState({
      datepickerOpen: open,
    });
  };

  isDateValid = date => {
    return date !== null && date !== S.NOT_EXISTS;
  };

  onClickClearDates = e => {
    this.props.datepickerState.startDate = S.NOT_EXISTS;
    this.props.datepickerState.endDate = S.NOT_EXISTS;
    this.setState({});
    e.stopPropagation();
  };

  render() {
    return (
      <LayoutBlock>
        <Datepicker
          {...this.props}
          selectsRange={true}
          popperClassName={"RangeDatepickerPopper"}
          wrapperClassName={"RangeDatepickerWrapper"}
          onInputClick={this.onChangeOpen}
          onClickOutside={this.onChangeOpen}
          open={this.state.datepickerOpen}
          startDate={
            this.isDateValid(this.props.datepickerState.startDate)
              ? new Date(this.props.datepickerState.startDate)
              : null
          }
          endDate={
            this.isDateValid(this.props.datepickerState.endDate)
              ? new Date(this.props.datepickerState.endDate)
              : null
          }
          onChange={this.onChange}
          customInput={
            <div className={"DatePickerInput FlexRow FlexSplit"}>
              <div className={"DatePickerSmallLetters"}>от</div>
              <div className={"DatePickerInputText"}>
                {" "}
                {this.formatDate(this.props.datepickerState.startDate)}{" "}
              </div>
              <div className={"DatePickerSmallLetters"}>до</div>
              <div className={"DatePickerInputText"}>
                {" "}
                {this.formatDate(this.props.datepickerState.endDate)}{" "}
              </div>
              {this.isDateValid(this.props.datepickerState.startDate) ? (
                <div
                  onClick={this.onClickClearDates}
                  className={"DateClearButton StartRight SVG Clickable"}
                >
                  <SvgClose />
                </div>
              ) : (
                ""
              )}
            </div>
          }
        />
      </LayoutBlock>
    );
  }

  formatDate(date) {
    if (this.isDateValid(date) === true) {
      return moment(new Date(date)).format(this.props.dateRangeFormat);
    }

    if (this.props.emptyDateString !== S.Strings.EMPTY) {
      return this.props.emptyDateString;
    }

    return <div dangerouslySetInnerHTML={{ __html: "&nbsp;" }} />;
  }
}

RangeDatepicker.defaultProps = {
  emptyDateString: S.Strings.EMPTY,
  dateRangeFormat: "DD.MM.YYYY",
};

export class RangeDatepickerState {
  startDate: number;
  endDate: number;
  open: boolean;

  constructor(
    startDate: number = S.NOT_EXISTS,
    endDate: number = S.NOT_EXISTS,
    open: boolean = false
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.open = open;
  }
}
