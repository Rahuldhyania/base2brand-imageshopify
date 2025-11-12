"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
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

function Dynamicservicepage() {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const slug = parts.pop() || ""; 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const loadingTextRef = useRef(null);
  const hasAttemptedInitialLoad = useRef(false);

  useEffect(() => {
    // Skip if we've already attempted the initial load
    if (hasAttemptedInitialLoad.current) return;
    
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Attempting API call for slug:", slug);
        
        const response = await axios.get(
          `https://adminbackend.base2brand.com/api/B2Badmin/slug/${slug}`,
          { 
            signal: abortController.signal,
            timeout: 10000
          }
        );
          
        console.log("API response received:", response.status);
        setData(response.data);
        setLoading(false);
        hasAttemptedInitialLoad.current = true;
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error("Error fetching data:", error);
          setError(error);
          setLoading(false);
          hasAttemptedInitialLoad.current = true;
          
          // Auto-retry logic
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000);
          }
        }
      }
    };
    
    // Try to fetch data immediately
    fetchData();
    
    // If still loading after 1 second, try to trigger via user interaction simulation
    const timeoutId = setTimeout(() => {
      if (loading && !hasAttemptedInitialLoad.current) {
        console.log("Initial load taking too long, simulating user interaction");
        // Simulate a click event on the document
        document.dispatchEvent(new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        }));
        
        // Also try to focus on the window
        window.focus();
      }
    }, 1000);

    // Cleanup function
    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [slug, retryCount]);

  // Replace the setTimeout section with this:
const timeoutId = setTimeout(() => {
  if (loading && !hasAttemptedInitialLoad.current) {
    console.log("Automatically calling handleLoadingClick");
    handleLoadingClick();
  }
}, 500);

  // Effect to automatically click the loading text if API hasn't loaded
  useEffect(() => {
    if (loading && loadingTextRef.current && !hasAttemptedInitialLoad.current) {
      const intervalId = setInterval(() => {
        if (loadingTextRef.current && !hasAttemptedInitialLoad.current) {
          console.log("Simulating click on loading text...");
          loadingTextRef.current.click();
        }
      }, 800);
      
      return () => clearInterval(intervalId);
    }
  }, [loading]);

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    setLoading(true);
    hasAttemptedInitialLoad.current = false;
  };

  const handleLoadingClick = () => {
    console.log("Loading text was clicked!");
    
    // If API hasn't loaded yet, try to fetch data again on click
    if (!hasAttemptedInitialLoad.current) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(
            `https://adminbackend.base2brand.com/api/B2Badmin/slug/${slug}`,
            { timeout: 10000 }
          );
            
          setData(response.data);
          setLoading(false);
          hasAttemptedInitialLoad.current = true;
        } catch (error) {
          console.error("Error in manual fetch:", error);
          setError(error);
          setLoading(false);
        }
      };
      
      fetchData();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p 
              ref={loadingTextRef} 
              className="mt-2"
              onClick={handleLoadingClick}
              style={{ cursor: 'pointer' }}
            >
              Loading service details {!hasAttemptedInitialLoad.current && "..."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Failed to load page content</h4>
              <p>Sorry, we couldn't load the service details at this time.</p>
              <p className="mb-0">Error: {error.message}</p>
            </div>
            {retryCount >= 3 ? (
              <button className="btn btn-primary mt-3" onClick={handleRetry}>
                Try Again
              </button>
            ) : (
              <p>Retrying... ({retryCount + 1}/3)</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show 404 if no data
  if (!data || !data.data) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
          <div className="text-center">
            <h2>Page Not Found</h2>
            <p>Sorry, the service you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const PageMeta = {
    title: data?.data?.seoPageTitle || "Service Page",
    description: data?.data?.pageKeywords || "Professional services",
    image: "/img/portfolio/b1.png"
  };

  return (
    <div>
      <PageHead PageMeta={PageMeta} />
      <Header />
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
      <Footer />
    </div>
  );
}

export default Dynamicservicepage;