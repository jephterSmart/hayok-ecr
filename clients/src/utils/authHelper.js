import { INIT_SIGNUP,ERROR_OCCUR, SIGNUP_SUCCESS, useAuthDispatch,
  LOGIN_SUCCESS,INIT_LOGIN } from "../store/authStore";


export const signUpHandler  = (dispatch,e) => {
  
    let signupUrl = 'http://localhost:8080/auth/signup';
            let body = {};
            for(let eleIn=0; eleIn < e.target?.elements.length; eleIn++){
                    if(!e.target.elements[eleIn].name) continue;
                    body[e.target.elements[eleIn].name] = e.target.elements[eleIn].value
            }
            
            dispatch({type:INIT_SIGNUP});
            
            fetch(signupUrl,{
                      method: 'PUT',
                      headers:{
                        'Content-Type': 'application/json'},
                      body:JSON.stringify(body) } )
                      .then(res => {
                          
                      if (res.status === 422) {
                        dispatch({
                            type: ERROR_OCCUR,
                            error: {
                                message: "Email Already Exists"
                            }
                        })
                        throw new Error("Email Already Exists");
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
                        throw new Error("An Error Occured");
                      }
                        return res.json();
                    
                      } )
                      .then(data => {
                              console.log(data);
                              //then dispatch signup successful
                                dispatch({
                                    type:SIGNUP_SUCCESS
                                })
                                e.target.reset();
                                window.location.replace('/auth/login');
                          }
                         
                      ).catch(err => {
                            //dispatch that an error occur
                    //of server error
                    err.message= err.message || 'An Error occured on the server';
                    dispatch({
                        type: ERROR_OCCUR,
                        error: err
                    })
                      })
       
}

export const doctorLoginHandler = (dispatch,e) => {
  let url = 'http://localhost:8080/auth/login';
  
  let body ={};
  for(let eleIn=0; eleIn < e.target?.elements.length; eleIn++){
    if(!e.target.elements[eleIn].name) continue;
    body[e.target.elements[eleIn].name] = e.target.elements[eleIn].value
  }
  dispatch({type:INIT_LOGIN});
            
  fetch(url,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'},
        body:JSON.stringify(body) } )
        .then(res => {
            
        if (res.status === 422) {
          dispatch({
              type: ERROR_OCCUR,
              error: {
                  message: "Please Enter a valid Email"
              }
          })
          throw new Error("Enter a valid Email");
        }
        if(res.status===401){
          dispatch({
            type: ERROR_OCCUR,
            error: {
                message: "Credentials do not match "
            }
        })
        throw new Error("Credentials do not match");
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
          throw new Error("An Error Occured");
        }
          return res.json();
      
        } )
        .then(data => {
                console.log(data);
                //then dispatch signup successful
                  dispatch({
                      type:LOGIN_SUCCESS,
                      token: data.token,
                      userId: data.userId
                  })
                  //after successful login add to local storage, so that on page reload we don't loose
                  //tokens and information.

                  window.localStorage?.setItem("userId",data.userId.toString());
                  window.localStorage?.setItem("user Token", data.token.toString());
                  e.target.reset();
                  window.location.replace('/');
            }
            
        ).catch(err => {
              //dispatch that an error occur
      //of server error
      err.message= err.message || 'An Error occured on the server';
      dispatch({
          type: ERROR_OCCUR,
          error: err
      })
        })



}