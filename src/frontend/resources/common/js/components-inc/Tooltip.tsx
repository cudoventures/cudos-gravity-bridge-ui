import React from "react";

import MuiTooltip, { TooltipProps } from "@material-ui/core/Tooltip";

import "../../css/components-inc/tooltip.css";

export default class Tooltip extends React.Component<TooltipProps> {
  render() {
    return (
      <MuiTooltip
        {...this.props}
        classes={{
          popper: "TooltipPopper",
          tooltip: "TooltipItself",
          arrow: "TooltipArrow",
        }}
        enterTouchDelay={1}
        leaveTouchDelay={10 * 60 * 1000}
      />
    );
  }
}

Tooltip.defaultProps = MuiTooltip.defaultProps;
