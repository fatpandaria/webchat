import {combineReducers} from 'redux';
import modalReducer, {modalsInitialState} from './modals';
const webChatInitialState = {
    modals: modalsInitialState
}

const webChatReducer = combineReducers({
    modals: modalReducer
})

export {
    webChatReducer as default,
    webChatInitialState
}