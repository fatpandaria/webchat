const OPEN_MODAL=Symbol('webchat/modals/OPEN_MODAL'); // use symbol may be better?
const CLOSE_MODAL=Symbol('webchat/modals/CLOSE_MODAL');

// const MODAL_VIDEO_CHAT_INVITATION='videoChatInvitation';
const MODAL_VIDEO_CHAT_INVITATION= Symbol('videoChatInvitation');

const initialState = {
    [MODAL_VIDEO_CHAT_INVITATION]: false
}

const reducer = (state, action) => {
    if(typeof state === 'undefined') state = initialState;
    switch(action.type){
        case OPEN_MODAL:
            return Object.assign({},state,{
                [action.modal]:true
            });
        case CLOSE_MODAL:
            return Object.assign({},state,{
                [action.modal]:false
            });
        default:
            return state;
    }
}

const openModal = (modal) => { // action creator
    return { // return a new creator object every time called
        type: OPEN_MODAL,
        modal: modal
    };
};

const closeModal = (modal) => {
    return {
        type: CLOSE_MODAL,
        modal: modal
    }
}
const openVideoInvitationModal = () => {
    return openModal(MODAL_VIDEO_CHAT_INVITATION);
}
const closeVideoInvitationModal = () => {
    return closeModal(MODAL_VIDEO_CHAT_INVITATION);
}

export {
    reducer as default,
    initialState as modalsInitialState,
    openVideoInvitationModal,
    closeVideoInvitationModal
}
