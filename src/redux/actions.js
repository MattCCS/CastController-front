import {CREATING_NODE, CREATED_NODE, DELETING_NODE, CREATING_LINK, DELETING_LINK, DETAIL_NODE, DETAIL_LINK} from './actionConstants';


export const createdNode = () => ({
    type: CREATED_NODE,
});


export const setCreatingNode = val => ({
    type: CREATING_NODE,
    payload: {
        node: val,
    }
})

export const setDeletingNode = val => ({
    type: DELETING_NODE,
    payload: {
        node: val,
    }
})

export const setCreatingLink = val => ({
    type: CREATING_LINK,
    payload: {
        link: val,
    }
})

export const setDeletingLink = val => ({
    type: DELETING_LINK,
    payload: {
        link: val,
    }
})

export const setDetailNode = val => ({
    type: DETAIL_NODE,
    payload: {
        node: val,
    }
})

export const setDetailLink = val => ({
    type: DETAIL_LINK,
    payload: {
        link: val,
    }
})
