import { createRoot } from 'react-dom/client';
import './index.css';
import store from './store';
import { Provider } from 'react-redux'; 
import App from './App.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);