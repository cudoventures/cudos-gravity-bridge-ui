export default class Session {

    static ACCOUNT_ID: number;
    static ACCOUNT_ROLE: number;

    ctx: any;

    constructor(ctx) {
        this.ctx = ctx;
    }

    destroy() {
        this.ctx.session = null;
    }

    onLogin(accountId, role) {
        setProperty(this.ctx, Session.ACCOUNT_ID, accountId);
        setProperty(this.ctx, Session.ACCOUNT_ROLE, role);
    }

    getAccountId() {
        return getProperty(this.ctx, Session.ACCOUNT_ID);
    }

    setAccountRole(role) {
        setProperty(this.ctx, Session.ACCOUNT_ROLE, role);
    }

    getAccountRole() {
        return getProperty(this.ctx, Session.ACCOUNT_ROLE);
    }

    isAdmin() {
        return getProperty(this.ctx, Session.ACCOUNT_ROLE) === 1;
    }

}

Session.ACCOUNT_ID = 1;
Session.ACCOUNT_ROLE = 2;

function getProperty(ctx, key) {
    if (ctx.session !== null && ctx.session[key] !== undefined) {
        return ctx.session[key];
    }

    return null;
}

function setProperty(ctx, key, value) {
    if (ctx.session === null) {
        ctx.session = {};
    }

    ctx.session[key] = value;
}

function unsetProperty(ctx, key) {
    if (ctx.session !== null) {
        delete ctx.session[key];
    }
}
