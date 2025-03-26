import { Div, H2, Section } from '~/utils/factory.ts';
import { createHeader } from '~/view/header/header.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { getCars } from '~/api/garage-api.ts';
import { createCarView } from '~/view/car/car.ts';

export async function createGarageView() {
  const pageName = 'Garage';
  document.title = pageName;
  const container = Div('');

  try {
    const cars: GarageDataType[] = await getCars();
    console.log(cars);
    if (cars && Array.isArray(cars)) {
      cars.forEach((car) => {
        // const carElement = createCarView(car);
        // container.append(carElement);
        container.append(createCarView(car));
      });
    }
  } catch (error) {
    console.error('Garage error', error);
  }

  return Section([createHeader(), H2(pageName), container]);
}

await createGarageView().then((view) => document.body.append(view));
