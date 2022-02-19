import { useState,useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import {authenticate, isAuth,updateUser} from "../../../helpers/auth"
import Router from 'next/router';
import withUser from '../../withUser';
import Layout from '../../../components/Layout';


const Update = ({token,user}) => {
    const [state, setState] = useState({
        name: user.name,
        email: user.email,
        password: user.password,
        error: '',
        success: '',
        buttonText: 'Update'
    });
    const { name, email, password, error, success, buttonText } = state;
    console.log("my user",user);
    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Update' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Updating' });
        try {
           const response = await axios.put(`${API}/user`,{name,password},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            updateUser(response.data,()=>{
                setState({
                ...state,
                name: '',
                email: '',
                password: '',
                buttonText: 'Updated',
                success: "Update successfull"
            });
            })
         
        } catch (error) {
            console.log(error);
            setState({ ...state, buttonText: 'Update', error: "Cannot update profile" });
        }
    };

    const UpdateForm = () => (
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
                    disabled
                />
            </div>
            <div className="form-group">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
                
                />
            </div>
            <div className="form-group">
                <button className="btn btn-outline-dark">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1>Update</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {UpdateForm()}
            </div>
        </Layout>
    );
};

export default withUser(Update);
