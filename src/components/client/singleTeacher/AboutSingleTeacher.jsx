import { Paper, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AboutSingleTeacher({ teacher }) {
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  return (
    <Paper sx={{ padding: "32px 24px", marginY: "10px" }}>
      <Typography sx={{ fontSize: "22px", marginBottom: "18px" }}>
        {t("aboutTeacher")}
      </Typography>
      <Typography>
        {lang === "en" ? teacher?.descriptionEn : teacher?.descriptionAr}
      </Typography>
    </Paper>
  );
}
