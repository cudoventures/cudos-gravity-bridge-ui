import React from "react";
import ModalComponent from "./ModalComponent";

import Button from "../components-inc/Button";
import ProjectUtils from "../ProjectUtils";
import "../../css/components-popups/failure-modal.css";

const FailureModal = ({
  closeModal,
  isOpen,
  errorMessage,
}: {
  closeModal: Function;
  isOpen: boolean;
  errorMessage: string;
}) => {
  const transactionFailIcon =
    "../../../../resources/common/img/favicon/transaction-fail.svg";
  const closeIcon =
    "../../../../resources/common/img/favicon/close-icon-24x24.svg";

  return (
    <ModalComponent closeModal={closeModal} isOpen={isOpen}>
      <div className={"FailureForm"}>
        <div>
          <div
            className={"CloseIcon"}
            onClick={() => closeModal()}
            style={ProjectUtils.makeBgImgStyle(closeIcon)}
          ></div>
        </div>
        <div className={"Wrapper"}>
          <div
            className={"TransactionFailLogo"}
            style={ProjectUtils.makeBgImgStyle(transactionFailIcon)}
          ></div>
        </div>
        <div className={"Title"}>Oops!</div>
        <div className={"Subheader"}>{errorMessage}</div>
        <div className={"Flex DoubleSpacing BtnWrapper"}>
          <Button
            className={"TryAgainBtn"}
            color={"primary"}
            onClick={() => closeModal()}
          >
            Try again
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
};

export default FailureModal;
