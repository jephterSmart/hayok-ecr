import makeStore from "./makeStore";

const initialState = [];

export const INIT_MESSAGE = "INIT_MESSAGE";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";
export const UPDATE_STATUS = "UPDATE_STATUS";

const MessageReducer = (state=initialState,action) => {
    let newState = JSON.parse(JSON.stringify(state))
    switch(action.type){
            case INIT_MESSAGE:
                newState= action.messages;
                break;
            case UPDATE_MESSAGE:
                newState.push(action.message);
                break;
            case UPDATE_STATUS:
               const message = newState.find(ele => ele.from.toString() === action.from.toSting());
               if(!message) return state;
               const messageInd = newState.findIndex(ele => ele.from.toString() === action.from.toSting());
               message.seen = action.seen
                newState[messageInd] = message;
                break;
            default: return state;
    }
    return newState;
} 

       
const [MessageProvider, useMessageStore,useMessageDispatch] = makeStore(MessageReducer,initialState);

export {MessageProvider, useMessageStore,useMessageDispatch};