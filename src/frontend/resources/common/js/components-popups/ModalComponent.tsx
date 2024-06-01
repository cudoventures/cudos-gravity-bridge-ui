import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { styled } from "@mui/system";

import "../../css/components-popups/summary-modal.css";

styled(Backdrop, {
  name: "MuiModal",
  slot: "Backdrop",
  overridesResolver: (props, styles) => {
    return styles.backdrop;
  },
})({ zIndex: -1 });

const ModalComponent = ({
  isOpen,
  closeModal,
  children,
  errorMessage,
}: {
  isOpen: boolean;
  closeModal: Function;
  errorMessage?: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <Modal
        disableScrollLock
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={isOpen}
        onClose={() => closeModal()}
        closeAfterTransition
      >
        <Fade in={isOpen}>
          <Box className={"ModalContent"}>
            {errorMessage ?? <div>{errorMessage}</div>}
            <div>{children}</div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalComponent;
