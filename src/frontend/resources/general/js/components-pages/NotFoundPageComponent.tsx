/* global TR */

import React from "react";

import ContextPageComponent, {
  ContextPageComponentProps,
} from "./common/ContextPageComponent";

import "./../../css/components-pages/page-not-found-component.css";
import PageComponent from "../../../common/js/components-pages/PageComponent";
import Input from "../../../common/js/components-inc/Input";
import { inject, observer } from "mobx-react";

interface Props extends ContextPageComponentProps {}

export default class PageNotFoundComponent extends ContextPageComponent<Props> {
  static layout() {
    const MobXComponent = inject("appStore")(observer(PageNotFoundComponent));
    /*     @ts-ignore */
    PageComponent.layout(<MobXComponent />);
  }

  getPageLayoutComponentCssClassName() {
    return "PageNotFound";
  }

  renderContent() {
    return (
      <div className='PageNotFoundContent'>
        <div className='PageNotFoundContainer'>
          <h1>404</h1>
          <Input aria-label='Amount input' placeholder='0' type='number' />
          <p>Oops! Something went wrong. Please try again!</p>
        </div>
      </div>
    );
  }
}
