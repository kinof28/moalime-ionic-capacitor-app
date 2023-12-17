import { Box, Button, Container, Grid, Paper } from "@mui/material";
import React from "react";
import AboutSingleTeacher from "../../components/client/singleTeacher/AboutSingleTeacher";
import AvailablitySingleTeacher from "../../components/client/singleTeacher/AvailablitySingleTeacher";
import HeaderSingleTeacher from "../../components/client/singleTeacher/HeaderSingleTeacher";
import ResumeSingleTeacher from "../../components/client/singleTeacher/ResumeSingleTeacher";
import StdeuntsTypeSingleTeacher from "../../components/client/singleTeacher/StdeuntsTypeSingleTeacher";
import Navbar from "../../components/Navbar";
import { useSingleTeacher } from "../../hooks/useSingleTeacher";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import RatingTeacher from "../../components/client/singleTeacher/RatingTeacher";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import PayingTeacher from "../../components/client/singleTeacher/PayingTeacher";

export default function SingleTeacher() {
  const { id } = useParams();
  const { currency } = useSelector((state) => state.currency);
  const { data, isLoading } = useSingleTeacher(id, currency);
  const { student } = useSelector((state) => state.student);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const handleCreateMessage = async () => {
    if (!student) {
      swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
      return;
    }
    const q = query(
      collection(db, "chats"),
      where("studentId", "==", `${student.id}`),
      where("teacherId", "==", `${id}`)
    );
    const res = await getDocs(q);
    if (res.empty) {
      const time = Timestamp.now();
      await addDoc(collection(db, "chats"), {
        messages: [],
        teacherId: `${id}`,
        studentId: `${student.id}`,
        studentName: student.name,
        studentImage: student.image,
        teacherName: `${data?.data?.firstName} ${data?.data?.lastName}`,
        teacherImage: data?.data?.image,
        lastmessage: time,
      });
    }
    navigate(`/student/messages`);
  };

  const handleRequestBook = async () => {
    if (!student) {
      swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
      return;
    }
    navigate(`/book/${data?.data.id}`);
  };

  return (
    <Navbar>
      {isLoading ? (
        <Loading />
      ) : (
        <Container sx={{ marginBottom: "40px", marginTop: "80px" }}>
          <Grid container spacing={1}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <HeaderSingleTeacher teacher={data?.data} />
              <AboutSingleTeacher teacher={data?.data} />
              <StdeuntsTypeSingleTeacher teacher={data?.data} />
              <AvailablitySingleTeacher teacher={data?.data} />
              <RatingTeacher teacher={data?.data} />
              <PayingTeacher teacher={data?.data} />
              <ResumeSingleTeacher teacher={data?.data} />
            </Box>
            <Grid item md={12} lg={4}>
              <Paper sx={{ padding: "24px 12px", marginY: "30px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ textTransform: "capitalize", marginBottom: "16px" }}
                  onClick={handleRequestBook}
                >
                  {t("requestBook")}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleCreateMessage}
                >
                  {t("contactTeacher")}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </Navbar>
  );
}
