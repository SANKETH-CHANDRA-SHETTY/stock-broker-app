import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import userContext from "../context/userContext";
import API_URL from '../config';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(userContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const updateEmail = (e) => setEmail(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    const formSubmit = (e) => {
        e.preventDefault();

        fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) });
            }
            return response.json();
        })
        .then((result) => {
            localStorage.setItem("user", JSON.stringify(result.user));
            setUser(result.user);
            navigate('/home'); 
        })
        .catch((error) => {
            console.error(error.message);
            alert("Login Failed: " + error.message);
        });
    };

    const createAccount = () => {
        navigate("/signup");
    }

    return (
        <div>
        <form onSubmit={formSubmit}>
            <h2>Login</h2>
            <input type='email' value={email} placeholder='Email address' onChange={updateEmail} required/>
            <br/><br/>
            <input type='password' value={password} placeholder='Password' onChange={updatePassword} required/>
            <br/><br/>
            <button type='submit'>Log in</button>
            <br/><br/>
            <button type='button' onClick={createAccount}>Create new account</button>
        </form>
        </div>
  )
}

export default Login;