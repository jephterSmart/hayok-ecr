

export const  fetchPatients = (token,perPage,currentPage,queryString) => {
    
    let url = 'http://localhost:8080/user/patients';
    
    if(queryString)
    url = url + queryString;
    return fetch(url,{
        method:"GET",
        headers:{
            "Authorization": 'Bearer ' + token,
            "PerPage": perPage,
            "CurrentPage": currentPage
        }
    }).then(res => {
        if (res.status !== 200) {
            throw new Error('Failed to fetch Patients.');
          }
          return res.json();
    }).then(data => {
        console.log(data);
        return data;
    }).catch(err => {throw err})
}

export const postFormData = (token,formData,cb) => {
    const uri = 'http://localhost:8080/user/add-patient';
   fetch(uri,{
        method:"POST",
      headers:{
          "Content-Type":'application/json',
          "Authorization": 'Bearer '+ token
      },
        body:JSON.stringify(formData)
    }).then(res => {
        if(res.status === 422){
            throw new Error('Please fill in all the form data required')
        }
        if(res.status !== 201 ){
            throw new Error('Make sure every thing is fill and check your network');
        }
        
        return res.json();
    })
    .then(data => {
        
        cb(null, data);
    })
    .catch(err => {
        cb(new Error(err.message || "A server Error",null));
    })
}

export const updatePatientInfo = (token,patientId,formData) => {
    const url = 'http://localhost:8080/user/patients/'+patientId;
    return fetch(url,{
        method:"PATCH",
        headers:{
            "Authorization":'Bearer '+ token,
            "Content-Type":'application/json'
        },
        body: JSON.stringify(formData)
    }).then(res => {
        if(res.status === 422){
            throw new Error("Please fill in all the required fields");
        }
        
        if(res.status !== 200){
            throw new Error("Could not update the user");
        }
        
        return res.json()
    })
    
    .catch(err => {
        throw new Error(err.message || "Error, Try Again!!!")
    })
}
export const getAllCadre = (token,userId) => {
    let uri = 'http://localhost:8080/employees/all'
    return fetch(uri,{
        headers:{
           "Authorization": 'Bearer '+ token 
        },
        method:"GET"
    }).then(res =>{
        if(res.status !==200){
            throw new Error('Could not get doctors, try again')
        }
        return res.json();
    })
    .then(data => {
        console.log(data)
        return data.employees.filter(employee => employee._id.toString() !== userId.toString())
    })
    .catch(err => {
        console.log(err);
        throw new Error(err.message || "Try and reload the page and check network.")
    })
}
export const updateCadreAndPatientInfo = (token,fromId,toId,patientId) => {
    const url = 'http://localhost:8080/employees/update-cadre';
    return fetch(url,{
        method:'PATCH',
        headers:{
            "Authorization":'Bearer '+ token,
            "Content-Type":'application/json'
        },
        body: JSON.stringify({fromId,toId,patientId})
    })
    .then(res => {
        if(res.status === 404){
            throw new Error('Doctor is not available');
        }
        if(res.status !== 201){
            throw new Error("Message Not sent")
        }
        return res.json();
    })
    .then(data => {
        console.log(data)
        return data;
    })
    .catch(err => {
        console.log(err);
        throw new Error(err.message || 'Check your network and Resend again');
    })
}



export const getNotifications = (token) => {
    const url = 'http://localhost:8080/employees/notifications';
    return fetch(url,{
        method:"GET",
        headers:{
            "Authorization":"Bearer "+token
        }
    }).then(res => {
        if(res.status !== 200){
            throw new Error("Could not fetch notifications");
        }
        return res.json();
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}
export const updateNotification = (token,seen,notId) => {
    const url = 'http://localhost:8080/employees/' + notId;
    return fetch(url,{
        method:"PATCH",
        headers:{
            "Authorization": "Bearer "+token,
            "Content-Type":'application/json'
        },
        body:JSON.stringify({seen})
    })
    .then(res => {
        if(res.status !== 200 ){
            console.log(res.status)
            throw new Error("You are not a valid user");
        }
        return res.json();
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

export const getUserData = (token) => {
    const url = 'http://localhost:8080/user/patient';
    return fetch(url,{
        method:"GET",
        headers:{
            "Authorization": 'Bearer ' + token
        }
    }).then(res => {
        if (res.status !== 200) {
            throw new Error('Failed to fetch Patients.');
          }
          return res.json();
    }).then(data => {
        console.log(data);
        return data.profile;
    }).catch(err => {throw err})
}

export const getMessages =(token,from,to,userType) => {
    const url = `http://localhost:8080/info/message/${from}/${to}/${userType}`
    return fetch(url,{
        headers:{
            "Authorization":'Bearer '+token
        },
        method: "GET"
    })
    .then(res => {
        if(res.status !== 200){
            throw new Error('Could not fetch messages');
        }
        return res.json()
    })
    .then(data => {
        console.log(data);
        return data.messages;
    })
    .catch(err => {
        throw err;
    })

}

export const sendMessage = (token,from,to,userType,message) => {
    console.log(userType)
    const url = 'http://localhost:8080/info/message';
    return fetch(url,{
        method:"POST",
        headers:{
            "Authorization":'Bearer ' + token,
            "Content-Type":'application/json',
        },
        body: JSON.stringify({
            fromId:from,toId:to,message:message,fromType:userType
        })
    })
    .then( res => {
        if(res.status !== 201){
            console.log(res.status)
            throw new Error("Could not send message");
        }
        return res.json();
    })
    .then(data => {
        return data.sentMessage
    })
    .catch(err => {
        throw err;
    })
    
}

export const changeMessageStatus = (token,fromId,toId,fromType,seen) => {
    let url = 'http://localhost:8080/info/message';
    return fetch(url,{
        method:"PATCH",
        headers:{
            "Authorization": 'Bearer ' + token,
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({
            fromId,toId,fromType,seen
        })
    })
    .then(res => {
        if(res === 401){
            throw new Error("This message is no longer in our database")
        }
        if(res !== 200){
            throw new Error("An error occured");
        }
        return res.json();
    })
    .then(result => {
        return result.data;
    })
    .catch(err => {
        throw err;
    })
} 

export const getMyMessage = (token,fromId,userType) => {
    const url = 'http://localhost:8080/info/messages/'+fromId +'/'+userType;
    return fetch(url,{
        method:"GET",
        headers:{
            "Authorization":"Bearer "+ token
        }  
    })
    .then( res => {
        if(res.status === 302) {
            return {
                messages: []
            }
        }
        if(res.status !== 200){
            throw new Error('Sorry could not fetch you unseen messages');
        }
        return res.json();
    })
    .then(result => {
        return result.messages
    })
    .catch(err => {
        throw err;
    })
}