import React, { useEffect, useState } from "react";

import ProjectUtils from "../../../common/js/ProjectUtils";
import Button from "../../../common/js/components-inc/Button";

const KEPLR_WALLET = 1;
const METAMASK_WALLET = 0;

const TransferForm = ({
  selectedFromNetwork,
  isFromConnected,
  onChangeTransactionDirection,
  selectedToNetwork,
  isToConnected,
  getAddress,
  onDisconnectFromNetwork,
  onDisconnectToNetwork,
  onSelectFromNetwork,
  onSelectToNetwork,
  goToTransactionSummary,
  connectWallet,
  onChangeAccount,
}: {
  selectedFromNetwork: number;
  isFromConnected: boolean;
  onChangeTransactionDirection: any;
  selectedToNetwork: number;
  isToConnected: boolean;
  getAddress: any;
  onDisconnectFromNetwork: any;
  onDisconnectToNetwork: any;
  onSelectFromNetwork: any;
  onSelectToNetwork: any;
  goToTransactionSummary: any;
  connectWallet: any;
  onChangeAccount: any;
}) => {
  const cudosLogo = "../../../../resources/common/img/favicon/cudos-22x22.svg";
  const ethLogo = "../../../../resources/common/img/favicon/eth-16x25.svg";
  const transferLogo =
    "../../../../resources/common/img/favicon/transfer-logo.svg";
  const fromNetwork = selectedFromNetwork
    ? ProjectUtils.CUDOS_NETWORK_TEXT
    : ProjectUtils.ETHEREUM_NETWORK_TEXT;
  const toNetwork = selectedToNetwork
    ? ProjectUtils.CUDOS_NETWORK_TEXT
    : ProjectUtils.ETHEREUM_NETWORK_TEXT;

  const [animate, setAnimate] = useState<boolean>(false);

  const changeTransaction = () => {
    onChangeTransactionDirection();
    setAnimate(!animate);
  };

  useEffect((): void => {
    window.addEventListener("keplr_keystorechange", async () => {
      await connectWallet(KEPLR_WALLET);
      await onChangeAccount(KEPLR_WALLET);
    });
  }, []);

  useEffect((): void => {
    localStorage.setItem("manualAccountChange", "false");
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async () => {
        localStorage.setItem("manualAccountChange", "true");
        await connectWallet(METAMASK_WALLET);
        await onChangeAccount(METAMASK_WALLET);
      });
    }
  }, []);

  return (
    <div className={"SendForm"}>
      <div className={"Title"}>Transfer from</div>
      <div className={"Address"}>
        <div
          className={selectedFromNetwork ? "CudosLogo" : "EthLogo"}
          style={
            selectedFromNetwork
              ? ProjectUtils.makeBgImgStyle(cudosLogo)
              : ProjectUtils.makeBgImgStyle(ethLogo)
          }
        />
        {isFromConnected ? getAddress(selectedFromNetwork, 18) : fromNetwork}
        <Button
          className={isFromConnected ? "DisconnectBtn" : "ConnectBtn"}
          onClick={() =>
            isFromConnected
              ? onDisconnectFromNetwork()
              : onSelectFromNetwork(selectedFromNetwork)
          }
          color={isFromConnected ? "secondary" : "primary"}
        >
          {isFromConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>
      <div className={"Wrapper"}>
        <div
          className={
            animate
              ? "TransferLogo Rotate Up Pulsing"
              : "TransferLogo Rotate Down Pulsing"
          }
          style={ProjectUtils.makeBgImgStyle(transferLogo)}
          onClick={() => changeTransaction()}
        ></div>
      </div>
      <div className={"Title"}>Transfer to</div>
      <div className={"Address"}>
        <div
          className={selectedToNetwork ? "CudosLogo" : "EthLogo"}
          style={
            selectedToNetwork
              ? ProjectUtils.makeBgImgStyle(cudosLogo)
              : ProjectUtils.makeBgImgStyle(ethLogo)
          }
        />
        {isToConnected ? getAddress(selectedToNetwork, 18) : toNetwork}
        <Button
          className={isToConnected ? "DisconnectBtn" : "ConnectBtn"}
          onClick={() =>
            isToConnected
              ? onDisconnectToNetwork()
              : onSelectToNetwork(selectedToNetwork)
          }
          color={isToConnected ? "primary" : "secondary"}
        >
          {isToConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>
      <div className={"FormRow Wrapper"}>
        <Button
          disabled={!isFromConnected || !isToConnected}
          className={"TransferBtn"}
          color='primary'
          onClick={() => goToTransactionSummary()}
        >
          Begin new transfer
        </Button>
      </div>
    </div>
  );
};

export default TransferForm;
