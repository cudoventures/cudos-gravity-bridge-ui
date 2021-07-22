import Ajax from './Ajax';
import Params from './../../../../../../builds/dev-generated/Params';

export default class Api {

    static TYPE_RAW: number = 1;
    static TYPE_JSON: number = 2;
    static TYPE_DATA: number = 3;

    controller: string;
    enableActions: null | (() => void);
    disableActions: null | (() => void);

    constructor(controller: string, enableActions: null | (() => void) = null, disableActions: null | (() => void) = null) {
        this.controller = controller;
        this.enableActions = enableActions;
        this.disableActions = disableActions;
    }

    req(action: string, param: any | null, callback: any, type: number = Api.TYPE_JSON, background: boolean = false, async: boolean = true) {
        const ajax = new Ajax(background === true ? null : this.enableActions, background === true ? null : this.disableActions);

        ajax.addParam(Params.ACTION, action);
        ajax.addParam(Params.PAYLOAD, JSON.stringify(param === null ? {} : param));

        ajax.onError = (status, responseText) => {
            if (status === 0) {
                return;
            }

            document.body.innerHTML = `
                <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; box-sizing:border-box; padding:64px;">
                    Server error. Please send the following error code: ${responseText}
                </div>
            `;
        };

        ajax.open(Ajax.POST, this.controller, async);
        switch (type) {
            case Api.TYPE_RAW:
                ajax.onResponse = callback;
                break;
            case Api.TYPE_JSON:
                ajax.onResponseJson = callback;
                break;
            default:
            case Api.TYPE_DATA:
                ajax.onResponseData = callback;
                break;
        }
        ajax.send();
    }

}
