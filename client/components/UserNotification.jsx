import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "./style.module.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getNotificationsAction,
  seeNotificationAction,
  seeAllNotificationsAction,
} from "../../utils/store/slices/userAuth/actions";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
const UserNotification = () => {
  const dispatch = useDispatch();
  const [isMobileVersionVisible, setIsMobileVersionVisible] = useState(false);
  const [notiMessage, setNotiMessage] = useState();
  useEffect(() => {
    const handleResize = () => {
      const deviceWidth = window.innerWidth;
      setIsMobileVersionVisible(deviceWidth <= 786);
    };

    handleResize(); // Initial check on component mount

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const userNotificationRef = useRef(null);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  useEffect(() => {
    dispatch(getNotificationsAction())
      .then(unwrapResult)
      .then((result) => {
        console.log("resultt", result);
        setNotiMessage(result);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userNotificationRef.current &&
        !userNotificationRef.current.contains(event.target)
      ) {
        setNotificationVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    setNotificationVisible((prevValue) => !prevValue);
  };

  const handleSpanClick = (i) => {
    setNotificationVisible(false);
  };

  function handleNoti(id) {
    dispatch(seeNotificationAction(id))
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          console.log("resulttt", result);
          setNotiMessage(notiMessage?.filter((noti) => id !== noti?._id));
        }
        console.log("resultttttt", result);
      })
      .catch((error) => console.log(error));
  }
  const handleSeenAll = () => {
    dispatch(seeAllNotificationsAction())
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          setNotiMessage([]);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <div
        className={`${styled.userNotification} ${
          isMobileVersionVisible
            ? styled.mobileVersions
            : styled.desktopVersions
        }`}
      >
        <button
          className={styled.iconNotificationButton}
          onClick={handleNotificationClick}
          style={{ cursor: "pointer" }}
        >
          <NotificationsIcon />
          <span>{notiMessage?.length > 0 ? notiMessage?.length : null}</span>
        </button>
        {isNotificationVisible && (
          <div className={styled.notificationBody}>
            <div className={styled.notificationTitle}>
              <h2 style={{ color: "red" }}>NOTIFICATIONS</h2>
              <span
                onClick={handleSpanClick}
                style={{ cursor: "pointer", color: "#dd3333" }}
              >
                <AiOutlineClose color="#DD3333" />
              </span>
            </div>
            <div className={styled.notifyBody}>
              <ul>
                {notiMessage?.length ? (
                  notiMessage?.map((noti) => (
                    <>
                      <Card
                        sx={{ maxWidth: 250, background: "#c3c3c3" }}
                        className="mt-3 mb-3 mr-3"
                      >
                        <CardContent>
                          <span
                            onClick={() => handleNoti(noti?._id)}
                            style={{ cursor: "pointer" }}
                            className="d-flex justify-content-end"
                          >
                            <AiOutlineCloseCircle color="#DD3333" />
                          </span>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                            variant="h6"
                          >
                            {noti?.message}
                          </Typography>
                          <Typography variant="h5" component="div"></Typography>
                        </CardContent>
                      </Card>
                    </>
                  ))
                ) : (
                  <Box className="d-flex justify-content-center align-item-center">
                    <h6>No Notification Available</h6>
                  </Box>
                )}

                {notiMessage?.length ? (
                  <Button
                    variant="contained"
                    style={{ background: "#dd3333" }}
                    onClick={() => handleSeenAll()}
                  >
                    Clear All
                  </Button>
                ) : null}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotification;
