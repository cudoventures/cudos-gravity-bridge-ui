import Api from '../api/Api';
import GeneralApi from '../api/general/GeneralApi';
import Logger from '../../utilities/Logger';
import Response from '../../utilities/network/Response';
import Context from '../../utilities/network/Context';

const Config = require('../../../../config/config');

export default class ApiFilter {

    static map: Map < string, Api >;

    static init() {
        ApiFilter.map = new Map();
        ApiFilter.map.set(GeneralApi.URL, new GeneralApi());
    }

    static async onRequest(context: Context) {
        const api = ApiFilter.map.get(Config.URL.ROOT + context.payload.ctx.URL.pathname);

        if (api === undefined) {
            return null;
        }

        if (Config.Build.DEV === true) {
            Logger.request({
                'path': context.payload.ctx.URL.pathname,
                'body': context.payload.ctx.request.body,
                'session': context.payload.ctx.session,
            });
        }

        context.res = new Response();
        await api.onRequest(context);
        return context.res;
    }

}
