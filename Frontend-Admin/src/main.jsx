import React from 'react'
import App from './App.jsx';
import { store } from './store/store';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import Ant Design styles
// import 'antd/dist/reset.css';

const root = ReactDOM.createRoot(document.getElementById('__admin_panel'));
  root.render(
      <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
      </BrowserRouter>
  );
