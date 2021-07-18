

export const  fetchPatients = (token,perPage,currentPage) => {
    const url = 'http://localhost:8080/user/patients';
    return fetch(url,{
        method:"GET",
        headers:{
            Authorization: 'Bearer ' + token,
            PerPage: perPage,
            CurrentPage: currentPage
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

export const postFormData = (token,formData) => {
    const uri = 'http://localhost:8080/user/add-patient';
   return fetch(uri,{
        method:"POST",
        Authorization: 'Bearer '+ token,
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
        return data
    })
    .catch(err => {
        throw new Error(err.message || "A server Error")
    })
}