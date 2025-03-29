import { Button, Dialog, Div } from './factory.ts';
import type { ModalProperties } from '~/utils/types/types.ts';

function createPopup({ children, onClose }: ModalProperties): HTMLDialogElement {
  const closeButton = Button('Close');

  const popupContainer = Div(closeButton);

  const dialog = Dialog(popupContainer);

  closeButton.addEventListener('click', () => {
    dialog.close();
    if (onClose) {
      onClose();
    }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
      if (onClose) {
        onClose();
      }
    }
  });

  dialog.addEventListener('close', () => {
    dialog.remove();
  });

  if (children) {
    if (typeof children === 'string' || children instanceof Node) {
      popupContainer.append(children);
    } else if (Array.isArray(children)) {
      for (const childElement of children) {
        popupContainer.append(childElement);
      }
    }
  }

  popupContainer.append(closeButton);
  dialog.append(popupContainer);

  return dialog;
}

export { createPopup };
