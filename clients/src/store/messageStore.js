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
               const message = newState.find(ele => ele._id.toString() === action.messageId.toString());
               if(!message) return state;
               const messageInd = newState.findIndex(ele => ele._id.toString() === action.messageId.toString());
               message.seen = Boolean(action.seen)
                newState[messageInd] = message;
                console.log(newState);
                break;
            default: return state;
    }
    return newState;
} 

       
const [MessageProvider, useMessageStore,useMessageDispatch] = makeStore(MessageReducer,initialState);

export {MessageProvider, useMessageStore,useMessageDispatch};