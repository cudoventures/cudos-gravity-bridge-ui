import React from "react";
import ModalComponent from "./ModalComponent";

import "../../css/components-popups/summary-modal.css";
import Config from "../../../../../../builds/dev-generated/Config";

import Button from "../components-inc/Button";
import ProjectUtils from "../ProjectUtils";
import CosmosNetworkH from "../models/ledgers/CosmosNetworkH";
import SvgAttention from "../../../../resources/common/img/favicon/attention.svg";

const SummaryModal = ({
  closeModal,
  isOpen,
  getAddress,
  selectedFromNetwork,
  selectedToNetwork,
  displayAmount,
  onGetBalance,
  txHash,
  destTxHash,
}: {
  closeModal: Function;
  isOpen: boolean;
  getAddress: Function;
  selectedFromNetwork: number;
  selectedToNetwork: number;
  displayAmount: string;
  onGetBalance: Function;
  txHash: string;
  destTxHash: string;
}) => {
  const CUDOS_SUCCESS_MESSAGE = `Your bridge transaction was successfully submitted to ${ProjectUtils.CUDOS_NETWORK_TEXT}. It is awaiting to be included in a batch and can take up to 120 ${ProjectUtils.CUDOS_NETWORK_TEXT} blocks to be fully executed on ${ProjectUtils.ETHEREUM_NETWORK_TEXT}.`;
  const ETHEREUM_SUCCESS_MESSAGE = `Your bridge transaction was successfully submitted to ${ProjectUtils.ETHEREUM_NETWORK_TEXT} and ${ProjectUtils.CUDOS_NETWORK_TEXT}.`;

  const cudosLogoSmall =
    "../../../../resources/common/img/favicon/cudos-18x18.svg";
  const ethLogoSmall = "../../../../resources/common/img/favicon/eth-18x18.svg";
  const successIcon =
    "../../../../resources/common/img/favicon/successs-icon.svg";
  const closeIcon =
    "../../../../resources/common/img/favicon/close-icon-24x24.svg";
  const linkIcon = "../../../../resources/common/img/favicon/link-icon.svg";

  const fromNetwork = selectedFromNetwork
    ? ProjectUtils.CUDOS_NETWORK_TEXT
    : ProjectUtils.ETHEREUM_NETWORK_TEXT;
  const toNetwork = selectedToNetwork
    ? ProjectUtils.CUDOS_NETWORK_TEXT
    : ProjectUtils.ETHEREUM_NETWORK_TEXT;

  const ETHERSCAN_EXPLORER =
    Config.CUDOS_NETWORK.NETWORK_TYPE === "mainnet"
      ? Config.ETHEREUM.ETHERSCAN_MAINNET
      : Config.ETHEREUM.ETHERSCAN_RINKEBY;
  const CUDOS_EXPLORER = Config.CUDOS_NETWORK.BLOCK_EXPLORER;

  const onCloseModal = async () => {
    onGetBalance();
    closeModal();
  };

  return (
    <ModalComponent closeModal={closeModal} isOpen={isOpen}>
      <div className={"SummaryForm"}>
        <div>
          <div
            className={"CloseIcon"}
            onClick={() => onCloseModal()}
            style={ProjectUtils.makeBgImgStyle(closeIcon)}
          ></div>
        </div>
        <div className={"Wrapper"}>
          <div
            className={"SuceessIcon"}
            style={ProjectUtils.makeBgImgStyle(successIcon)}
          ></div>
        </div>
        <div className={"Title"}>Success!</div>
        <div className={"Row Margin"}>
          <div className={"Column"}>
            <div>
              <div className={"Row Spacing"}>
                <span className={"FlexStart FlexRight"}>From</span>
                <span className={"FlexStart"}>To</span>
              </div>
              <div className={"Row Spacing"}>
                <span className={"FlexStart FlexRight"}>
                  <div
                    className={
                      selectedFromNetwork
                        ? "CudosLogoSmall NoMarginLeft"
                        : "EthLogoSmall NoMarginLeft"
                    }
                    style={
                      selectedFromNetwork
                        ? ProjectUtils.makeBgImgStyle(cudosLogoSmall)
                        : ProjectUtils.makeBgImgStyle(ethLogoSmall)
                    }
                  ></div>
                  <div className={"AlignCenter Weight500"}>{fromNetwork}</div>
                </span>
                <span className={"FlexStart"}>
                  <div
                    className={
                      selectedToNetwork
                        ? "CudosLogoSmall NoMarginLeft"
                        : "EthLogoSmall NoMarginLeft"
                    }
                    style={
                      selectedToNetwork
                        ? ProjectUtils.makeBgImgStyle(cudosLogoSmall)
                        : ProjectUtils.makeBgImgStyle(ethLogoSmall)
                    }
                  ></div>
                  <div className={"AlignCenter Weight500"}>{toNetwork}</div>
                </span>
              </div>
              <div className={"Row Spacing"}>
                <span className={"FlexStart GrayText FlexRight"}>
                  {getAddress(selectedFromNetwork, 10)}
                </span>
                <span className={"FlexStart GrayText"}>
                  {getAddress(selectedToNetwork, 10)}
                </span>
              </div>
              <div className={"DoubleSpacing"}>
                <span>Destination Address</span>
              </div>
              <div>
                <span className={"GrayText Weight500"}>
                  {getAddress(selectedToNetwork, 0)}
                </span>
              </div>
              <div className={"Row DoubleSpacing"}>
                <span className={"FlexStart Amount"}>Amount</span>
                <span className={"FlexStart Asset FlexRight"}>Asset</span>
              </div>
              <div className={"Row Spacing"}>
                <span className={"FlexStart GrayText Weight600 Cudos"}>
                  {!displayAmount ? "0.0" : displayAmount}
                </span>
                <span
                  className={"FlexStart GrayText Asset Weight600 FlexRight"}
                >
                  {CosmosNetworkH.CURRENCY_DISPLAY_NAME}
                </span>
              </div>
              {/* Gas Fee temporarily disabled */}
              {/* <div className={'Row DoubleSpacing TopBorder'}>
                                <span className={'FlexStart'}>
                            Gas Fee
                                </span>
                                <span className={'FlexEnd Weight600'}>0.00012 {CosmosNetworkH.CURRENCY_DISPLAY_NAME}</span>
                            </div> */}
              <div
                style={{ marginTop: "85px" }}
                className={"Row DoubleSpacing TopBorder"}
              >
                <div>Transaction</div>
              </div>
              <div className={"Row Spacing LinkWrapper"}>
                <div className={"LinkContent"}>
                  <a
                    href={`${
                      selectedFromNetwork ? CUDOS_EXPLORER : ETHERSCAN_EXPLORER
                    }/${txHash}`}
                    rel='noreferrer'
                    target='_blank'
                  >
                    {selectedFromNetwork ? "CUDOS" : "Ethereum"} Bridge
                    transaction link
                  </a>
                  <div
                    className={"LinkIcon"}
                    style={ProjectUtils.makeBgImgStyle(linkIcon)}
                  />
                </div>
              </div>
              {selectedFromNetwork ? (
                ""
              ) : (
                <div className={"Row Spacing LinkWrapper"}>
                  <div className={"LinkContent"}>
                    <a
                      href={`${CUDOS_EXPLORER}/${destTxHash}`}
                      rel='noreferrer'
                      target='_blank'
                    >
                      CUDOS Bridge transaction link
                    </a>
                    <div
                      className={"LinkIcon"}
                      style={ProjectUtils.makeBgImgStyle(linkIcon)}
                    />
                  </div>
                </div>
              )}
              <div className={"Row DoubleSpacing"}>
                <div className={"TransactionMessage FlexRow"}>
                  <div
                    className={"AttentionIcon SVG Size"}
                    dangerouslySetInnerHTML={{ __html: SvgAttention }}
                  />
                  <div>
                    {selectedFromNetwork
                      ? CUDOS_SUCCESS_MESSAGE
                      : ETHEREUM_SUCCESS_MESSAGE}
                  </div>
                </div>
              </div>
              <div className={"Flex DoubleSpacing BtnWrapper"}>
                <Button
                  className={"TransferBtn"}
                  color='primary'
                  onClick={() => onCloseModal()}
                >
                  Transfer again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default SummaryModal;
