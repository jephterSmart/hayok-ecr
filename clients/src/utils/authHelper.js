import { INIT_SIGNUP,ERROR_OCCUR, SIGNUP_SUCCESS } from "../store/authStore";
export const signUpHandler  = (dispatch,e) => {
    let signupUrl = 'http://loacalhost:8080/signup';
            let body = {};
            for(let eleIn=0; eleIn < e.target?.elements.length; eleIn++){
                    body[e.target.elements[eleIn].name] = e.target.elements[eleIn].value
            }
            console.log(body);
            dispatch({type:INIT_SIGNUP});
                try{
                    let res = fetch(signupUrl,{
                      method: 'PUT',
                      headers:{
                        'Content-Type': 'application/json'},
                      body:JSON.stringify(body) } );
        
                      if (res.status === 422) {
                        dispatch({
                            type: ERROR_OCCUR,
                            error: {
                                message: "Email Already Exists"
                            }
                        })
                        return;
                      }
                      if (res.status !== 200 && res.status !== 201) {
                        console.log('Error!');
                        //dispatch that an ERROR OCCUR with the error payload
                        //of A server error
                        dispatch({
                            type: ERROR_OCCUR,
                            error: {
                                message: "An Error Occured"
                            }
                        })
                        return;
                      }
                       let data = res.json();
                       console.log(data)
                       //then dispatch signup successful
                      dispatch({
                          type:SIGNUP_SUCCESS
                      })
                      
                }
                catch (err){
                    //dispatch that an error occur
                    //of server error
                    err.message= err.message || 'An Error occured on the server';
                    dispatch({
                        type: ERROR_OCCUR,
                        error: err
                    })
                    return;
                }
       
       
}