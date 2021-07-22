import React from 'react';
import { inject, observer } from 'mobx-react';

import PagesCAdmin from '../../../../../../builds/dev-generated/PagesCAdmin';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Header from '../components-inc/header';

import './../../css/components-pages/page-dashboard-component.css';

interface Props extends ContextPageComponentProps {
}

export default class TasksPageComponent extends ContextPageComponent < Props > {

    static layout() {
        const MobXComponent = inject('appStore', 'accountSessionStore')(observer(TasksPageComponent));
        PageComponent.layout(<MobXComponent />);
    }

    getPageLayoutComponentCssClassName() {
        return 'PageDashboard';
    }

    renderContent() {
        return (
            <>
                <Header page = { PagesCAdmin.DASHBOARD } />
            </>
        )
    }
}
