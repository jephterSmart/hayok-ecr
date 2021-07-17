import makeStore from "./makeStore";

const initialState={
    token: null,
    authenticated: false,
    loading: false,
    error:null,
}
export const INIT_SIGNUP = "INIT_SIGNUP";
export const ERROR_OCCUR = "ERROR_OCCUR";
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';

const AuthReducer = (state=initialState,action) => {
    const newState = JSON.parse(JSON.stringify(state))
    switch(action.type){
        case INIT_SIGNUP:
            newState.loading = true;
            newState.error = null;
            break;
        case ERROR_OCCUR:
            newState.loading = false;
            newState.error = action.error;
            break;
        case SIGNUP_SUCCESS:
            newState.loading = false;
            newState.error = null;
            break;
            default: return state
    }
    return newState;
} 

       
const [AuthProvider, useAuthStore,useAuthDispatch] = makeStore(AuthReducer,initialState);

export {AuthProvider,useAuthStore,useAuthDispatch};