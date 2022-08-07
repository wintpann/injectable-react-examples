import React, { useState } from 'react';
import { useAction } from 'injectable-react';

import { injectable } from '../configured';

type FirstViewModel = {
  count: number;
  increase: () => void;
};

type SecondViewModel = {
  count: number;
  increase: () => void;
};

const createFirstViewModel = injectable.hook((): FirstViewModel => {
  const [count, setCount] = useState(0);

  const increase = useAction(() => setCount(count + 1));
  return { increase, count };
});

const createSecondViewModel = injectable.hook((): SecondViewModel => {
  const [count, setCount] = useState(0);

  const increase = useAction(() => setCount(count + 1));
  return { increase, count };
});

const FirstComponent = injectable.component(
  injectable.inject.hook<FirstViewModel>()('firstViewModel'),
  (useFirstViewModel) => () => {
    const { count, increase } = useFirstViewModel();
    return <div onClick={increase}>first component: {count}</div>;
  },
);

const SecondComponent = injectable.component(
  injectable.inject.hook<SecondViewModel>()('secondViewModel'),
  (useSecondViewModel) => () => {
    const { count, increase } = useSecondViewModel();
    return <div onClick={increase}>second component: {count}</div>;
  },
);

const App = injectable.component(
  FirstComponent,
  SecondComponent,
  (FirstComponent, SecondComponent) => () =>
    (
      <div>
        <FirstComponent />
        <br />
        <SecondComponent />
        <br />
        <FirstComponent />
        <br />
        <SecondComponent />
        <br />
      </div>
    ),
);

const firstViewModel = createFirstViewModel();
const secondViewModel = createSecondViewModel();

const AppResolved = App({ firstViewModel, secondViewModel });

export const NestedComponentResolving = () => <AppResolved />;
