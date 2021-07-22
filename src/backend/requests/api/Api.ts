import Context from '../../utilities/network/Context';

export default class Api {

    async onRequest(context: Context) {
        await this.processRequest(context);
    }

    async processRequest(context: Context) {
    }

}
