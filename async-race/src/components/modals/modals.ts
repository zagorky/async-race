import { createPopup } from '~/utils/modal.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { Button, Input, Label } from '~/utils/factory.ts';

export function createModal(message: string) {
  const modal = createPopup({ children: message });
  document.body.append(modal);
  modal.showModal();
}

export function createUpdateCarModal(
  carData: GarageDataType,
  onUpdate: (data: GarageDataType) => Promise<void>,
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
    onUpdate({ id: carData.id, color: colorInput.value, name: nameInput.value }).catch((error) => {
      createModal(`Update failed: ${error instanceof Error ? error.message : String(error)}`);
    });
    modal.remove();
  });

  return modal;
}

export function createAddCarModal(onAdd: (data: Omit<GarageDataType, 'id'>) => void) {
  const ID = 'new';
  const defaultName = 'New Cat';
  const defaultColor = '#ef1ba6';
  const colorLabel = Label('Color: ', `color-${ID}`);
  const nameLabel = Label('Name: ', `name-${ID}`);
  const addButton = Button('Add');

  const colorInput = Input('Color', {
    id: `color-${ID}`,
    type: 'color',
    value: defaultColor,
    style: `background-color:${defaultColor}`,
  });

  const nameInput = Input('Name', {
    id: `name-${ID}`,
    type: 'text',
    placeholder: defaultName,
  });

  const modal = createPopup({
    children: [colorLabel, colorInput, nameLabel, nameInput, addButton],
  });

  colorInput.addEventListener('input', () => (colorInput.style.backgroundColor = colorInput.value));

  addButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const color = colorInput.value;
    if (name) {
      onAdd({ color: color, name: name });
      modal.remove();
    } else {
      createModal('Enter cat name');
    }
  });

  return modal;
}
