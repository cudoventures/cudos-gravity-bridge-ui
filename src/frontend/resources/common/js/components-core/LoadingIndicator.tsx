import React from "react";
import S from "../utilities/Main";

import Loading from "../../svg/loading";
import "./../../css/components-core/loading-indicator.css";

interface Props {
  className?: string;
  margin: string;
  size?: string;
}

export default class LoadingIndicator extends React.Component<Props> {
  static defaultProps: { className: string; size: any };
  render() {
    const style = {
      marginTop: this.props.margin,
      marginBottom: this.props.margin,
    };
    const svgStyle: { width?: string | number; height?: string | number } = {};

    if (this.props.size !== null) {
      svgStyle.width = this.props.size;
      svgStyle.height = this.props.size;
    }

    return (
      <div
        className={`LoadingIndicator FlexSingleCenter ${this.props.className}`}
        style={style}
      >
        <Loading className={"SVG Size"} style={svgStyle} />
      </div>
    );
  }
}

LoadingIndicator.defaultProps = {
  className: S.Strings.EMPTY,
  size: null,
};
