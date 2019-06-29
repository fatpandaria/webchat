import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import WebChat from './containers/WebChat';
import webChatReducer from './reducers/index';
import * as serviceWorker from './serviceWorker';
const store = createStore(webChatReducer);

ReactDOM.render(<Provider store={store}><WebChat /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
