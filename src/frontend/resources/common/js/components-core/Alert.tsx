// version 2.0.0
import React from "react";
import { inject, observer } from "mobx-react";

import AlertStore from "../stores/AlertStore";
import S from "../utilities/Main";

import "../../css/components-core/alert.css";

interface Props {
  alertStore: AlertStore;
}

class Alert extends React.Component<Props> {
  onClickPositive = () => {
    const { alertStore } = this.props;

    let handled: boolean | void = false;
    if (alertStore.positiveListener !== null) {
      handled = alertStore.positiveListener();
    }

    if (handled !== true) {
      alertStore.hide();
    }
  };

  onClickNegative = () => {
    const { alertStore } = this.props;

    let handled: boolean | void = false;
    if (alertStore.negativeListener !== null) {
      handled = alertStore.negativeListener();
    }

    if (handled !== true) {
      alertStore.hide();
    }
  };

  onClickNeutral = () => {
    const { alertStore } = this.props;

    let handled: boolean | void = false;
    if (alertStore.neutralListener !== null) {
      handled = alertStore.neutralListener();
    }

    if (handled !== true) {
      alertStore.hide();
    }
  };

  render() {
    const { alertStore } = this.props;

    return (
      <div
        className={`AlertWrapper Transition ActiveVisibilityHidden ${S.CSS.getActiveClassName(alertStore.isVisible())}`}
      >
        <div className={"Alert ShadowDark"}>
          <div className={"Msg ScrollView"}>{alertStore.msg}</div>

          <div className={"FlexSplit"}>
            {alertStore.neutralLabel !== null && (
              <div
                className={"TextButton Neutral"}
                onClick={this.onClickNeutral}
              >
                {alertStore.neutralLabel}
              </div>
            )}

            <div className={"StartRight"}>
              {alertStore.negativeLabel !== null && (
                <div
                  className={"TextButton Negative"}
                  onClick={this.onClickNegative}
                >
                  {alertStore.negativeLabel}
                </div>
              )}

              {alertStore.positiveLabel !== null && (
                <div
                  className={"TextButton Positive"}
                  onClick={this.onClickPositive}
                >
                  {alertStore.positiveLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject("alertStore")(observer(Alert));
