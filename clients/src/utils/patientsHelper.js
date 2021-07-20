

export const  fetchPatients = (token,perPage,currentPage) => {
    const url = 'http://localhost:8080/user/patients';
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
        if(res.status !== 201 || res.status !== 200){
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
    return fetch(uri,{
        method:"PATCH",
        headers:{
            "Authorization":'Bearer '+ token,
            "Content-Type":'application/json'
        },
        body: JSON.stringify(formData)
    }).then(res => {
        if(res.status !== 201 || res.status !== 200){
            throw new Error("Could not update the user");
        }
        if(res.status === 422){
            throw new Error("Please fill in all the required fields");
        }
        return res.json()
    })
    .catch(err => {
        throw new Error(err.message || "Error, Try Again!!!")
    })
}
export const getAllCadre = (token,userId) => {
    let uri = 'http://localhost:8080/user/all-cadre'
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
    const url = 'http://localhost:8080/user/update-cadre';
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
        if(res.status !== 200 || res.status !== 201){
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