import { Popik } from '~/engine/popik.ts';
import { Garage } from '~/view/garage/garage.tsx';

export const App = (): JSX.Element => {
  const [counter, setCounter] = Popik.useState(0);

  return (
    <Popik.Fragment>
      <div>KELWIN, Spasssiba: {counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        I'm really button, click to "Counter" {counter}
      </button>
      <Garage />
    </Popik.Fragment>
  );
};
