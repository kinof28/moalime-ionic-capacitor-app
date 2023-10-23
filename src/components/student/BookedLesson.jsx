import { Avatar, Box, Typography, Button, Divider } from "@mui/material";
import React, { useState } from "react";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function BookedLesson({
  image,
  name,
  date,
  type,
  period,
  isStudent,
  studentAccept,
  teacherAccept,
  sessionId,
  parentTeacher,
  parentStudent,
}) {
  const { t } = useTranslation();
  const teacher = useSelector((state) => state.teacher);
  const student = useSelector((state) => state.student);
  const navigate = useNavigate();
  const [showAttend, setShowAttend] = useState(
    (isStudent && !studentAccept) || (!isStudent && !teacherAccept)
  );
  async function acceptLesson() {
    try {
      if (isStudent) {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/student/acceptLesson/${student?.student.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: student?.token,
            },
            body: JSON.stringify({ SessionId: sessionId }),
          }
        );
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/acceptLesson/${teacher?.teacher.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: teacher?.token,
            },
            body: JSON.stringify({ SessionId: sessionId }),
          }
        );
      }
      setShowAttend(false);
    } catch (err) {
      console.log(err);
    }
  }
  const handleCreateMessage = async () => {
    console.log("starting messaging.....");
    console.log("is Student: ", isStudent);
    console.log("parent teacher: ", parentTeacher);
    console.log("parent Student: ", parentStudent);

    const q = query(
      collection(db, "chats"),
      where("studentId", "==", `${parentStudent?.id}`),
      where("teacherId", "==", `${parentTeacher?.id}`)
    );
    const res = await getDocs(q);
    if (res.empty) {
      const time = Timestamp.now();
      await addDoc(collection(db, "chats"), {
        messages: [],
        teacherId: `${parentTeacher?.id}`,
        studentId: `${parentStudent?.id}`,
        studentName: parentStudent?.name,
        studentImage: parentStudent?.image,
        teacherName: `${parentTeacher?.firstName} ${parentTeacher?.lastName}`,
        teacherImage: parentTeacher?.image,
        lastmessage: time,
      });
    }
    if (isStudent) navigate(`/student/messages`);
    else navigate(`/teacher/messages`);
  };

  return (
    <>
      <Box sx={{ marginY: "15px" }}>
        <Box sx={{ display: "flex", columnGap: "12px" }}>
          <Avatar
            sx={{ width: "85px", height: "85px" }}
            src={`${process.env.REACT_APP_API_KEY}images/${image}`}
          />
          <Box>
            <Typography sx={{ fontWeight: "600" }}>{name}</Typography>
            <Box
              sx={{
                marginY: "8px",
                display: "flex",
                alignItems: "center",
                columnGap: "6px",
              }}
            >
              <DateRangeIcon sx={{ fontSize: "16px", color: "#9D9D9D" }} />
              <Typography sx={{ fontSize: "13px", color: "#9D9D9D" }}>
                {new Date(date).toLocaleString()}
                {/* {date?.split("T")[0]} */}
              </Typography>
            </Box>
            <Box
              sx={{
                marginY: "8px",
                display: "flex",
                alignItems: "center",
                columnGap: "6px",
              }}
            >
              <ApartmentIcon sx={{ fontSize: "16px", color: "#9D9D9D" }} />
              <Typography sx={{ fontSize: "13px", color: "#9D9D9D" }}>
                {t(type + "_place")}
              </Typography>
            </Box>
            <Box
              sx={{
                marginY: "8px",
                display: "flex",
                alignItems: "center",
                columnGap: "6px",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: "16px", color: "#9D9D9D" }} />
              <Typography sx={{ fontSize: "13px", color: "#9D9D9D" }}>
                {period} {t("lesson_hour")}
              </Typography>
            </Box>
            {showAttend && (
              <Button
                onClick={acceptLesson}
                variant="contained"
                size="small"
                sx={{ marginTop: "4px", marginBottom: "8px" }}
              >
                {t("attendLesson")}
              </Button>
            )}
            <Button
              onClick={handleCreateMessage}
              variant="contained"
              size="small"
              sx={{ marginTop: "4px", marginBottom: "8px", marginX: "16px" }}
              color="warning"
            >
              {t("instant_messaging")}
            </Button>
          </Box>
        </Box>
      </Box>
      <Divider />
    </>
  );
}
