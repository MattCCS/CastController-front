import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";

import {CREATING_NODE, CREATED_NODE, DELETING_NODE, CREATING_LINK, DELETING_LINK, DETAIL_NODE, DETAIL_LINK} from './actionConstants';

const INITIAL_STATE = {
    // modal states
    creatingNode: null,
    deletingNode: null,
    detailNode: null,
    creatingLink: null,
    deletingLink: null,
    detailLink: null,
}

const rootReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CREATING_NODE:
            return {...state, creatingNode: action.payload.node}
        case DELETING_NODE:
            return {...state, deletingNode: action.payload.node}
        case DETAIL_NODE:
            return {...state, detailNode: action.payload.node}
        case CREATING_LINK:
            return {...state, creatingLink: action.payload.link}
        case DELETING_LINK:
            return {...state, deletingLink: action.payload.link}
        case DETAIL_LINK:
            return {...state, detailLink: action.payload.link}
        default:
            return state
    }
}

export default createStore(rootReducer, applyMiddleware(thunkMiddleware));
