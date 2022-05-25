//@ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import './index.css';
import App from './App';

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { createBrowserHistory } from "history";
import { HelmetProvider } from "react-helmet-async";
import store from "./ducks";

const sentryHistory = createBrowserHistory();

if (process.env.REACT_APP_SENTRY_ENABLED) {
  Sentry.init({
    release: process.env.REACT_APP_SENTRY_RELEASE,
    dsn: process.env.REACT_APP_SENTRY_IO_ENDPOINT,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation:
          Sentry.reactRouterV5Instrumentation(sentryHistory),
      }),
    ],
    tracesSampleRate: process.env.REACT_APP_SENTRY_IO_TRACE_RATE
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
  document.getElementById("root")
);
