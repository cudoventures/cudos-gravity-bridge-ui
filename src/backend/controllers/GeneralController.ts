import Context from '../utilities/network/Context';

export default class GeneralController {

    async login(context: Context) {
        context.res.obj = 2;
    }

}
