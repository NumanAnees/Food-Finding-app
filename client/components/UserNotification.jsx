import React, { useEffect, useState } from "react";
import Notifications from "react-notifications-menu";
import axios from "axios";
import Cookies from "js-cookie";

const UserNotification = ({ data }) => {
  const [notification, setNotification] = useState([]);
  // const API = "https://puzzled-gabardine-clam.cyclic.app/api";
  const API = "http://localhost:8000/api";

  // const Usertoken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDg2MjE1YTc1YzlkNGY4M2I5MzAwNWUiLCJpYXQiOjE2ODY2NzM0NDMsImV4cCI6MTY4NzI3ODI0M30.uySL7F_Z1pEGofyz_5x8ssA9q-pJqhsQDe8SASC2V4I";

  const Usertoken = Cookies.get("token");
  console.log("---token---", Usertoken);
  const loadNotification = async () => {
    const response = await axios.get(`${API}/notification/getunseen`, {
      headers: {
        authorization: `Bearer ${Usertoken}`,
        contentType: "application/json",
      },
    });
    setNotification(response.data);
    console.log(notification);
  };

  useEffect(() => {
    loadNotification();
  }, []);
  const handleViewAll = async () => {
    const userID = data;
    const response = await axios.put(`${API}/notification/seenAlls`, {
      userID,
    });
    setNotification(response.data);
    console.log(notification);
  };

  return (
    <>
      <Notifications
        // style={{ position: "absolute", right: "10%" }}
        data={notification}
        header={{
          title: "Notifications",
          option: { text: "View All", onClick: () => handleViewAll() },
        }}
      />
    </>
  );
};

export default UserNotification;
