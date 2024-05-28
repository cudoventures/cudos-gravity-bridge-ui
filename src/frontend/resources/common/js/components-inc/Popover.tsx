import React from "react";

import S from "../utilities/Main";
import MuiPopover, { PopoverProps } from "@material-ui/core/Popover";

import "../../css/components-inc/popover.css";

export default class Popover extends React.Component<PopoverProps> {
  static defaultProps: PopoverProps;
  nodes: any;

  constructor(props: PopoverProps) {
    super(props);

    this.nodes = {
      ref: React.createRef(),
    };
  }

  componentDidMount() {
    document.addEventListener("wheel", this.onPreventableScroll, {
      passive: false,
    });
    document.addEventListener("touchmove", this.onPreventableScroll, {
      passive: false,
    });
    document.addEventListener("scroll", this.onUnpreventableScroll);
  }

  componentWillUnmount() {
    document.removeEventListener("wheel", this.onPreventableScroll);
    document.removeEventListener("touchmove", this.onPreventableScroll);
    document.removeEventListener("scroll", this.onUnpreventableScroll);
  }

  onPreventableScroll = e => {
    if (this.props.open === true) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  onUnpreventableScroll = e => {
    if (this.props.open === true) {
      this.props.onClose(e, "backdropClick");
    }
  };

  onEntered = () => {
    this.nodes.ref.current
      .querySelector(".MuiPopover-paper")
      .addEventListener("wheel", S.stopPropagation);
  };

  onExit = () => {
    this.nodes.ref.current
      .querySelector(".MuiPopover-paper")
      .removeEventListener("wheel", S.stopPropagation);
  };

  render() {
    return (
      <MuiPopover
        {...this.props}
        ref={this.nodes.ref}
        disableScrollLock={true}
        className={"Popover"}
        onEntered={this.onEntered}
        onExit={this.onExit}
      >
        {this.props.children}
      </MuiPopover>
    );
  }
}

Popover.defaultProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
};
