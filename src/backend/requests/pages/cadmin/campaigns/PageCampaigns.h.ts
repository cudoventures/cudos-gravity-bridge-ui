import Page from '../../Page';

const Config = require('../../../../../../config/config');

export default class PageCampaignsH extends Page {

    static URL: string;
    static TEMPLATE_PATH: string;
}

PageCampaignsH.URL = `${Config.URL.CADMIN}/campaigns`;
PageCampaignsH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.CADMIN}/page-campaigns.marko`;
