import GeneralApiH from "./GeneralApi.h";
import GeneralController from "../../../controllers/GeneralController";
import Context from "../../../utilities/network/Context";

export default class GeneralApi extends GeneralApiH {
  generalController: GeneralController;

  constructor() {
    super();
    this.generalController = new GeneralController();
  }

  async processRequest(context: Context) {
    switch (context.payload.action) {
      case GeneralApiH.Actions.LOGIN:
        await this.generalController.login(context);
        break;
      default:
        break;
    }
  }
}
