import { useState, useEffect, Fragment } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
// import { API,APP_NAME} from '../config';
import { authenticate, isAuth } from "../helpers/auth";
import Head from "next/head";

const Landing = () => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Landing"} | {APP_NAME}
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




  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
        <div className="col-md-6 offset-md-3">
            <h1 className="text-light text-center m-nav2 text-uppercase text-span">
              Landing <span className="text-span">Page</span>
            </h1>   
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export default Landing;
