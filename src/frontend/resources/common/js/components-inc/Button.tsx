import React from 'react';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import MuiButton from '@material-ui/core/Button';

import './../../css/components-inc/button.css';
import S from '../utilities/Main';

const theme01 = createTheme({
    palette: {
        action: {
            disabledBackground: 'rgba(54, 62, 89, 1)',
            disabled: '#fff',
        },
        primary: {
            main: 'rgb(85, 146, 247)',
            contrastText: '#fff',
        },
        secondary: {
            main: 'rgb(27, 32, 49)',
            contrastText: '#fff',
        },
    },
});

const theme02 = createTheme({
    palette: {
        action: {
            disabledBackground: 'rgba(99, 109, 143, 0.3)',
            disabled: '#636D8F',
        },
        primary: {
            main: 'rgba(78, 148, 238, 0.2)',
            contrastText: '#4E94EE',
        },
    },
});

interface Props {
    className?: string;
    type?: Button.TYPE_ROUNDED | Button.TYPE_TEXT_INLINE;
    color?: Button.COLOR_SCHEME_1 | Button.COLOR_SCHEME_2 | Button.COLOR_SCHEME_4;
    href?: string,
    onClick?: () => void;
    disabled?: boolean;
    target?: string;
}

export default class Button extends React.Component < Props > {

    static TYPE_ROUNDED: number = 1;
    static TYPE_TEXT_INLINE: number = 2;

    static COLOR_SCHEME_1: number = 1;
    static COLOR_SCHEME_2: number = 2;
    static COLOR_SCHEME_3: number = 3;
    static COLOR_SCHEME_4: number = 4;

    cssMuiClassColor() {
        switch (this.props.color) {
            default:
            case Button.COLOR_SCHEME_1:
            case Button.COLOR_SCHEME_3:
                return 'primary';
            case Button.COLOR_SCHEME_2:
                return 'secondary';
            case Button.COLOR_SCHEME_4:
                return 'primary'
        }
    }

    muiVariant() {
        switch (this.props.type) {
            default:
            case Button.TYPE_ROUNDED:
                return 'contained';
            case Button.TYPE_TEXT_INLINE:
                return 'text';
        }
    }

    muiTheme() {
        switch (this.props.color) {
            case Button.COLOR_SCHEME_1:
            case Button.COLOR_SCHEME_2:
                return theme01;
            case Button.COLOR_SCHEME_4:
                return theme02;
            default:
                return theme02;
        }
    }

    render() {
        const className = `Button Transition ${this.props.className}`;

        return (
            <ThemeProvider theme = { theme01 && theme02 } >
                <ThemeProvider theme = { this.muiTheme() } >
                    <MuiButton
                        disabled = { this.props.disabled }
                        className = { className }
                        onClick = { this.props.onClick }
                        variant = { this.muiVariant() }
                        color = { this.cssMuiClassColor() }
                        href = { this.props.href }
                        target = { this.props.target } >

                        <div className = { 'ButtonContent FlexRow' } >
                            { this.props.children }
                        </div>

                    </MuiButton>
                </ThemeProvider>
            </ThemeProvider>
        );
    }

}

Button.defaultProps = {
    'className': S.Strings.EMPTY,
    'type': Button.TYPE_ROUNDED,
    'color': Button.COLOR_SCHEME_1,
    'href': null,
    'disabled': false,
    'onClick': null,
};
