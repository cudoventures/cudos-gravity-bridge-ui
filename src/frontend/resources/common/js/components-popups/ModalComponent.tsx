import React from 'react';
import { Backdrop, Box, Modal, Fade } from '@material-ui/core/';

import '../../css/components-popups/summary-modal.css';

const ModalComponent = (
    { isOpen, closeModal, children, errorMessage } :
    {
        isOpen: boolean,
        closeModal: Function,
        errorMessage: string
        children:React.ReactNode
    },
) => {

    return (
        <div>
            <Modal
                disableScrollLock
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isOpen}
                onClose={(e, reason) => { if (reason !== 'backdropClick') { closeModal() } }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isOpen}>
                    <Box className={'ModalContent'}>
                        <div>
                            {children}
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default ModalComponent;
