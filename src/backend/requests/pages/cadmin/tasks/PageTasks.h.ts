import Page from '../../Page';

const Config = require('../../../../../../config/config');

export default class PageTasksH extends Page {

    static URL: string;
    static TEMPLATE_PATH: string;
}

PageTasksH.URL = `${Config.URL.CADMIN}/tasks`;
PageTasksH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.CADMIN}/page-tasks.marko`;
