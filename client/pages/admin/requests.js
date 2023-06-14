import { useState, useEffect, Fragment } from "react";
import Layout from "../../components/Layout";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../helpers/alerts";
// import { API,APP_NAME} from '../config';
import { authenticate, isAuth } from "../../helpers/auth";
import Head from "next/head";
import { Button, Space, Table, Tag } from "antd";
import withAdmin from "../withAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Landing = () => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const head = () => (
    <Head>
      <title>
        {"Registration Requests"} | {APP_NAME}
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
  const [state, setState] = useState([]);
  const helper = (res) => {
    const data = [];
    res.map((item) => {
      data.push({
        key: item._id,
        name: item.name,
        email: item.email,
        location: (
          <a href={item.location} target="_blank">
            Open Location
          </a>
        ),
        certificate: (
          <a href={item.document} target="_blank">
            Open Location
          </a>
        ),
        tags: ["pending"],
      });
    });
    return data;
  };
  const loadRequests = async () => {
    const response = await axios.get(`${API}/user/Pendingrestaurants`);
    const data = helper(response.data);
    setState(data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const acceptReques = async (cb) => {
    const response = await axios.put(`${API}/user/confirmRestaurant/${cb.key}`);
    if (response.data) {
      const data = helper(response.data);
      toast.success("Request Accepted");
      setState(data);
    } else {
      toast.error(response.data.error);
      showErrorMessage(response.data.error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Certificate",
      dataIndex: "certificate",
      key: "certificate",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "pending") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "",
      key: "x",
      render: (cb) => (
        <Button type="primary" onClick={() => acceptReques(cb)}>
          Accept Request
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      {head()}
      <Layout>
        <ToastContainer />
        <div className="container pt-5 pb-5 bg-col">
          <div className="col-md-6 offset-md-3" style={{ marginTop: "1.2rem" }}>
            <h1 className="text-light text-center m-nav2 text-uppercase text-span">
              All <span className="text-span">Requests</span>
            </h1>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Table columns={columns} dataSource={state} />
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export default withAdmin(Landing);
