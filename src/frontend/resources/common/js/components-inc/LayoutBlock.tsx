import React from "react";

import S from "../utilities/Main";

import "../../css/components-inc/layout-block.css";

interface Props {
  className?: string;
  direction?: LayoutBlock.DIRECTION_COLUMN | LayoutBlock.DIRECTION_ROW;
}

export default class LayoutBlock extends React.Component<Props> {
  static DIRECTION_COLUMN: number = 1;
  static DIRECTION_ROW: number = 2;

  cssClassNameDirection() {
    switch (this.props.direction) {
      case LayoutBlock.DIRECTION_COLUMN:
        return "DirectionColumn";
      default:
      case LayoutBlock.DIRECTION_ROW:
        return "DirectionRow";
    }
  }

  render() {
    return (
      <div
        className={`LayoutBlock ${this.cssClassNameDirection()} ${this.props.className}`}
      >
        {this.props.children}
      </div>
    );
  }
}

LayoutBlock.DIRECTION_COLUMN = 1;
LayoutBlock.DIRECTION_ROW = 2;

LayoutBlock.defaultProps = {
  className: S.Strings.EMPTY,
  direction: LayoutBlock.DIRECTION_COLUMN,
};
