import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const updateName = (e) => setName(e.target.value);
    const updateEmail = (e) => setEmail(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    const formSubmit = (e) => {
        e.preventDefault();

        fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: name, email: email, password: password }),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) });
            }
            return response.json();
        })
        .then((result) => {
            alert("Signup Successful! Please Login.");
            navigate('/login'); 
        })
        .catch((error) => {
            console.error(error.message);
            alert("Signup Failed: " + error.message);
        });
    };

    const haveAccount = () => {
        navigate("/login"); // FIXED: Was navigating to /signup
    }

    return (
        <div>
        <form onSubmit={formSubmit}>
            <h2>Sign Up</h2>
            <input type='text' value={name} placeholder='Name' onChange={updateName} required/>
            <br/><br/>
            <input type='email' value={email} placeholder='Email address' onChange={updateEmail} required/>
            <br/><br/>
            <input type='password' value={password} placeholder='Password' onChange={updatePassword} required/>
            <br/><br/>
            <button type='submit'>Sign up</button>
            <br/><br/>
            <button type='button' onClick={haveAccount}>Already have an account?</button>
        </form>
        </div>
  )
}

export default Signup;