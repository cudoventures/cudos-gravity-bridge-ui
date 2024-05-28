import Page from "../../Page";

const Config = require("../../../../../../config/config");

export default class PageNotFoundH extends Page {
  static URL: string;
  static TEMPLATE_PATH: string;
}

PageNotFoundH.URL = `${Config.URL.GENERAL}/not-found`;
PageNotFoundH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.GENERAL}/page-not-found.marko`;
