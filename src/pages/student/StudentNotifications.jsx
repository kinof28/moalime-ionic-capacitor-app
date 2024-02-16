import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Container, styled, Box, Typography, Paper } from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { collection, query, onSnapshot, where, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { format } from "timeago.js";

const Wrapper = styled(Box)({
  display: "flex",
  columnGap: "10px",
  justifyContent: "center",
});

const IconWrapper = styled(Box)({
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default function StudentNotifications() {
  const { student, token } = useSelector((s) => s.student);
  const lang = Cookies.get("i18next") || "en";
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "Notifications"),
      where("StudentId", "==", `${student.id}`)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ ...doc.data(), id: doc.id });
      });
      setNotifications(notifications);
    });
    return () => unsubscribe();
  }, [student]);

  return (
    <Navbar>
      <Container
        sx={{
          marginBottom: "60px",
          marginTop: "120px",
          padding: "40px 20px 20px",
        }}
        component={Paper}
      >
        {notifications.length > 0 &&
          notifications.map((not) => {
            return (
              <Wrapper sx={{ marginBottom: "35px" }} key={not.id}>
                <IconWrapper
                  sx={{
                    backgroundColor: !not.seen ? "#e66b4c47" : "#40c0dc33",
                  }}
                >
                  <NotificationsActiveOutlinedIcon
                    sx={{
                      color: "black",
                      fontSize: "26px",
                      transform: "rotate(45deg)",
                    }}
                  />
                </IconWrapper>
                <Box sx={{ width: "90%" }}>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      color: "#303030",
                      fontWeight: "400",
                      marginBottom: "8px",
                    }}
                  >
                    {lang === "en" ? not.titleEn : not.titleAR}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#949494",
                      fontWeight: "500",
                    }}
                  >
                    {typeof not?.date !== "undefined" && format(not?.date)}
                  </Typography>
                </Box>
              </Wrapper>
            );
          })}
      </Container>
    </Navbar>
  );
}
