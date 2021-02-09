import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';

/* 
Todo
= Design todo subtask - done
= what is the login for CRUD of subtask - done
0. Design todo task - done
1. Design Login page - done
2. add Login functionality
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

    const onChangeInput = (e) =>{
        console.log(e.target.name, e.target.value )
        if(e.target.name === 'username'){
            setUsername(e.target.value)
        }else{
            setPassword(e.target.value)
        }
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        console.log(username,password)
        if(username === 'imran' && password=== 'imran'){
            history.push('/todos');
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
