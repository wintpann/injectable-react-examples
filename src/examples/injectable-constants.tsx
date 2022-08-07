import React from 'react';
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

type Logger = (message: string) => void;

const createLogger = injectable.constant(
  injectable.inject.constant<Config>()('config'),
  (config): Logger =>
    (message: string) => {
      if (config.environment !== Environment.PROD) {
        alert(message);
      }
    },
);

type AppProps = {
  greeting: string;
};

const App = injectable.component(
  injectable.inject.constant<Logger>()('logger'),
  injectable.inject.constant<Config>()('config'),
  (logger, config) => (props: AppProps) =>
    (
      <div onClick={() => logger('hello from app component')}>
        {props.greeting}. click to send log! <br />
        by the way, environment is: {config.environment}
      </div>
    ),
);

const config = createConfig();
const logger = createLogger({ config });

const AppResolved = App({ logger, config });

export const InjectableConstants = () => <AppResolved greeting="hello, stranger" />;
