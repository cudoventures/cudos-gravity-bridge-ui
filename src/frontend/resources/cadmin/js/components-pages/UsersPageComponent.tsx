import React from 'react';
import { inject, observer } from 'mobx-react';

import PagesCAdmin from '../../../../../../builds/dev-generated/PagesCAdmin';

import TableHelper from '../../../common/js/helpers/TableHelper';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import PasswordPopup from '../../../common/js/components-popups/PasswordPopup';
import Table from '../../../common/js/components-inc/Table';
import Header from '../components-inc/header';
import AccountsApi from '../../../common/js/api/AccountsApi';

import './../../css/components-pages/page-users-component.css';

interface Props extends ContextPageComponentProps {
}

export default class UsersPageComponent extends ContextPageComponent < Props > {

    static layout() {
        const MobXComponent = inject('appStore', 'accountSessionStore', 'alertStore', 'popupPasswordStore')(observer(UsersPageComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);

        this.makeLoginRequest = true;

        this.tableHelper = new TableHelper(1, [], () => {
        });
    }

    getPageLayoutComponentCssClassName() {
        return 'PageUsers';
    }

    renderContent() {
        return (
            <>
                <Header page = { PagesCAdmin.USERS } />

                <Table
                    widths={['20%', '60%', '20%']}
                    legend={['E-mail', 'Роля', 'Дата на регистрация']}
                    total={10}
                    helper={this.tableHelper}
                    rows={this.renderRows()} />
            </>
        )
    }

    renderRows() {
        const results = [];
        for (let i = 0; i < 10; ++i) {
            results.push(
                [Table.cellString('accountModel.email'), Table.cellString('accountModel.role'), Table.cellString('accountModel.getRegDateFormatted()')],
            );
        }
        return results;
    }

    renderPopups() {
        return super.renderPopups().concat([
            <PasswordPopup key = { 1 } />,
        ])
    }
}
