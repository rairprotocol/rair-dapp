import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType
} from 'react-router-dom';
import { BrowserTracing } from '@sentry/browser';
import { init, reactRouterV6Instrumentation } from '@sentry/react';
import { OreId } from 'oreid-js';
import { OreidProvider } from 'oreid-react';
import { WebPopup } from 'oreid-webpopup';

import App from './App';
import store from './ducks';

import { GlobalModalStateProvider } from './providers/ModalProvider/ModalProvider';

import './index.css';

const oreId = new OreId({
  appId: 'p_cb4434e5eb4e42e9862cabd0b305dbd2',
  plugins: { popup: WebPopup() }
});
oreId.init();

const sentryIoTraceRate = Number(process.env.REACT_APP_SENTRY_IO_TRACE_RATE);

if (process.env.REACT_APP_SENTRY_ENABLED) {
  init({
    release: process.env.REACT_APP_SENTRY_RELEASE,
    dsn: process.env.REACT_APP_SENTRY_IO_ENDPOINT,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        )
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
        <BrowserRouter>
          <GlobalModalStateProvider>
            <OreidProvider oreId={oreId}>
              <App />
            </OreidProvider>
          </GlobalModalStateProvider>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
