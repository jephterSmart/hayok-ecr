

export const  fetchPatients = (token,perPage,currentPage) => {
    const url = 'http://localhost:8080/user/patients';
    fetch(url,{
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