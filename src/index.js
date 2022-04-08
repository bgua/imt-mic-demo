import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import {IntlProvider } from 'react-intl';
import messages_zh from './locales/zh.json';
import messages_en from './locales/en.json';

const container = document.getElementById('root');
const root = createRoot(container);

const locale = navigator.language.split(/[-_]/)[0]
const messages = {
    'en': messages_en,
    'zh': messages_zh
}

root.render(
  <React.StrictMode>
    <IntlProvider locale={locale} messages={messages[locale]}>
      <ReactNotifications />
      <App />
    </IntlProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
