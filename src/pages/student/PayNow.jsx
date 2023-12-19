import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Navbar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import currencies from "../../data/currencies";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Browser } from "@capacitor/browser";

export default function PayNow() {
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      currency: "",
      amount: 1,
    },
  });

  const [load, setLoad] = useState(false);

  const { student, token } = useSelector((state) => state.student);

  async function onSubmit(data) {
    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/payment/charge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            StudentId: student.id,
            price: data.amount,
            currency: data.currency,
          }),
        }
      );
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        setLoad(false);
        throw new Error("failed occured");
      }
      await Browser.open({ url: resData.data });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          marginTop: "120px",
          width: "500px",
          maxWidth: "100%",
          marginX: "auto",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "40px",
          }}
        >
          {t("safepay")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ marginBottom: "30px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              {t("amount")}
            </InputLabel>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField type="number" {...field} fullWidth />
              )}
              {...register("amount", {
                required: "amount Address is required",
              })}
            />
            {errors.amount?.type === "required" && (
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
            <InputLabel sx={{ marginBottom: "8px", fontSize: "13px" }}>
              {t("currency")}
            </InputLabel>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...register("currency", {
                      required: "currency is required",
                    })}
                  >
                    {currencies.map((name) => (
                      <MenuItem key={name.title} value={name.title}>
                        {name.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.currency?.type === "required" && (
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
            <Button type="submit" variant="contained" fullWidth>
              {t("paynow")}
            </Button>
          ) : (
            <Button variant="contained" fullWidth>
              {t("paynow")}...
            </Button>
          )}
        </form>
      </Box>
    </Box>
  );
}
