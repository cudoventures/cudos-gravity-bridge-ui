import React from 'react';
import PropTypes from 'prop-types';

import Config from '../../../../../../builds/dev-generated/Config';
import PagesCAdmin from '../../../../../../builds/dev-generated/PagesCAdmin';

import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';

import '../../css/components-inc/header.css';

interface Props {
    page: string;
}

export default class Header extends React.Component < Props > {

    render() {
        return (
            <div className = { 'HeaderSpace' } >
                <header className = { 'FlexRow FlexSplit' } >
                    <a className = { 'HeaderLogoA' } href = { PagesCAdmin.DASHBOARD } ><img className = { 'HeaderLogo' } src = { `${Config.URL.Resources.Common.IMG}/logo.png` } /></a>
                    <Actions className = { 'StartRight' } >
                        <Button
                            type = { Button.TYPE_TEXT_INLINE }
                            color = { this.props.page === PagesCAdmin.DASHBOARD ? Button.COLOR_SCHEME_1 : Button.COLOR_SCHEME_2 }
                            href = { PagesCAdmin.DASHBOARD } >
                            Dashboard
                        </Button>
                        <Button
                            type = { Button.TYPE_TEXT_INLINE }
                            color = { this.props.page === PagesCAdmin.PROJECTS ? Button.COLOR_SCHEME_1 : Button.COLOR_SCHEME_2 }
                            href = { PagesCAdmin.PROJECTS } >
                            Projects
                        </Button>
                        <Button
                            type = { Button.TYPE_TEXT_INLINE }
                            color = { this.props.page === PagesCAdmin.CAMPAIGNS ? Button.COLOR_SCHEME_1 : Button.COLOR_SCHEME_2 }
                            href = { PagesCAdmin.CAMPAIGNS } >
                            Campaigns
                        </Button>
                        <Button
                            type = { Button.TYPE_TEXT_INLINE }
                            color = { this.props.page === PagesCAdmin.USERS ? Button.COLOR_SCHEME_1 : Button.COLOR_SCHEME_2 }
                            href = { PagesCAdmin.USERS } >
                            Users
                        </Button>
                        <Button
                            type = { Button.TYPE_TEXT_INLINE }
                            color = { this.props.page === PagesCAdmin.TASKS ? Button.COLOR_SCHEME_1 : Button.COLOR_SCHEME_2 }
                            href = { PagesCAdmin.TASKS } >
                            Tasks
                        </Button>
                    </Actions>
                </header>
            </div>
        )
    }

}
