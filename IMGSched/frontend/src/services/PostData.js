import 'semantic-ui-css/semantic.min.css'
export function PostData(type, userData) {

 
    let BaseURL = 'http://127.0.0.1:8000/meeting/users/';
    
    return new Promise((resolve, reject) =>{
    fetch(BaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        body: JSON.stringify(userData)
    })
    .then((response) => response.json())
    .then((res) => {
        resolve(res);
    })
    .catch((error) => {
       reject(error);
    });
    
    });
    }