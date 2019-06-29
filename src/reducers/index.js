import {applyMiddleware, compose, combineReducers} from 'redux';
import modalReducer, {modalsInitialState} from './modals';
const webchatInitialState = {
    modals: modalsInitialState
}

const webchatReducer = combineReducers({
    modals: modalReducer
})

export {
    webchatReducer as default,
    webchatInitialState
}