import React, { ChangeEvent } from "react";
import PropTypes from "prop-types";

import { FormControl } from "@material-ui/core";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

import "../../css/components-inc/input.css";
import S from "../utilities/Main";

export const InputType = {
  INTEGER: 1,
  REAL: 2,
  TEXT: 3,
  PHONE: 4,
};

export const InputMargin = {
  NORMAL: 1,
  DENSE: 2,
};

interface Props extends TextFieldProps {
  className?: string;
  inputType?:
    | InputType.REAL
    | InputType.TEXT
    | InputType.PHONE
    | InputType.INTEGER;
  decimalLength?: number;
  margin?: InputMargin.NORMAL | InputMargin.DENSE;
  readOnly?: boolean;
  onChange?:
    | null
    | ((
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => boolean | void);
  onFocus?: () => void | boolean;
  onBlur?: () => void | boolean;
}

interface State {
  focused: boolean;
}

export default class Input extends React.Component<Props, State> {
  nodes: any;
  sState: State;

  constructor(props: Props) {
    super(props);

    this.nodes = {
      input: React.createRef(),
    };

    this.sState = {
      focused: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  getInputNode() {
    return this.nodes.input.current;
  }

  /* listeners */
  onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    switch (this.props.inputType) {
      case InputType.INTEGER:
        if (filterInteger(event.target.value) === false) {
          return;
        }
        break;
      case InputType.REAL:
        if (
          filterReal(event.target.value, this.props.decimalLength) === false
        ) {
          return;
        }
        break;
      case InputType.PHONE:
        if (filterPhone(event.target.value) === false) {
          return;
        }
        break;
      default:
        break;
    }

    if (this.props.onChange !== null) {
      this.props.onChange(event.target.value);
    }
  };

  getMargin() {
    switch (this.props.margin) {
      default:
      case InputMargin.NORMAL:
        return "normal";
      case InputMargin.DENSE:
        return "dense";
    }
  }

  onFocus() {
    this.sState.focused = true;
    if (this.props.onFocus === undefined || this.props.onFocus() !== true) {
      this.setState(this.sState);
    }
  }

  onBlur() {
    this.sState.focused = false;
    if (this.props.onBlur === undefined || this.props.onBlur() !== true) {
      this.setState(this.sState);
    }
  }

  value() {
    return this.nodes.input.current.value;
  }

  /* render */
  render() {
    const margin = this.getMargin();
    const { inputType, decimalLength, ...props } = this.props;
    return (
      <div className={`Input ${this.props.className}`}>
        <FormControl variant='outlined' margin={margin}>
          <TextField
            {...props}
            onChange={
              this.props.onChange !== null && this.props.readOnly !== true
                ? this.onChange
                : undefined
            }
            margin={margin}
            variant='standard'
          />
        </FormControl>
      </div>
    );
  }
}

Input.defaultProps = {
  className: S.Strings.EMPTY,
  inputType: InputType.TEXT,
  decimalLength: Number.MAX_SAFE_INTEGER,
  margin: InputMargin.DENSE,
  readOnly: false,
  onChange: null,
};

function filterInteger(value: string) {
  if (value.length === 0) {
    return true;
  }

  for (let c, i = value.length; i-- > 0; ) {
    c = value[i];
    if (c === "+" || c === "-") {
      return i === 0;
    }
    if (c >= "0" && c <= "9") {
      continue;
    }

    return false;
  }

  return true;
}

function filterReal(value: string, decimalLength: number) {
  if (value.length === 0) {
    return true;
  }

  let delimiter = false;
  let currentDecimalLength = 0;
  for (let c, i = 0; i < value.length; ++i) {
    c = value[i];
    if (c === "+" || c === "-") {
      if (i === 0) {
        continue;
      }
    }
    if (c >= "0" && c <= "9") {
      if (delimiter === true) {
        ++currentDecimalLength;
        if (decimalLength < currentDecimalLength) {
          return false;
        }
      }
      continue;
    }
    if (c === ".") {
      if (delimiter === true) {
        return false;
      }
      delimiter = true;
      continue;
    }

    return false;
  }

  return true;
}

function filterPhone(value: string) {
  if (value.length === 0) {
    return true;
  }

  let plus = false;
  for (let c, i = value.length; i-- > 0; ) {
    c = value[i];
    if (c === "+") {
      if (plus === true || i !== 0) {
        return false;
      }
      plus = true;
      continue;
    }
    if (c >= "0" && c <= "9") {
      continue;
    }
    if (c === " ") {
      continue;
    }

    return false;
  }

  return true;
}
