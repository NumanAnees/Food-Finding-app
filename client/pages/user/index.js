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
import Button from "@mui/material/Button";
import UpdateIcon from "@mui/icons-material/Update";
import SendIcon from "@mui/icons-material/Send";
import PublishIcon from "@mui/icons-material/Publish";
import PaidIcon from "@mui/icons-material/Paid";
import StripeCheckout from "react-stripe-checkout";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [totalAmount, setTotalAmount] = useState(500);
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
  const onToken = async (token, id) => {
    const reqObj = {
      linkId: token,
    };

    const res = await axios
      .put(`${API}/link/setIsPayed/${token}`)
      .then((res) => {
        console.log("res", res);
        toast.success("Payment Successful");
      })
      .catch(
        (err) => {
          toast.error("Payment Failed");
          console.log("err", err);
        }
        // Router.push("/user");
      );
  };

  const listOfLinks = () =>
    userLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2 ml-1 primary-link">
        <div className="col-md-8">
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url.substring(0, 50)}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          {!l.isPayed && (
            <span className="pull-right">
              <StripeCheckout
                token={() => onToken(l._id)}
                shippingAddress
                billingAddress={true}
                currency="pkr"
                amount={totalAmount * 100}
                stripeKey="pk_test_51K8lJeSGkXsHpk6s64EtVo37lQmikIps217LhE2fmpwRMj2Ro0iKQvYXcFkMBHjjM4Z6BC5uvxV8XsTbKQFfbQ5y000eSg9RUb"
              >
                <Button variant="contained" endIcon={<PaidIcon />} color="info">
                  Promote
                </Button>
              </StripeCheckout>
            </span>
          )}
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
        <ToastContainer />
        <div className="container pt-5 pb-5 bg-col">
          <h1 className="text-light m-nav2 text-span5">
            <span className="text-span">{user.name}</span> 's Dashboard{" "}
            <span className="text-span">/{user.role}</span>
          </h1>
          <hr />

          <div className="row">
            <div
              className="col-md-4 marg-b-pages"
              style={{ borderRight: "2px solid grey" }}
            >
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Button
                    href="/user/link/create"
                    endIcon={<PublishIcon />}
                    variant="contained"
                    color="info"
                    sx={{ width: "60%", ":hover": { color: "white" } }}
                  >
                    Submit a Location
                  </Button>
                </li>
                <li className="nav-item">
                  <Button
                    href="/user/profile/update"
                    endIcon={<UpdateIcon />}
                    variant="contained"
                    color="error"
                    sx={{ width: "60%", ":hover": { color: "white" } }}
                  >
                    Update Profile
                  </Button>
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
