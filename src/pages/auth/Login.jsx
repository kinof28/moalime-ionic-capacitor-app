import {
  Box,
  Button,
  Grid,
  InputLabel,
  Paper,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { loginTeacher } from "../../redux/teacherSlice";
import { loginStudent } from "../../redux/studentSlice";
import { loginParent } from "../../redux/parentSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

import { Geolocation } from "@capacitor/geolocation";

export default function Login() {
  const dispatch = useDispatch();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [load, setLoad] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const lang = Cookies.get("i18next") || "en";

  const navigate = useNavigate();

  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // window.navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     setLocation({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     });
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    const getCoordinates = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log("Current position:", coordinates);
    };
    getCoordinates();
  }, []);

  async function onSubmit(data) {
    setLoad(true);
    closeSnackbar();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            long: location?.longitude,
            lat: location?.latitude,
          }),
        }
      );
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        setLoad(false);
        enqueueSnackbar(resData.message, {
          variant: "error",
          autoHideDuration: "8000",
        });
        throw new Error("failed occured");
      }
      localStorage.clear();
      if (resData.role === "teacher") {
        dispatch(loginTeacher({ token: resData.token, teacher: resData.data }));
        navigate("/teacher/about");
      } else if (resData.role === "student") {
        dispatch(loginStudent({ token: resData.token, student: resData.data }));
        navigate("/");
      } else if (resData.role === "parent") {
        dispatch(loginParent({ token: resData.token, parent: resData.data }));
        navigate("/parent");
      }
      setLoad(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Navbar>
      <Container sx={{ marginTop: "110px" }}>
        <Paper
          sx={{
            width: { md: "450px" },
            padding: "30px 50px",
            margin: "60px auto 60px",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              sx={{ fontSize: "28px", fontWeight: "600", marginBottom: "16px" }}
            >
              {t("loginemail")}
            </Typography>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("email")}
              </InputLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField type="email" {...field} fullWidth />
                )}
                {...register("email", {
                  required: "email Address is required",
                })}
              />
              {errors.email?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("password")}
              </InputLabel>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField type="password" {...field} fullWidth />
                )}
                {...register("password", {
                  required: "password Address is required",
                })}
              />
              {errors.password?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              type="submit"
              sx={{ textTransform: "capitalize" }}
            >
              {load ? t("login") + "..." : t("login")}
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  marginTop: "40px",
                  fontSize: "15px",
                  textAlign: "center",
                  fontWeight: "700",
                  marginBottom: "20px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/teacherRegister/step1")}
              >
                {t("donthaveacount")}
              </Typography>
              <Typography
                sx={{
                  marginTop: "40px",
                  fontSize: "15px",
                  textAlign: "center",
                  fontWeight: "700",
                  marginBottom: "20px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/forgetPassword/step1")}
              >
                {t("forgetpassword")}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/studentregister/step1")}
                >
                  {t("student")}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/teacherRegister/step1")}
                >
                  {t("teacher")}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/parent/register")}
                >
                  {t("parent")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Navbar>
  );
}
