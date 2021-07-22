import React from 'react';

import S from '../utilities/Main';

import './../../css/components-inc/actions.css';

interface Props {
    className?: string;
    height?: number;
    layout?: number;
}

export default class Actions extends React.Component < Props > {

    static LAYOUT_ROW_LEFT: number = 1;
    static LAYOUT_ROW_CENTER: number = 2;
    static LAYOUT_ROW_RIGHT: number = 3;
    static LAYOUT_COLUMN_FULL: number = 4;
    static LAYOUT_COLUMN_CENTER: number = 5;
    static LAYOUT_COLUMN_LEFT: number = 6;
    static LAYOUT_COLUMN_RIGHT: number = 7;

    static HEIGHT_32: number = 1;
    static HEIGHT_36: number = 2;
    static HEIGHT_42: number = 3;
    static HEIGHT_48: number = 4;
    static HEIGHT_52: number = 5;

    cssClassHeight() {
        switch (this.props.height) {
            default:
            case Actions.HEIGHT_32:
                return 'H32';
            case Actions.HEIGHT_36:
                return 'H36';
            case Actions.HEIGHT_42:
                return 'H42';
            case Actions.HEIGHT_48:
                return 'H48';
            case Actions.HEIGHT_52:
                return 'H52';
        }
    }

    cssClassLayout() {
        switch (this.props.layout) {
            default:
            case Actions.LAYOUT_ROW_LEFT:
                return 'Row';
            case Actions.LAYOUT_ROW_CENTER:
                return 'Row Center';
            case Actions.LAYOUT_ROW_RIGHT:
                return 'Row Right';
            case Actions.LAYOUT_COLUMN_CENTER:
                return 'Column Center';
            case Actions.LAYOUT_COLUMN_FULL:
                return 'Column Full';
            case Actions.LAYOUT_COLUMN_LEFT:
                return 'Column Left';
            case Actions.LAYOUT_COLUMN_RIGHT:
                return 'Column Right';
        }
    }

    render() {
        return (
            <div className = { `Actions ${this.cssClassHeight()} ${this.cssClassLayout()} ${this.props.className}` } >
                { this.props.children }
            </div>
        );
    }

}

Actions.defaultProps = {
    'className': S.Strings.EMPTY,
    'layout': Actions.LAYOUT_ROW_CENTER,
    'height': Actions.HEIGHT_32,
};
