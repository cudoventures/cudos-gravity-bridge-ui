import Page from '../../Page';

const Config = require('../../../../../../config/config');

export default class PageUsersH extends Page {

    static URL: string;
    static TEMPLATE_PATH: string;
}

PageUsersH.URL = `${Config.URL.CADMIN}/users`;
PageUsersH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.CADMIN}/page-users.marko`;
