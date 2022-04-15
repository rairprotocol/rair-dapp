//@ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import './index.css';
import App from './App.jsx';
import rootSaga from "./ducks/sagas"; // saga
import configureStore from "./ducks";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { createBrowserHistory } from 'history';
const sentryHistory = createBrowserHistory();

const { store, sagaMiddleware } = configureStore();
sagaMiddleware.run(rootSaga);

if (process.env.REACT_APP_SENTRY_ENABLED) {
	Sentry.init({
		release: process.env.REACT_APP_SENTRY_RELEASE,
		dsn: process.env.REACT_APP_SENTRY_IO_ENDPOINT,
		integrations: [
			new Integrations.BrowserTracing({
				routingInstrumentation: Sentry.reactRouterV5Instrumentation(sentryHistory)
			})],
		tracesSampleRate: process.env.REACT_APP_SENTRY_IO_TRACE_RATE,
	});
}

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App sentryHistory={sentryHistory} />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);