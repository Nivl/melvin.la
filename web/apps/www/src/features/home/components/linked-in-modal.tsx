"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";

type Props = {
  closeLabel: string;
  content: string;
  state: ReturnType<typeof useOverlayState>;
  title: string;
};

const LinkedInModal = ({ closeLabel, content, state, title }: Props) => (
  <Modal state={state}>
    <Modal.Backdrop isDismissable isKeyboardDismissDisabled>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.Header className="flex flex-col gap-1">{title}</Modal.Header>
          <Modal.Body>
            <p>{content}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onPress={() => {
                state.close();
              }}
            >
              {closeLabel}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </Modal>
);

export { LinkedInModal };
