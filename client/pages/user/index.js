import Layout from "../../components/Layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import moment from "moment";
// import { API,APP_NAME } from '../../config';
import { getCookie } from "../../helpers/auth";
import withUser from "../withUser";
import { EyeFilled } from "@ant-design/icons";
import Head from "next/head";

const User = ({ user, userLinks, token }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"User Dashboard"} | {APP_NAME}
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
  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete > ', slug);
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    console.log("delete link > ", id);
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("LINK DELETE SUCCESS ", response);
      Router.replace("/user");
    } catch (error) {
      console.log("LINK DELETE ", error);
    }
  };

  const listOfLinks = () =>
    userLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2 primary-link">
        <div className="col-md-8">
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url.substring(0, 50)}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>

        <div
          className="col-md-12 mt-1"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <div className="text-center">
            <span className="badge text-dark">
              {l.price} Rupees / GST {l.gst}
            </span>
            <span className="badge text-success">{l.category.name}</span>
          </div>
          <Link href={`/user/link/${l._id}`}>
            <button
              style={{ fontSize: "13px" }}
              className="btn btn-success text-light ml-4 mr-2 pl-2 pr-2 pull-right"
            >
              <span>Update</span>
            </button>
          </Link>
          <button
            onClick={(e) => confirmDelete(e, l._id)}
            className="btn btn-danger text-light mr-2 p-1 text-danger pull-right"
          >
            <span>Delete</span>
          </button>
          <span
            className="text-secondary pull-left ml-auto"
            style={{ marginRight: "10.7rem", fontSize: "13px" }}
          >
            <EyeFilled /> {l.clicks}
          </span>
        </div>
      </div>
    ));

  return (
    <>
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <h1 className="text-light m-nav2 text-span5">
            <span className="text-span">{user.name}</span> 's Dashboard{" "}
            <span className="text-span">/{user.role}</span>
          </h1>
          <hr />

          <div className="row">
            <div className="col-md-4 marg-b-pages">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link href="/user/link/create">
                    <a className="nav link text-light">• Submit a Location</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/user/profile/update">
                    <a className="nav link text-light">• Update Profile</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-8">
              <h2 className="text-light marg-2 text-span5 text-uppercase">
                All Locations you have added
              </h2>
              {listOfLinks()}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default withUser(User);
