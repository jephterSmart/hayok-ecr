import makeStore from "./makeStore";

const initialState={
    token: null,
    authenticated: false
}
const AuthReducer = (state=initialState,action) => {
    const newState = JSON.parse(JSON.stringify(state))
    switch(action.type){
        case "AUTHENTICATE":
            newState.token =action.token;
            newState.authenticated = true;
            break;
            default: return state
    }
    return newState;
} 
const [AuthProvider, useAuthStore,UseAuthDispatch] = makeStore(AuthReducer,initialState);

export {AuthProvider,useAuthStore,UseAuthDispatch};