import React from "react";
import S from "../utilities/Main";

import SvgLoading from "../../svg/loading.svg";
import "./../../css/components-core/loading-indicator.css";

interface Props {
  className?: string;
  margin: string;
  size?: string;
}

export default class LoadingIndicator extends React.Component<Props> {
  render() {
    const style = {
      marginTop: this.props.margin,
      marginBottom: this.props.margin,
    };
    const svgStyle = {};

    if (this.props.size !== null) {
      svgStyle.width = this.props.size;
      svgStyle.height = this.props.size;
    }

    return (
      <div
        className={`LoadingIndicator FlexSingleCenter ${this.props.className}`}
        style={style}
      >
        <div
          className={"SVG Size"}
          style={svgStyle}
          dangerouslySetInnerHTML={{ __html: SvgLoading }}
        />
      </div>
    );
  }
}

LoadingIndicator.defaultProps = {
  className: S.Strings.EMPTY,
  size: null,
};
