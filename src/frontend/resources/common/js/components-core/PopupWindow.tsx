// version 3.0.0
import React, { MouseEvent } from "react";

import S from "../utilities/Main";

import PopupStore from "../stores/PopupStore";
//@ts-ignore
import SvgClose from "../../svg/close-btn.svg";
import "../../css/components-core/popup-window.css";

let popupCounter = 0;

export interface PopupWindowProps {
  popupStore: PopupStore;
}

export default class PopupWindowComponent<
  Pr extends PopupWindowProps = PopupWindowProps,
> extends React.Component<Pr> {
  visibleFlag: boolean = false;
  nodes: {
    popupWindow: React.RefObject<HTMLDivElement>;
  };

  constructor(props: Pr) {
    super(props);

    this.nodes = {
      popupWindow: React.createRef(),
    };
  }

  componentDidUpdate() {
    if (this.visibleFlag === this.props.popupStore.visible) {
      return;
    }

    this.visibleFlag = this.props.popupStore.visible;
    if (this.visibleFlag === true) {
      if (++popupCounter === 1) {
        S.CSS.addClass(document.documentElement, "OverflowHiddenPopup");
      }
    } else if (--popupCounter === 0) {
      S.CSS.removeClass(document.documentElement, "OverflowHiddenPopup");
    }
  }

  getCssClassName() {
    return S.Strings.EMPTY;
  }

  hasClose() {
    return true;
  }

  isRemovable() {
    return true;
  }

  onWheel = (e: React.WheelEvent<HTMLElement>) => {
    e.preventDefault();
    this.nodes.popupWindow.current.scrollTop += e.deltaY * 10;
  };

  onClickClose = (e: MouseEvent) => {
    e.stopPropagation();
    this.props.popupStore.hide();
  };

  render() {
    const { popupStore } = this.props;

    return (
      <div
        className={`PopupWindowWrapper ${this.getCssClassName()} Transition ActiveVisibilityHidden ${S.CSS.getActiveClassName(
          popupStore.visible
        )}`}
        onClick={this.isRemovable() === true ? popupStore.hide : undefined}
        onWheel={this.onWheel}
      >
        {this.hasClose() === true && (
          <div
            className={"Close SVG Clickable"}
            onClick={this.onClickClose}
            dangerouslySetInnerHTML={{ __html: SvgClose }}
          />
        )}

        <div
          ref={this.nodes.popupWindow}
          className={"PopupWindow Scrolls"}
          onClick={S.stopPropagation}
          onWheel={S.stopPropagation}
        >
          {popupStore.visible === true && this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent(): React.ReactNode | null {
    return null;
  }
}
