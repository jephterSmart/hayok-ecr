import { createContext, useContext, useReducer } from "react";

const makeStore = (reducer, initialState) => {
    const dispatchCtx = createContext(()=>{});
    const storeCtx = createContext(initialState);

    const StoreProvider = ({children}) => {
        const [store, dispatch] = useReducer(reducer,initialState);
        return(
            <dispatchCtx.Provider value={dispatch} >
                <storeCtx.Provider value={store}>
                    {children}
                </storeCtx.Provider>
            </dispatchCtx.Provider>
        )
    }
    const useDispatch = () => {
        return useContext(dispatchCtx)
    }
    const useStore = () => {
        return useContext(storeCtx);
    }
    return [StoreProvider,useStore,useDispatch];
} 
export default makeStore;