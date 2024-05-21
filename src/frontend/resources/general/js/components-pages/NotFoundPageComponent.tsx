/* global TR */

import React from "react";

import ContextPageComponent, {
  ContextPageComponentProps,
} from "./common/ContextPageComponent";

import "./../../css/components-pages/page-not-found-component.css";
import LayoutBlock from "../../../common/js/components-inc/LayoutBlock";
import PageComponent from "../../../common/js/components-pages/PageComponent";
import { inject, observer } from "mobx-react";

interface Props extends ContextPageComponentProps {}

export default class PageNotFoundComponent extends ContextPageComponent<Props> {
  static layout() {
    const MobXComponent = inject("appStore")(observer(PageNotFoundComponent));
    PageComponent.layout(<MobXComponent />);
  }

  anchorEl: any;
  checkbox: 0 | 1;
  datepicker: number;

  constructor(props: Props) {
    super(props);
    this.anchorEl = null;
    this.checkbox = 1;
    this.datepicker = Date.now();
  }

  getPageLayoutComponentCssClassName() {
    return "PageNotFound";
  }

  renderContent() {
    return (
      <div
        style={{ width: "1000px", height: "500px", margin: "auto" }}
        className={"FlexSingleCenter"}
      >
        <LayoutBlock>
          <h1>404</h1>
          <p>Oops! Something went wrong. Please try again!</p>
        </LayoutBlock>
      </div>
    );
  }
}
