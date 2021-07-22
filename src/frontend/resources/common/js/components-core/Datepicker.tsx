// version 2.0.1
import React from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import '../../css/components-core/datepicker.css'

import Datepicker, { ReactDatePickerProps } from 'react-datepicker';

export default class DatepickerComponent extends React.Component < ReactDatePickerProps > {

    render() {
        return (
            <div>
                <Datepicker {...this.props} />
            </div>
        )
    }

}
