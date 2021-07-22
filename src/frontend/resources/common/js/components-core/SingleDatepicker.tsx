import React from 'react';
import moment from 'moment';
import { ReactDatePickerProps } from 'react-datepicker';

import S from '../utilities/Main';

import Datepicker from './Datepicker';
import LayoutBlock from '../components-inc/LayoutBlock';
import Input from '../components-inc/Input';

import SvgClose from '@material-ui/icons/Clear';

interface Props extends ReactDatePickerProps {
    emptyDateString?: string;
    error?: boolean,
}

export default class SingleDatepicker extends React.Component < Props > {

    static defaultProps: any;

    isDateValid() {
        return this.props.selected !== null;
    }

    onClickClear = (e) => {
        this.props.onChange(null);
        e.stopPropagation();
    }

    render() {
        return (
            <LayoutBlock>
                <Datepicker {...this.props}
                    dateFormat = { 'dd.MM.yyyy' }
                    customInput = {
                        <Input
                            label = { this.props.emptyDateString }
                            error = { this.props.error }
                            InputProps = { this.renderInputProps() } />
                    }
                />
            </LayoutBlock>
        )
    }

    renderInputProps() {
        if (this.isDateValid() === false) {
            return undefined;
        }

        return {
            'endAdornment': (
                <div className={'DateClearButton StartRight SVG Clickable'} onClick = { this.onClickClear } >
                    <SvgClose />
                </div>
            ),
        }
    }

}

SingleDatepicker.defaultProps = {
    'emptyDateString': S.Strings.EMPTY,
};
