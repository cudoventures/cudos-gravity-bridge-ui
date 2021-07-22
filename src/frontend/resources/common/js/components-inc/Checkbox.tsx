import React from 'react';
import S from '../utilities/Main';

import SvgCheckbox from '@material-ui/icons/Check';
import '../../css/components-inc/checkbox.css';

interface Props {
    className?: string;
    label: string;
    value: S.INT_TRUE | S.INT_FALSE;
    readOnly: boolean;
    onChange: (value: number) => void;
}

export default class Checkbox extends React.Component < Props > {

    static defaultProps: Props;

    onChange = () => {
        if (this.props.readOnly === false) {
            this.props.onChange(this.props.value ^ 1);
        }
    }

    render() {
        return (
            <div
                className = { `CheckboxComponent FlexRow Clickable ${S.CSS.getActiveClassName(this.props.value === S.INT_TRUE)} ${this.props.className}` }
                onClick = { this.onChange } >

                <div className = { 'SVG Size Transition Checkbox FlexSingleCenter' } ><SvgCheckbox /></div>
                { this.props.label }

            </div>
        );
    }

}

Checkbox.defaultProps = {
    'className': S.Strings.EMPTY,
    'readOnly': false,
}
