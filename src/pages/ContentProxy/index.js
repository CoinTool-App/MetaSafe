import ProxyEthereum from './ProxyEthereum';
import React from 'react';
import ReactDOM from "react-dom";
import { WRAPPER_CLASS_NAME } from './utils.js'
const rootElement = document.getElementById(WRAPPER_CLASS_NAME);
ReactDOM.render(
    <ProxyEthereum />,
    rootElement
);
