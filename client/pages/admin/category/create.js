import dynamic from 'next/dynamic';
const ReactQuill = dynamic(()=>import("react-quill"),{ssr:false});
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.snow.css';


const Create = ({ user, token }) => {
    const [state, setState] = useState({
        name: '',
        url: "",
        error: '',
        success: '',
        buttonText: 'Create',
    });
    const [content,setContent] = useState(""); 
    const { name,url, success, error, buttonText } = state;

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Creating' });
        try {
            const response = await axios.post(`${API}/category`,{name,content,url}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('CATEGORY CREATE RESPONSE', response);
            setState({
                ...state,
                name: '',
                content: '',
                url: '',
                buttonText: 'Created',
                success: `${response.data.name} is created`
            });
        } catch (error) {
            console.log('CATEGORY CREATE ERROR', error);
            setState({ ...state, name: '', buttonText: 'Create', error: error.response.data.error });
        }
    };

      const handleContent = e => {
        console.log(e);
        setContent(e);
        setState({ ...state, success: '', error: '' });
    };

    const createCategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" required />
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                 <ReactQuill
                    value={content}
                    onChange={handleContent}
                    placeholder="Write something..."
                    theme="snow"
                    className="pb-5 mb-3"
                    style={{ border: '1px solid #666' }}
                />            </div>
              <div className="form-group">
                <label className="text-muted">Image Url</label>
                <input onChange={handleChange('url')} value={url} className="form-control" required />
            </div>
            <div>
                <button className="btn btn-outline-dark">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Create category</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {createCategoryForm()}
                </div>
            </div>
        </Layout>
    );
};

export default withAdmin(Create);
