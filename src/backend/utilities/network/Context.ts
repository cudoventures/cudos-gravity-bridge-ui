import Payload from "./Payload";
import Session from "../Session";
import Response from "../../utilities/network/Response";
import ServicesFactory from "../../services/common/ServicesFactory";

export default class Context {
  payload: Payload;
  session: Session;
  res: Response | null = null;
  servicesFactory: ServicesFactory | null;

  constructor(
    payload: Payload,
    session: Session,
    servicesFactory: ServicesFactory | null
  ) {
    this.payload = payload;
    this.session = session;
    this.servicesFactory = servicesFactory;
  }
}
