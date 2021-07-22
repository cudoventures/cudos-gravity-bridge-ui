import '../../css/components-inc/select.css';

import React from 'react';

import MuiSelect, { SelectProps } from '@material-ui/core/Select';
import { InputLabel, FormControl } from '@material-ui/core';
import SvgArrowDown from '@material-ui/icons/ArrowDownward'
import S from '../utilities/Main';

export const SelectMargin = {
    NORMAL: 1,
    DENSE: 2,
}

interface Props extends SelectProps {
    className?: string;
    margin?: SelectMargin.NORMAL | SelectMargin.DENSE;
    onChange?: (value: any) => (boolean | void);
}

interface State {
    open: boolean
}

export default class Select extends React.Component < Props, State > {

    static defaultProps: Props;

    open: boolean;

    constructor(props: Props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    componentDidMount() {
        document.addEventListener('wheel', this.onPreventableScroll, { passive: false });
        document.addEventListener('touchmove', this.onPreventableScroll, { passive: false });
        document.addEventListener('scroll', this.onUnpreventableScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('wheel', this.onPreventableScroll);
        document.removeEventListener('touchmove', this.onPreventableScroll);
        document.removeEventListener('scroll', this.onUnpreventableScroll);
    }

    onChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        if (this.props.onChange !== undefined) {
            this.props.onChange(e.target.value);
        }
    }

    onPreventableScroll = (e) => {
        if (this.state.open === true) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onUnpreventableScroll = () => {
        if (this.state.open === true) {
            this.onClose();
        }
    }

    getMargin() {
        switch (this.props.margin) {
            default:
            case SelectMargin.NORMAL:
                return 'normal';
            case SelectMargin.DENSE:
                return 'dense';
        }
    }

    onOpen = () => {
        this.setState({
            open: true,
        })
    }

    onClose = () => {
        this.setState({
            open: false,
        })
        setTimeout(() => {
            document.activeElement.blur();
        }, 0);
    }

    render() {
        const margin = this.getMargin();
        return (
            <div className = { `Select ${this.props.className}` }>
                <FormControl variant = 'outlined' margin = { margin }>

                    <InputLabel
                        error = { this.props.error }
                        variant = { 'outlined' }
                        margin = { margin } >
                        { this.props.label }
                    </InputLabel>
                    <MuiSelect
                        { ...this.props }
                        onChange = { this.props.onChange !== null && this.props.readOnly !== true ? this.onChange : undefined }
                        onOpen = { this.onOpen }
                        onClose = { this.onClose }
                        open = { this.state.open }
                        IconComponent = { SvgArrowDown }
                        margin = { margin }
                        MenuProps = {{
                            disableScrollLock: true,
                        }}
                        variant = { 'outlined' } />

                </FormControl>
            </div>
        )
    }

}

Select.defaultProps = {
    'className': S.Strings.EMPTY,
    'margin': SelectMargin.DENSE,
};
