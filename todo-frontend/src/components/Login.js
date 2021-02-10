import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {config} from './config';
/* 
Todo
= Design todo subtask - done
= what is the login for CRUD of subtask - done
0. Design todo task - done
1. Design Login page - done
2. add Login functionality-done
3. when page is refresh user should logged in
4. add Rest api for login and get JWT token and authorize subsequent api calls
5. CRUD api for todo
6. Node js setup with mongo
7. UI docker file
8. Node docker file
9. docker compose
10. Deploye on Cloude
*/

function Login() {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const history = useHistory();

    useEffect(()=>{
        const token = localStorage.getItem('token');
        console.log('token useEffect',token)
        if(token){
            // return <Redirect to='/todos'/>;
            history.push('/todos');
        }
    })
    const onChangeInput = (e) =>{
        console.log(e.target.name, e.target.value )
        if(e.target.name === 'username'){
            setUsername(e.target.value)
        }else{
            setPassword(e.target.value)
        }
    }


    const onSubmit =async (e) =>{
        e.preventDefault();
        console.log(username,password)
        if(username  && password){
            console.log('config.loginUrl ',config.loginUrl)
            const response = await fetch(config.loginUrl,{
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({username,password}) 
            })
            const data = await response.json()
            const {token} = data;
            console.log('response => ',data,token)
            if(token){
                history.push('/todos');
                localStorage.setItem('token',token);
            }else{
                alert('Username or Password is wrong')
            }
        }else{
            alert('Wrong credentials')
        }
    }

    return (
        <div className="login">
            <div className="login_container">
                <h1>Please Sign In</h1>
                <form onSubmit={onSubmit}>
                    <input name="username" type="text" onChange={onChangeInput}  value={username}/><br></br>
                    <input name="password" type="password" onChange={onChangeInput} value={password}/><br></br>
                    <button onClick={onSubmit}>Sign In</button>
                </form>
            </div>
        </div>
    )
}

export default Login
