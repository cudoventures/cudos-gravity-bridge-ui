import Page from '../../Page';

const Config = require('../../../../../../config/config');

export default class PageProjectsH extends Page {

    static URL: string;
    static TEMPLATE_PATH: string;
}

PageProjectsH.URL = `${Config.URL.CADMIN}/projects`;
PageProjectsH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.CADMIN}/page-projects.marko`;
