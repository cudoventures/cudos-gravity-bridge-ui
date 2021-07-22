import React from 'react';

import S from '../utilities/Main';

import '../../css/components-inc/scrollable.css';

interface Props {
    className?: string;
    classNameContent?: string;
}

export default class Scrollable extends React.Component < Props > {

    static defaultProps: any;

    render() {
        return (
            <div className = { `${this.props.className} Scrollable` } >
                <div className = { 'ScrollableWrapper' } >
                    <div className = { `ScrollableContent Scrolls ${this.props.classNameContent}` } >
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

}

Scrollable.defaultProps = {
    className: S.Strings.EMPTY,
    classNameContent: S.Strings.EMPTY,
};
