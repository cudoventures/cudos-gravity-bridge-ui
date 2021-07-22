import AccountsApi from '../../../../common/js/api/AccountsApi';

import PageComponent, { PageComponentProps } from '../../../../common/js/components-pages/PageComponent';
import AccountModel from '../../../../common/js/models/AccountModel';
import AccountSessionStore from '../../../../common/js/stores/AcccountSessionStore';

export interface ContextPageComponentProps extends PageComponentProps {
    accountSessionStore: AccountSessionStore;
}

export default class ContextPageComponent < Pr extends ContextPageComponentProps, St = {}, SS = any > extends PageComponent < Pr, St, SS > {

    makeLoginRequest: boolean = false;
    requiredLoginData: boolean = false;

    async loadData() {
        ++this.props.appStore.loadingPage;
        await super.loadData();

        return new Promise((resolve, reject) => {
            let requiredParallelRequests = 0;
            let madeParallelRequests = 0;

            const onRequest = () => {
                ++madeParallelRequests;
                if (requiredParallelRequests === madeParallelRequests) {
                    --this.props.appStore.loadingPage;
                    resolve();
                }
            };

            if (this.makeLoginRequest === true) {
                ++requiredParallelRequests;
                new AccountsApi().fetchLoginAccounts((accountModel) => {
                    if (accountModel === null) {
                        if (this.requiredLoginData === true) {
                            // TO DO: redirect to login page
                            return;
                        }

                        this.props.accountSessionStore.accountModel = new AccountModel();
                    } else {
                        this.props.accountSessionStore.accountModel = accountModel;
                    }

                    onRequest();
                });
            }

        });

    }

}
