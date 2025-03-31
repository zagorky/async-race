import { createPopup } from '~/utils/modal.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { Button, Input, Label } from '~/utils/factory.ts';

export function createErrorModal(message: string) {
  const modal = createPopup({ children: message });
  document.body.append(modal);
  modal.showModal();
}

export function createUpdateCarModal(
  carData: GarageDataType,
  onUpdate: (data: GarageDataType) => void,
) {
  const ID = carData.id;
  const colorLabel = Label('Color: ', `color-${ID}`);
  const nameLabel = Label('Name: ', `name-${ID}`);

  const colorInput = Input('Color', {
    id: `color-${ID}`,
    type: 'color',
    style: `background-color:${carData.color}`,
    value: carData.color,
  });

  const nameInput = Input('Name', {
    id: `name-${ID}`,
    type: 'text',
    placeholder: `${carData.name}`,
    value: carData.name,
  });

  const updateButton = Button('Update');

  const modal = createPopup({
    children: [colorLabel, colorInput, nameLabel, nameInput, updateButton],
  });

  colorInput.addEventListener('input', () => (colorInput.style.backgroundColor = colorInput.value));

  updateButton.addEventListener('click', () => {
    onUpdate({ id: carData.id, color: colorInput.value, name: nameInput.value });
    modal.remove();
  });

  return modal;
}

// export function createAddCarModal() {
//   const colorInput = Input('Color', {
//     id: `color-${ID}`,
//     type: 'color',
//     style: `background-color:${carData.color}`,
//     value: carData.color,
//   });
//
//   const nameInput = Input('Name', {
//     id: `name-${ID}`,
//     type: 'text',
//     placeholder: `${carData.name}`,
//     value: carData.name,
//   });
//
//   const updateButton = Button('Update');
//
//   const modal = createPopup({
//     children: [colorLabel, colorInput, nameLabel, nameInput, updateButton],
//   });
//
//   colorInput.addEventListener('input', () => (colorInput.style.backgroundColor = colorInput.value));
//
//   updateButton.addEventListener('click', () => {
//     onUpdate({ id: carData.id, color: colorInput.value, name: nameInput.value });
//     modal.remove();
//   });
//
//   return modal;
// }
