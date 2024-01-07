import React from "react";
import { Box, Container, styled } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import SvgIcon from "@mui/material/SvgIcon";
import { Link } from "react-router-dom";
import payemnt from "../../../images/paymeny.png";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSocialMedia } from "../../../hooks/useSocialMedia";

const IconWrapper = styled(Box)({
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  backgroundColor: "#005B8E",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2px",
});

const MatLink = styled(Link)({
  color: "#6D6D6D",
  fontSize: "14px",
});

const Image = styled("img")({
  width: "200px",
});

const TikTokIcon = ({ color = "#fff" }) => {
  return (
    <SvgIcon
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
      </svg>
    </SvgIcon>
  );
};

export default function LinksFooter() {
  const { t } = useTranslation();
  const { student } = useSelector((state) => state.student);
  const { data } = useSocialMedia();
  const links = data?.data;

  const iconComponents = {
    Facebook: (
      <FacebookIcon
        sx={{
          fontSize: "24px",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      />
    ),
    Twitter: (
      <TwitterIcon
        sx={{
          fontSize: "24px",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      />
    ),
    LinkedIn: (
      <LinkedInIcon
        sx={{
          fontSize: "24px",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      />
    ),
    Instagram: (
      <InstagramIcon
        sx={{
          fontSize: "24px",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      />
    ),
    TikTok: (
      <TikTokIcon
        sx={{
          fontSize: "24px",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      />
    ),
  };

  return (
    <Box sx={{ backgroundColor: "#d9d9d952" }}>
      <Container
        sx={{
          padding: "20px",
          display: "flex",
          columnGap: "12px",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { md: "row", xs: "column" },
          rowGap: "16px",
        }}
      >
        <Box sx={{ display: "flex", columnGap: "10px" }}>
          {links?.map((obj, index) => {
            const iconComponent = iconComponents[obj.type];
            if (!iconComponent) {
              return null;
            }
            return (
              <IconWrapper key={index}>
                <Link to={obj?.link}>{iconComponent}</Link>
              </IconWrapper>
            );
          })}
        </Box>
        <Box
          sx={{
            display: "flex",
            columnGap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <MatLink to="/about-us">{t("aboutUs")}</MatLink>
          <MatLink to="/TermsAndConditions">{t("TermsAndConditions")}</MatLink>
          <MatLink to="/PrivacyPolicy">{t("PrivacyPolicy")}</MatLink>
          <MatLink to="/pay-now">{t("paynow")}</MatLink>
          {student && <MatLink to="/map-browser">{t("mapBroswer")}</MatLink>}
        </Box>
        <Box sx={{ display: "flex", columnGap: "4px", alignItems: "center" }}>
          <Image src={payemnt} />
        </Box>
      </Container>
    </Box>
  );
}
