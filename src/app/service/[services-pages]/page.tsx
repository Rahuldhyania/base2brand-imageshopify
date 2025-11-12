"use client";
import "./Servicespages.css"; 
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../../../../component/header";
import Footer from "../../../../component/footer";
import PageHead from "../../../../component/PageHead";
import Hiredubaibanner from "./components/Hiredubaibanner";
import Whyb2b from "./components/Whyb2b";
import Hiretabsection from "./components/Hiretabsection";
import Hireprocess from "./components/Hireprocess";
import Hiredubaireview from "./components/Hiredubaireview";
import Hiretalkform from "./components/Hiretalkform";
import Hirefaq from "./components/Hirefaq";
import axios from "axios";
import Notfound from "./Notfound";

function Dynamicservicepage() {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const slug = parts.pop() || ""; 

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false); // ✅ new state

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(
          `https://adminbackend.base2brand.com/api/B2Badmin/slug/${slug}`,
          { signal: abortController.signal }
        );
        if (isMounted) {
          setData(data);
          setLoading(false);
        }
      } catch (error) {
        console.log("API Error:", error);

        if (error.response?.status === 404) {
          setIsNotFound(true);  
          setLoading(false);
          return;
        }

        if (isMounted && error.name !== "CanceledError") {
          setError(error);
          setLoading(false);
        }
      }
    };
    
    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [slug]);

  if (isNotFound) {
    return <Notfound />;
  }
  const baseURL = `https://base2brand.com/service/${slug}`;
  const wwwURL = `https://www.base2brand.com/service/${slug}`;
  let canonical = "";
  if (typeof window !== "undefined") {
    const isUsingWWW = window.location.href.includes("www.");
    canonical = isUsingWWW ? wwwURL : baseURL;
  }
  const PageMeta = {
    title: data?.data?.seoPageTitle,
    description: data?.data?.pageKeywords,
    canonical: canonical, 
    image: "/img/portfolio/b1.png",
  
  };  

  return (
    <div>
      <PageHead PageMeta={PageMeta} />
      <Header />

      {data && data?.data ? (
        <div>
          <Hiredubaibanner
            bannerimage={data.data.heroSection.backgroundImage}
            pagetitle={data.data.heroSection.title}
            pagedescription={data.data.heroSection.description}
            right_banner={data.data.heroSection.topImage}
          />
          <Whyb2b
            whytitle={data.data.aboutSection.title}
            whydescription={data.data.aboutSection.description}
            whybanner={data.data.aboutSection.image}
          />
          <Hiretabsection
            tabtitle={data.data.challengesSection.title}
            tabcontent={data.data.challengesSection.items}
          />
          <Hireprocess
            hireprocessdata={data.data.processSection.steps}
            hireprocesstitle={data.data.processSection.title}
          />
          <Hiredubaireview reviewdata={data.data.testimonialsSection.testimonials} />
          <Hiretalkform bannerimage={data.data.heroSection.topImage} />
          <Hirefaq faqData={data.data.faqSection.faqs} /> 
        </div>
        
      ) : (
        <div className="d-flex bg_blue_right justify-content-center align-items-center" style={{ height: "40vh" }}>
          {loading && <div className="spinner-border text-white" role="status" />}
        </div>
      )} 

      <Footer />
    </div>
  );
}

export default Dynamicservicepage;
