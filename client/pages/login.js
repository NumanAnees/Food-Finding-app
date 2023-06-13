import { useState, useEffect, Fragment } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
// import { API,APP_NAME} from '../config';
import { authenticate, isAuth } from "../helpers/auth";
import Head from "next/head";
//google auth....
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Login"} | {APP_NAME}
      </title>
      <link rel="shortcut icon" href="/static/icons/favicon.ico" />
      <meta
        name="description"
        content={`top meal,meal,best meal,meal 's ratings,Best meal,top 10 best meal,Best restaurant for meal,best meal in pakistan,best meal in lahore`}
      />
      <meta property="og:title" content={APP_NAME} />
      <meta property="title" content={APP_NAME} />
      <meta property="og:description" content={`Find best meal in your area`} />
      <link rel="stylesheet" href="/static/styles/style.css" />

      {/* logo here */}
    </Head>
  );
  const [state, setState] = useState({
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Login",
  });
  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const { email, password, error, success, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Login",
    });
  };
  const handleSuccess = async (Response) => {
    const jwt_credentials = Response.credential;
    try {
      const response = await axios.post(`${API}/user/google-auth`, {
        jwt_credentials,
      });
      console.log(response);
      authenticate(response, () => {
        return isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user");
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
      setState({
        ...state,
        buttonText: "Login",
        error: error.response.data.error,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Logging in" });
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });
      // console.log(response);
      authenticate(response, () => {
        return isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user");
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: "Login",
        error: error.response.data.error,
      });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-light">Email</label>
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          placeholder="Type your email..."
          required
        />
      </div>
      <div className="form-group">
        <label className="text-light">Password</label>
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Type your password..."
          required
        />
      </div>
      <div className="form-group text-center mt-4 mb-4">
        <button className="btn btn1">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <GoogleOAuthProvider clientId="945436301366-0q01dq64p28n4nuv7t4k7qd7q0cs6ipt.apps.googleusercontent.com">
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <div className="col-md-6 offset-md-3 form-set">
            <h1 className="text-light text-center m-nav2 text-uppercase text-span">
              Login <span className="text-span">Here</span>
            </h1>
            <div className="google-signIn">
              <GoogleLogin
                onSuccess={(Response) => handleSuccess(Response)}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
            <ToastContainer />
            {loginForm()}
          </div>
        </div>
      </Layout>
    </GoogleOAuthProvider>
  );
};

export default Login;
