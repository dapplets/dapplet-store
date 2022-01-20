import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages';
import reportWebVitals from './reportWebVitals';

import './index.scss';
import { Provider } from "react-redux";
import store from "./models";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
