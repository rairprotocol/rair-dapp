import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';

import { init, reactRouterV5Instrumentation } from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import store from './ducks';

const sentryHistory = createBrowserHistory();

const sentryIoTraceRate = Number(process.env.REACT_APP_SENTRY_IO_TRACE_RATE);

if (process.env.REACT_APP_SENTRY_ENABLED) {
  init({
    release: process.env.REACT_APP_SENTRY_RELEASE,
    dsn: process.env.REACT_APP_SENTRY_IO_ENDPOINT,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: reactRouterV5Instrumentation(sentryHistory)
      })
    ],
    tracesSampleRate: Number.isNaN(sentryIoTraceRate)
      ? undefined
      : sentryIoTraceRate
  });
}

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App sentryHistory={sentryHistory} />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
