import { useState, useEffect, Fragment } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import moment from "moment";
// import { API,APP_NAME } from '../../config';
import InfiniteScroll from "react-infinite-scroller";
import Head from "next/head";
import { CaretUpFilled } from "@ant-design/icons";
import { Button, Col } from "antd";
import { Button as MuiButton } from "@mui/material";
import Router from "next/router";
import { EyeFilled } from "@ant-design/icons";
import Footer from "../../components/Footer";
import { UserAddOutlined, MessageOutlined } from "@ant-design/icons";
import withUser from "../withUser";
import { Input, QRCode, Space, theme } from "antd";
const { useToken } = theme;
import { getCookie } from "../../helpers/auth";

// Within your Next.js API route or server-side code
const getUserTokenFromCookie = (cookieName) => {
  const cookies = document.cookie.split(";").reduce((cookiesObj, cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookiesObj[name] = decodeURIComponent(value);
    return cookiesObj;
  }, {});

  return cookies[cookieName] || null;
};

const ProfilePage = ({
  query,
  Links,
  User,
  followers,
  following,
  TotalLinks,
  isFollowing,
  Usertoken,
}) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";
  // console.log("---------quevur------", query);
  const APP_NAME = "Top Dish";
  const [allLinks, setAllLinks] = useState(Links);
  const [UserDetails, setUserDetails] = useState(User);
  const [followersCount, setFollowersCount] = useState(followers);
  const [followingCount, setFollowingCount] = useState(following);
  const [isFollow, setIsFollow] = useState(isFollowing);

  const [uid, setUid] = useState("");

  const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");
  const head = () => (
    <Head>
      <title>
        {User.name} | {APP_NAME}
      </title>
      <link rel="shortcut icon" href="/static/icons/favicon.ico" />
      <meta
        name="description"
        content={stripHTML(
          `top ${User.name},${User.name},best ${User.name},${User.name} 's ratings,Best ${User.name},top 10 best ${User.name},Best restaurant for ${User.name},best ${User.name} in pakistan,best ${User.name} in lahore`
        )}
      />
      <meta property="og:title" content={User.name} />
      <meta property="og:description" content={stripHTML(User.name)} />
      <meta property="og:image" content={User.picture} />
      <meta property="og:image:secure_url" content={User.picture} />
      <link rel="stylesheet" href="/static/styles/style.css" />
    </Head>
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUid(user._id);
    }
  }, []);

  const handleCount = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };
  const loadUpdatedLinks = async () => {
    const response = await axios.get(`${API}/links/by/${query.id}`, {
      headers: {
        authorization: `Bearer ${Usertoken}`,
        contentType: "application/json",
      },
    });
    setAllLinks(response.data.Links);
    setFollowersCount(response.data.followers);
    setFollowingCount(response.data.following);
    setIsFollow(response.data.isFollowing);
    setUserDetails(response.data.User);
  };

  const handleUpvote = async (linkId, upvArray) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const userId = user._id;
      if (!upvArray.includes(userId)) {
        const response = await axios.put(`${API}/upvote`, { linkId, userId });
        loadUpdatedLinks();
      } else {
        const response = await axios.put(`${API}/downvote`, { linkId, userId });
        loadUpdatedLinks();
      }
    } else {
      Router.push("/login");
    }
  };
  const listOfLinks = () => {
    return allLinks.map((l, i) => {
      if (l.position == 1) {
        l.position = "1st";
      } else if (l.position == 2) {
        l.position = "2nd";
      } else if (l.position == 3) {
        l.position = "3rd";
      } else if (l.position == 4) {
        l.position = "4th";
      } else if (l.position == 5) {
        l.position = "5th";
      } else if (l.position == 6) {
        l.position = "6th";
      } else if (l.position == 7) {
        l.position = "7th";
      } else if (l.position == 8) {
        l.position = "8th";
      } else if (l.position == 9) {
        l.position = "9th";
      } else if (l.position == 10) {
        l.position = "10th";
      } else if (l.position > 10) {
        l.position = `${l.position}th`;
      }
      return (
        <div key={i}>
          <h2 className="category-heading">
            {l.position} rank in{" "}
            <span className="text-span">{l.category.name}</span>
          </h2>
          <div className="row alert alert-light primary-link p-2">
            <div className="col-md-8 d-flex">
              <div className="col-md-2 mt-auto">
                {l.upvoteIDs.includes(uid) ? (
                  <Button
                    style={{
                      height: "4.7rem",
                      width: "4.5rem",
                      "margin-left": "-2rem",
                      backgroundColor: "#4daf4e",
                      marginBottom: "0.3rem",
                      borderRadius: "5px",
                    }}
                    onClick={(e) => handleUpvote(l._id, l.upvoteIDs)}
                  >
                    <CaretUpFilled
                      style={{ fontSize: "34px", color: "white" }}
                      className="up-icon"
                    />
                    <h6 style={{ color: "white" }}>{l.upvotes}</h6>
                  </Button>
                ) : (
                  <Button
                    style={{
                      height: "4.7rem",
                      width: "4.5rem",
                      marginLeft: "-2rem",
                      backgroundColor: "#f5f5f5",
                      marginBottom: "0.3rem",
                      borderRadius: "5px",
                    }}
                    onClick={(e) => handleUpvote(l._id, l.upvoteIDs)}
                  >
                    <CaretUpFilled
                      style={{ fontSize: "27px", color: "gray" }}
                      className="up-icon"
                    />
                    <h6>{l.upvotes}</h6>
                  </Button>
                )}
              </div>
              <div>
                <div>
                  <a
                    href={l.url}
                    target="_blank"
                    onClick={(e) => handleCount(l._id)}
                  >
                    <h5 className="">{l.title}</h5>
                    <h6 className=" text-danger" style={{ fontSize: "12px" }}>
                      {l.url.substring(0, 50)}
                    </h6>
                  </a>
                </div>
                <div
                  className="mt-2"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <span className="badge text-info">
                    {l.price} Rupees / GST {l.gst}
                  </span>
                  <span className="badge text-success">{l.category.name}</span>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex flex-column">
              <span className="pull-right text-center">
                {moment(l.createdAt).fromNow()} by {UserDetails.name}
              </span>
              <span
                className="text-secondary text-center"
                style={{ marginTop: "auto", fontSize: "14px" }}
              >
                <EyeFilled /> {l.clicks}
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  const [text, setText] = useState("https://topdish-client.vercel.app/");
  const { token } = useToken();

  const handleFollow = async (userId) => {
    const response = await axios.put(
      `${API}/user/follow`,
      {
        userIdToFollow: userId,
      },
      {
        headers: {
          authorization: `Bearer ${Usertoken}`,
          "Content-Type": "application/json",
        },
      }
    );
    loadUpdatedLinks();
    console.log(response);
  };
  const handleUnFollow = async (userId) => {
    const response = await axios.put(
      `${API}/user/unfollow`,
      {
        userIdToUnfollow: userId,
      },
      {
        headers: {
          authorization: `Bearer ${Usertoken}`,
          "Content-Type": "application/json",
        },
      }
    );
    loadUpdatedLinks();
    console.log(response);
  };

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="container pt-5 pb-5 bg-col">
          <div className="row">
            <div className="col-md-4 mt-4 d-flex">
              <img
                src={UserDetails.picture}
                alt={UserDetails.name}
                className="slug-img"
              />
            </div>
            <div className="col-md-8">
              <h1 className="display-6 font-weight-bold text-light m-nav3 text-uppercase text-span5">
                {UserDetails.name} - <span className="text-span">Profile</span>
              </h1>
              <div>
                <div class="profile-card-inf">
                  <div class="profile-card-inf__item">
                    <div class="profile-card-inf__title">{followersCount}</div>
                    <div class="profile-card-inf__txt">Followers</div>
                  </div>
                  <div class="profile-card-inf__item">
                    <div class="profile-card-inf__title">{followingCount}</div>
                    <div class="profile-card-inf__txt">Following</div>
                  </div>

                  <div class="profile-card-inf__item">
                    <div class="profile-card-inf__title">{TotalLinks}</div>
                    <div class="profile-card-inf__txt">Categories</div>
                  </div>
                </div>
                <row className="follow-row">
                  <div className="follow-button">
                    {isFollow ? (
                      <MuiButton
                        variant="contained"
                        color="error"
                        startIcon={<UserAddOutlined />}
                        size="large"
                        onClick={() => handleUnFollow(UserDetails._id)}
                      >
                        UnFollow
                      </MuiButton>
                    ) : (
                      <MuiButton
                        startIcon={<UserAddOutlined />}
                        size="large"
                        variant="contained"
                        onClick={() => handleFollow(UserDetails._id)}
                        color="info"
                      >
                        Follow
                      </MuiButton>
                    )}
                  </div>
                  <div className="message-button">
                    <MuiButton
                      variant="contained"
                      startIcon={<MessageOutlined />}
                      size="large"
                      color="secondary"
                    >
                      Message
                    </MuiButton>
                  </div>
                </row>
              </div>
            </div>
          </div>
          <br />

          <div className="row">
            <div className="col-md-8">{listOfLinks()}</div>
            <div className="col-md-4">
              <h2
                className="lead text-light text-span5"
                style={{ marginLeft: "2rem", marginBottom: "1rem" }}
              >
                Scan the QR code to See the{" "}
                <span className="text-span">Location</span>
              </h2>
              <QRCode
                value={text || "-"}
                color={token.colorInfoText}
                bgColor={token.colorBgLayout}
                size={250}
                style={{ marginLeft: "4rem" }}
              />
            </div>
          </div>
        </div>
      </Layout>
      <Footer />
    </Fragment>
  );
};

ProfilePage.getInitialProps = async ({ req, query }) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";
  // Usage in your code
  const Usertoken = getCookie("token", req);
  const APP_NAME = "Top Dish";

  const response = await axios.get(`${API}/links/by/${query.id}`, {
    headers: {
      authorization: `Bearer ${Usertoken}`,
      contentType: "application/json",
    },
  });
  return {
    query,
    Links: response.data.Links,
    User: response.data.User,
    followers: response.data.followers,
    following: response.data.following,
    TotalLinks: response.data.TotalLinks,
    isFollowing: response.data.isFollowing,
    Usertoken,
  };
};

export default withUser(ProfilePage);
