import axios from "axios";
import Router from "next/router";
// import { API } from '../config';
import { getCookie } from "../helpers/auth";

const withUser = (Page) => {
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  const APP_NAME = "Top Dish";
  const WithAuthUser = (props) => <Page {...props} />;
  WithAuthUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;
    let userLinks = [];

    if (token) {
      try {
        const response = await axios.get(`${API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        console.log("response in withUser", response);
        user = response.data.user;
        userLinks = response.data.links;
      } catch (error) {
        if (error.response.status === 401) {
          user = null;
        }
      }
    }

    if (user === null) {
      //   if (context.res) { // server
      //  return  context.res.writeHead(302, {
      //         Location: '/'
      //     });

      //     } else { // client
      //    return Router.push('/');
      //     }
      // redirect
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
        userLinks,
      };
    }
  };

  return WithAuthUser;
};

export default withUser;
