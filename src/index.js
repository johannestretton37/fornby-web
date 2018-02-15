import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader'

WebFont.load({
  google: {
    families: ['Nunito', 'Source Sans Pro', 'Libre Baskerville:400i', 'Open Sans', 'Barlow+Condensed:500']
  }
})

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
