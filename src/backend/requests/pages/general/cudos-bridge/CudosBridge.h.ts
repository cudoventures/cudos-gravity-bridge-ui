import Page from "../../Page";

const Config = require("../../../../../../config/config");

export default class CudosBridgeH extends Page {
  static URL: string;
  static TEMPLATE_PATH: string;
}

CudosBridgeH.URL = `${Config.URL.GENERAL}/cudos-bridge`;
CudosBridgeH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.GENERAL}/cudos-bridge.marko`;
