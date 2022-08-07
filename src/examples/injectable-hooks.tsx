import React, { useCallback, useState } from 'react';
import { injectable } from '../configured';

enum Environment {
  PROD = 'PROD',
  DEV = 'DEV',
  QA = 'QA',
}

type Config = {
  environment: Environment;
};

const createConfig = injectable.constant(
  (): Config => ({
    environment: Environment.QA,
  }),
);

type AppViewModel = {
  loading: boolean;
  toggleLoading: () => void;
};

const createAppViewModel = injectable.hook((): AppViewModel => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = useCallback(() => setLoading((prev) => !prev), []);

  return { loading, toggleLoading };
});

type BannerViewModel = {
  showBanner: boolean;
};

const createBannerViewModel = injectable.hook(
  injectable.inject.hook<AppViewModel>()('appViewModel'),
  injectable.inject.constant<Config>()('config'),
  (useAppViewModel, config): BannerViewModel => {
    const { loading } = useAppViewModel();

    const showBanner = !loading && config.environment === Environment.QA;

    return { showBanner };
  },
);

const App = injectable.component(
  injectable.inject.hook<AppViewModel>()('appViewModel'),
  injectable.inject.hook<BannerViewModel>()('bannerViewModel'),
  (useAppViewModel, useBannerViewModel) => () => {
    const { loading, toggleLoading } = useAppViewModel();
    const { showBanner } = useBannerViewModel();

    return (
      <div onClick={toggleLoading}>
        {loading ? 'loading...' : 'loaded :)'} <br /> {showBanner && <div>banner!</div>}
      </div>
    );
  },
);

const config = createConfig();
const appViewModel = createAppViewModel();
const bannerViewModel = createBannerViewModel({ appViewModel, config });

const AppResolved = App({ appViewModel, bannerViewModel });

export const InjectableHooks = () => <AppResolved />;
