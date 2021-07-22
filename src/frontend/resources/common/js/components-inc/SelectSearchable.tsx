import React from 'react';

import { FormControl } from '@material-ui/core';
import Input from './Input';
import Popper from '@material-ui/core/Popper';
import MuiAutocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete';

import '../../css/components-inc/select-searchable.css';
import S from '../utilities/Main';

export const SelectSearchableMargin = {
    NORMAL: 1,
    DENSE: 2,
}

interface Option {
    value: any,
    label: any,
}

interface Props extends AutocompleteProps < Option, true, true, false > {
    margin?: SelectSearchableMargin.NORMAL | SelectSearchableMargin.DENSE;
}

export default class SelectSearchable extends React.Component < Props > {

    static option(value: any, label: any = null) {
        if (label === null) {
            label = value;
        }

        return {
            'value': value,
            'label': label,
        }
    }

    onChange = (_, value) => {
        this.props.onChange(value);
    }

    getMargin() {
        switch (this.props.margin) {
            default:
            case SelectSearchableMargin.NORMAL:
                return 'normal';
            case SelectSearchableMargin.DENSE:
                return 'dense';
        }
    }

    getOptionLabel = (option: Option) => {
        return option.label;
    }

    getOptionSelected = (option: Option, value: Option) => {
        return option.value === value.value;
    }

    render() {
        const margin = this.getMargin();
        const { error, ...props } = this.props;
        return (
            <div className = { `SelectSearchable ${this.props.className}` }>
                <FormControl variant = { 'outlined' } margin = { margin } >
                    <MuiAutocomplete
                        {...props}
                        PopperComponent = { SelectSearchablePopper }
                        onChange = { this.props.onChange !== null && this.props.readOnly !== true ? this.onChange : null }
                        getOptionLabel = { this.getOptionLabel }
                        getOptionSelected = { this.getOptionSelected }
                        filterSelectedOptions
                        renderInput = { (params) => (
                            <Input
                                { ...params }
                                variant = { 'outlined' }
                                label = { this.props.label }
                                error = { this.props.error }
                                margin = { this.props.margin }
                                fullWidth
                            />
                        )} />
                </FormControl>
            </div>
        );
    }
}

class SelectSearchablePopper extends React.Component {

    render() {
        return (
            <Popper id = { 'searchable-select-popper' } {...this.props} />
        );
    }

}

SelectSearchable.defaultProps = {
    'className': S.Strings.EMPTY,
    'margin': SelectSearchableMargin.DENSE,
};
