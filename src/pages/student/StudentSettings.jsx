import {
  Box,
  Button,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import StudentLayout from "../../components/student/StudentLayout";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";

export default function StudentSettings() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [load, setLoad] = useState(false);
  const { student, token } = useSelector((state) => state.student);
  const lang = Cookies.get("i18next") || "en";

  async function handleChangePassword(data) {
    closeSnackbar();
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/student/resetPassword/${student?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
          }),
        }
      );
      const responseData = await response.json();
      setLoad(false);
      if (response.status !== 200 && response.status !== 201) {
        if (lang === "ar") {
          enqueueSnackbar(responseData.message.arabic, {
            variant: "error",
            autoHideDuration: 8000,
          });
        } else {
          enqueueSnackbar(responseData.message.english, {
            variant: "error",
            autoHideDuration: 8000,
          });
        }
        throw new Error("failed occured");
      } else {
        enqueueSnackbar("password has been changed", {
          variant: "success",
          autoHideDuration: 8000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <StudentLayout>
      <Paper sx={{ padding: "40px 20px" }}>
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <Typography sx={{ marginBottom: "30px" }}>
            {t("changepassword")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              marginBottom: "32px",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <InputLabel sx={{ marginBottom: "12px", fontSize: "13px" }}>
              {t("oldPassword")}
            </InputLabel>
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <TextField type="password" {...field} fullWidth />
              )}
              {...register("oldPassword", {
                required: "The old password is required",
              })}
            />
            {errors.oldPassword?.type === "required" && (
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
              marginBottom: "24px",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <InputLabel sx={{ marginBottom: "12px", fontSize: "13px" }}>
              {t("newPassword")}
            </InputLabel>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField type="password" {...field} fullWidth />
              )}
              {...register("newPassword", {
                required: "The old password is required",
              })}
            />
            {errors.newPassword?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
          </Box>
          {!load ? (
            <Button
              type="submit"
              sx={{ marginTop: "30px" }}
              variant="contained"
              color="secondary"
            >
              {t("save")}
            </Button>
          ) : (
            <Button
              type="submit"
              sx={{ marginTop: "30px" }}
              variant="contained"
              color="secondary"
              disabled
            >
              {t("save")}...
            </Button>
          )}
        </form>
      </Paper>
    </StudentLayout>
  );
}
