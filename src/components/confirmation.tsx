import { Button, Modal, ModalContent, ModalHeader, ModalFooter } from '@nextui-org/react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; message: string }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>{message}</ModalHeader>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={close}>
                No
              </Button>
              <Button
              variant='shadow'
                color="danger"
                onClick={() => {
                  onConfirm();
                  close();
                }}
              >
                Yes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
