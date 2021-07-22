import Page from '../../Page';

const Config = require('../../../../../../config/config');

export default class PageDashboardH extends Page {

    static URL: string;
    static TEMPLATE_PATH: string;
}

PageDashboardH.URL = `${Config.URL.CADMIN}/dashboard`;
PageDashboardH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.CADMIN}/page-dashboard.marko`;
