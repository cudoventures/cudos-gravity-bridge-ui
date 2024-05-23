import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";

import "../../css/components-popups/summary-modal.css";

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
        disableBackdropClick
        disableScrollLock
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={isOpen}
        onClose={() => closeModal()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <Box className={"ModalContent"}>
            <div>{children}</div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalComponent;
