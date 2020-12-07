import * as React from 'react';
import * as ReactDOM from "react-dom";
import { App } from "./components/App";

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('__app');
  ReactDOM.render(<App />, node);
});