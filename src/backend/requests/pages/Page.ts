import Context from "../../utilities/network/Context";

export default class Page {
  async onRequest(context: Context): Promise<boolean> {
    return true;
  }
}
