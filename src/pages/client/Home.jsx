import React from "react";
import DownloadApp from "../../components/client/home/DownloadApp";
import Footer from "../../components/client/home/Footer";
import HomeAbout from "../../components/client/home/HomeAbout";
import HomeBanner from "../../components/client/home/HomeBanner";
import HomeImages from "../../components/client/home/HomeImages";
import HomeQuestions from "../../components/client/home/HomeQuestions";
import HomeWorks from "../../components/client/home/HomeWorks";
import LinksFooter from "../../components/client/home/LinksFooter";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import MapBrowsing from "../../components/client/home/MapBrowsing";

export default function Home() {
  const { student } = useSelector((state) => state.student);
  return (
    <Navbar>
      {student && student.lat && student.long && <MapBrowsing />}
      <HomeBanner />
      <HomeImages />
      <HomeWorks />
      <HomeAbout />
      <HomeQuestions />
      {/* <DownloadApp /> */}
      <LinksFooter />
      <Footer />
    </Navbar>
  );
}
