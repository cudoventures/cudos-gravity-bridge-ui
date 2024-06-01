import * as React from "react";
import { Input as BaseInput, InputProps } from "@mui/base/Input";
import { styled } from "@mui/system";

const Input = React.forwardRef(function CustomInput(
  props: InputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return <BaseInput slots={{ input: InputElement }} {...props} ref={ref} />;
});

const InputElement = styled("input")(
  () => `
  width: 241px;
  font-family: 'Sailec', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: #fff;
  background: rgb(45, 53, 78);
  border: none;
  box-shadow: none;

  &:hover {
    border-color: rgba(78, 148, 238, 1);
  }

  &:focus {
    border-color: rgba(78, 148, 238, 1);
    box-shadow: none;
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

export default Input;
