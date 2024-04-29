import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import store from './ducks';

import { GlobalModalStateProvider } from './providers/ModalProvider/ModalProvider';
const sentryIoTraceRate = Number(import.meta.env.VITE_SENTRY_IO_TRACE_RATE);
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType
} from 'react-router-dom';
import { BrowserTracing } from '@sentry/browser';
import { init, reactRouterV6Instrumentation } from '@sentry/react';

import App from './App';

import './index.css';

if (import.meta.env.VITE_SENTRY_ENABLED) {
  init({
    release: import.meta.env.VITE_SENTRY_RELEASE,
    dsn: import.meta.env.VITE_SENTRY_IO_ENDPOINT,
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

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalModalStateProvider>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </GlobalModalStateProvider>
    </Provider>
  </React.StrictMode>
);
