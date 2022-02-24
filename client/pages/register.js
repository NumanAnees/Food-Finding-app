import { useState,useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API,APP_NAME} from '../config';
import {authenticate, isAuth} from "../helpers/auth"
import Router from 'next/router';
import Head from 'next/head';
const Register = () => {
     const head = () => (
        <Head>
            <title>
             {"Register"} |  {APP_NAME}
            </title>
            <link rel="shortcut icon" href="/static/icons/favicon.ico" />
            <meta name="description" content={`top meal,meal,best meal,meal 's ratings,Best meal,top 10 best meal,Best restaurant for meal,best meal in pakistan,best meal in lahore`} />
            <meta property="og:title" content={APP_NAME} />
            <meta property="title" content={APP_NAME} />
            <meta property="og:description" content={`Find best meal in your area`}/>
            {/* logo here */}
        </Head>
    );
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Register'
    });
    const { name, email, password, error, success, buttonText } = state;
    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Register' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Registering' });
        try {
            const response = await axios.post(`${API}/register`, {
                name,
                email,
                password
            });
            console.log(response);
            setState({
                ...state,
                name: '',
                email: '',
                password: '',
                buttonText: 'Submitted',
                success: response.data.message
            });
        } catch (error) {
            console.log(error);
            setState({ ...state, buttonText: 'Register', error: error.response.data.error });
        }
    };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    value={name}
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    placeholder="Type your name"
                    required
                />
            </div>
            <div className="form-group">
                <input
                    value={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    placeholder="Type your email"
                    required
                />
            </div>
            <div className="form-group">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
                    required
                />
            </div>
            <div className="form-group">
                <button className="btn btn-outline-dark">{buttonText}</button>
            </div>
        </form>
    );

    return (
    <>
        {head()}
        <Layout>
            <div className="container pt-5 pb-5">
            <div className="col-md-6 offset-md-3">
                <h1>Register</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {registerForm()}
            </div>
            </div>
        </Layout>
        </>
    );
};

export default Register;
