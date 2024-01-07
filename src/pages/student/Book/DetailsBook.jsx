import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate, useParams } from "react-router-dom";
import { useSingleTeacher } from "../../../hooks/useSingleTeacher";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

export default function DetailsBook() {
  const lang = Cookies.get("i18next") || "en";
  const { teacherId } = useParams();
  const { currency } = useSelector((state) => state.currency);
  const { conversionRate } = useSelector((state) => state.conversionRate);
  const { data, isLoading } = useSingleTeacher(teacherId, currency);
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      hours: "1",
      typeLesson: "",
      date: "",
      time: "",
      typeofbook: "",
    },
  });

  const { student } = useSelector((state) => state.student);
  const navigate = useNavigate();
  async function onSubmit(data) {
    setLoad(true);
    try {
      closeSnackbar();
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/payment/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            StudentId: student.id,
            TeacherId: teacherId,
            price: price.toFixed(3),
            currency: currency,
            typeOfPayment: data.typeofbook,
            period: data.hours,
            date: data.date + "T" + data.time,
            type: data.typeLesson,
            title: "",
          }),
        }
      );
      setLoad(false);
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        enqueueSnackbar(resData.message, {
          variant: "error",
          autoHideDuration: 8000,
        });
        throw new Error("failed occured");
      }
      if (data.typeofbook === "wallet") {
        navigate("/student/lessons");
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "success", autoHideDuration: 8000 }
        );
      } else {
        window.location.replace(resData.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (watch("typeLesson") === "online") {
      setPrice(data?.data.RemoteSession.priceAfterDiscount);
    } else if (watch("typeLesson") === "student") {
      setPrice(data?.data.F2FSessionStd.priceAfterDiscount);
    } else if (watch("typeLesson") === "teacher") {
      setPrice(data?.data.F2FSessionTeacher.priceAfterDiscount);
    }
  }, [watch("typeLesson")]);

  return (
    <Navbar>
      <Container sx={{ marginY: "40px" }}>
        <Paper sx={{ padding: "30px 20px" }}>
          <Typography
            sx={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}
          >
            {t("bookDetails")}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Box sx={{ marginBottom: "26px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("hours")}
                </InputLabel>
                <Controller
                  name="hours"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...register("hours", {
                          required: "hours is required",
                        })}
                      >
                        {[...Array(9).keys()].map((num, index) => {
                          return <MenuItem value={num + 1}>{num + 1}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.hours?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Box sx={{ marginBottom: "26px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("lessonType")}
                </InputLabel>
                <Controller
                  name="typeLesson"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...register("typeLesson", {
                          required: "type is required",
                        })}
                      >
                        {data?.data.RemoteSession && (
                          <MenuItem value={"online"}>
                            {lang === "ar" ? "عن بعد" : "online"}
                          </MenuItem>
                        )}
                        {data?.data.F2FSessionStd && (
                          <MenuItem value={"student"}>
                            {lang === "ar" ? "في منزل الطالب" : "Student home"}
                          </MenuItem>
                        )}
                        {data?.data.F2FSessionTeacher && (
                          <MenuItem value={"teacher"}>
                            {lang === "ar" ? "في منزل المعلم" : "Teacher home"}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.typeLesson?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  gap: { md: 3 },
                }}
              >
                <Box sx={{ marginBottom: "30px", width: "100%" }}>
                  <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                    {t("lessonDate")}
                  </InputLabel>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <TextField type="date" {...field} fullWidth />
                    )}
                    {...register("date", {
                      required: "date Address is required",
                    })}
                  />
                  {errors.date?.type === "required" && (
                    <Typography
                      color="error"
                      role="alert"
                      sx={{ fontSize: "13px", marginTop: "6px" }}
                    >
                      {t("required")}
                    </Typography>
                  )}
                </Box>
                {/* ------------------------------- */}
                <Box sx={{ marginBottom: "30px", width: "100%" }}>
                  <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                    {t("lessonTime")}
                  </InputLabel>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                      <TextField type="time" {...field} fullWidth />
                    )}
                    {...register("time", {
                      required: "time is required",
                    })}
                  />
                  {errors.time?.type === "required" && (
                    <Typography
                      color="error"
                      role="alert"
                      sx={{ fontSize: "13px", marginTop: "6px" }}
                    >
                      {t("required")}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ marginBottom: "26px" }}>
              <Controller
                name="typeofbook"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormControlLabel
                      value="wallet"
                      control={<Radio size="2px" />}
                      label={`${t("credit")} (${t("wallet")})`}
                    />
                    <FormControlLabel
                      value="thawani"
                      control={<Radio size="2px" />}
                      label={t("gateway")}
                    />
                  </RadioGroup>
                )}
                {...register("typeofbook", {
                  required: "typeofbook Address is required",
                })}
              />
              {errors.typeofbook?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ padding: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "6px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#005B8E",
                      color: "white",
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <LocalOfferIcon sx={{ fontSize: "15px" }} />
                  </Box>
                  <Typography sx={{ fontSize: "14px" }}>
                    {t("lessonPrice")}
                  </Typography>
                </Box>
                <Typography>
                  {parseFloat(price * conversionRate).toFixed(2)} {currency}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "14px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "6px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#005B8E",
                      color: "white",
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <PaidIcon sx={{ fontSize: "15px" }} />
                  </Box>
                  <Typography sx={{ fontSize: "14px" }}>
                    {t("totlalessonPrice")}
                  </Typography>
                </Box>
                <Typography>
                  {parseFloat(price * watch("hours") * conversionRate).toFixed(
                    2
                  )}{" "}
                  {currency}
                </Typography>
              </Box>
            </Box>
            {!load ? (
              <Button fullWidth type="submit" variant="contained">
                {t("next")}
              </Button>
            ) : (
              <Button fullWidth variant="contained">
                {t("next")}...
              </Button>
            )}
          </form>
        </Paper>
      </Container>
    </Navbar>
  );
}
