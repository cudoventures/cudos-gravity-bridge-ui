// version 3.1.0
import React, { MouseEvent } from 'react';

import S from '../utilities/Main';

import PopupStore from '../stores/PopupStore';

import SvgClose from '../../../../resources/common/img/favicon/close-icon-24x24.svg';
import '../../css/components-core/popup-window.css';

const outerClose = false;
let popupCounter = 0;

export interface PopupWindowProps {
    popupStore?: PopupStore;
}

export default class PopupWindowComponent < Pr extends PopupWindowProps = PopupWindowProps, St = {} > extends React.Component < Pr, St > {

    visibleFlag: boolean = false;

    onWheelTime: number = S.NOT_EXISTS;
    onWheelTargetY: number = S.NOT_EXISTS;

    popupNodes: {
        scrollableCnt: React.RefObject < HTMLDivElement >,
    };

    constructor(props: Pr) {
        super(props);
        this.popupNodes = {
            'scrollableCnt': React.createRef(),
        };
    }

    componentDidUpdate() {
        if (this.visibleFlag === this.props.popupStore.visible) {
            return;
        }

        this.visibleFlag = this.props.popupStore.visible;
        if (this.visibleFlag === true) {
            if (++popupCounter === 1) {
                S.CSS.addClass(document.documentElement, 'OverflowHiddenPopup');
            }
        } else if (--popupCounter === 0) {
            S.CSS.removeClass(document.documentElement, 'OverflowHiddenPopup');
        }
    }

    getCssClassName() {
        return S.Strings.EMPTY;
    }

    hasClose() {
        return true;
    }

    isRemovable() {
        return false;
    }

    onWheel = (e: React.WheelEvent < HTMLElement >) => {
        e.preventDefault();

        // 100 ms interval is just a randaom value, after which we should apply normal scrolling
        const now = Date.now();
        let scrollTop = this.onWheelTime + 100 >= now ? this.onWheelTargetY : this.popupNodes.scrollableCnt.current.scrollTop;
        scrollTop += e.deltaY;
        this.popupNodes.scrollableCnt.current.scrollTop = scrollTop;
        this.onWheelTargetY = scrollTop;
        this.onWheelTime = now;
    }

    onClickClose = (e: MouseEvent) => {
        e.stopPropagation();
        this.props.popupStore.hide();
    }

    render() {
        const { popupStore } = this.props;

        const content = popupStore.visible === false ? null : this.renderContent();
        const close = this.hasClose() === false ? null : (
            <div
                className = { 'Close SVG Clickable' }
                onClick = { this.onClickClose }
                dangerouslySetInnerHTML = {{ __html: SvgClose }} />
        )

        return (
            <div
                className = { `PopupWindowWrapper ${this.getCssClassName()} Transition ActiveVisibilityHidden ${S.CSS.getActiveClassName(popupStore.visible)}`}
                onClick = { this.isRemovable() === true ? popupStore.hide : undefined }
                onWheel = { this.onWheel } >

                { outerClose === true && this.hasClose() === true && close }

                <div ref = { outerClose === true ? this.popupNodes.scrollableCnt : undefined } className = { 'PopupWindow Scrolls' } onClick = { S.stopPropagation } onWheel = { S.stopPropagation } >

                    { outerClose === true && content }
                    { outerClose === false && (
                        <>
                            { close }
                            <div ref = { outerClose === false ? this.popupNodes.scrollableCnt : undefined } className = { 'ScrollableWrapper Scrolls' } >

                                { content }

                            </div>
                        </>
                    ) }

                </div>

            </div>
        );
    }

    renderContent(): React.ReactNode | null {
        return null;
    }

}
