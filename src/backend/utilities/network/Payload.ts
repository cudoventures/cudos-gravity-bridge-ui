import Params from '../Params';

export default class Payload {

    ctx: any;
    action: string;
    params: any;

    constructor(ctx) {
        this.ctx = ctx;
        this.action = ctx.request.body[Params.ACTION] || ctx.request.query[Params.ACTION];
        this.params = {};

        /* json payload */
        const payload = ctx.request.body[Params.PAYLOAD];
        if (payload !== undefined) {
            try {
                this.params = JSON.parse(payload);
            } catch (e) {
            }
        }

        /* get body params */
        Object.keys(ctx.request.body).forEach((key) => {
            if (key === Params.PAYLOAD || key === Params.ACTION) {
                return;
            }

            this.params[key] = ctx.request.body[key];
        });

        /* get url params */
        Object.keys(ctx.request.query).forEach((key) => {
            this.params[key] = ctx.request.query[key];
        });
    }

}
