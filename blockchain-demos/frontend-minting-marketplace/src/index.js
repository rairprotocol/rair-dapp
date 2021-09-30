import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import './index.css';
import App from './App';

import rootSaga from "./ducks/sagas"; // saga
import configureStore from "./ducks";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const { store, sagaMiddleware } = configureStore();
sagaMiddleware.run(rootSaga);

if (process.env.REACT_APP_SENTRY_ENABLED) {
	console.log(process.env.REACT_APP_SENTRY_ENABLED);
	Sentry.init({
		dsn: process.env.REACT_APP_SENTRY_IO_ENDPOINT,
		integrations: [new Integrations.BrowserTracing()],

		// We recommend adjusting this value in production, or using tracesSampler
		// for finer control
		tracesSampleRate: process.env.REACT_APP_SENTRY_IO_TRACE_RATE,
	});
}

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);