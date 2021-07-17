import makeStore from "./makeStore";

const initialState={
    token: null,
    userId: null,
    authenticated: false,
    loading: false,
    error:null,
    userType: null,
}
export const INIT_SIGNUP = "INIT_SIGNUP";
export const ERROR_OCCUR = "ERROR_OCCUR";
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const INIT_LOGIN = 'INIT_LOGIN';
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";

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
        case INIT_LOGIN:
            newState.loading = true;
            newState.error = null;
            newState.authenticated = false;
            newState.token = null;
            break;
        case LOGIN_SUCCESS:
            newState.loading = false;
            newState.error = null;
            newState.authenticated = true;
            newState.token = action.token;
            newState.userId = action.userId;
            newState.userType = action.userType;
            break;
        case LOGOUT:
            newState.loading = false;
            newState.error = null;
            newState.authenticated = false;
            newState.token = null;
            newState.userId = null;
            newState.userType = null;
            break;
            default: return state
    }
    return newState;
} 

       
const [AuthProvider, useAuthStore,useAuthDispatch] = makeStore(AuthReducer,initialState);

export {AuthProvider,useAuthStore,useAuthDispatch};