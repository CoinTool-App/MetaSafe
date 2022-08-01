import React from 'react';
import { render } from 'react-dom';
import i18n from '../i18n/config';
import Popup from './Popup';
import './index.css';

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
