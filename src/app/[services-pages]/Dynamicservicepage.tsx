"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../../../component/header";
import Footer from "../../../component/footer";
import PageHead from "../../../component/PageHead";
import Hiredubaibanner from "./components/Hiredubaibanner";
import Whyb2b from "./components/Whyb2b";
import Hiretabsection from "./components/Hiretabsection";
import Hireprocess from "./components/Hireprocess";
import Hiredubaireview from "./components/Hiredubaireview";
import Hiretalkform from "./components/Hiretalkform";
import Hirefaq from "./components/Hirefaq";
import axios from "axios";

 function Dynamicservicepage() {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const slug = parts.pop() || ""; 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = `https://base2brand.com/${slug}`;
  const wwwURL = `https://www.base2brand.com/${slug}`;

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
          console.log(data, "datadatadata?>>>>>>");
          
        if (isMounted) {
          setData(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          if (error.name !== 'CanceledError') {
            console.error("Error fetching data:", error);
            setError(error);
            setLoading(false);
          }
        }
      }
    };
    
    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [slug]);


  console.log('data',data);
  
  const PageMeta = {
    title: data?.data?.seoPageTitle,
    description: data?.data?.pageKeywords,
    image: "/img/portfolio/b1.png"
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
          <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
            {data === null ? (
               <div className="spinner-border" role="status" />
             ) : (
               <p>Sorry, page not found...</p>
              )}
           </div>
        )} 

      <Footer />
    </div>
  );
}

export default Dynamicservicepage;
