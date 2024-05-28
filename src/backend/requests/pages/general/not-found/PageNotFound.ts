import fs from "fs";

import PageNotFoundH from "./PageNotFound.h";
import SV from "../../../../utilities/SV";
import Context from "../../../../utilities/network/Context";

const Config = require("../../../../../../config/config");

const TEMPLATE = require(PageNotFoundH.TEMPLATE_PATH);

const CSS_PAGE_LOADING = fs.readFileSync(
  `${Config.Path.Root.Frontend.RESOURCES}/common/css/inline/page-loading.css`
);

export default class PageNotFound extends PageNotFoundH {
  async onRequest(context: Context): Promise<boolean> {
    context.payload.ctx.type = "html";
    context.payload.ctx.body = TEMPLATE.stream({
      META: {
        TITLE: "Admin | Not found",
        DESC: "",
        KEYWORDS: SV.KEYWORDS,
        ROBOTS: "noindex, nofollow",
        PAGE_URL: `${Config.URL.GENERAL}${PageNotFound.URL}`,
      },
      CSS: {
        PAGE_LOADING: CSS_PAGE_LOADING,
      },
      TR: context.payload.ctx.TR,
      TR_STRING: context.payload.ctx.TR_STRING,
      Config,
    });

    return true;
  }
}
