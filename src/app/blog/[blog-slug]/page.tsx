"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Head from "next/head";
import Header from "../../../../component/header";
import Footer from "../../../../component/footer";
import BlogListing from "../blog-listing";
import "../../blog/blog.css";
import PageHead from "../../../../component/PageHead";

interface Blog {
  pageTitle: string;
  slugUrl: string;
  pageDescription: string;
  imageUrl: string;
  heading: string;
  description: string;
}

function BlogDetail() {
  const pathname = usePathname();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // console.log('blog;;;;',blog);

  useEffect(() => {
    // Extract slug from the URL 
    // const { slug } = router.query // Make sure the slug corresponds to the dynamic part of your path ['/blog-detail/[slug]']
    // console.log(slug,'slugslug')
    
    // if (!slug) return; // Ensure there's a slug to fetch data for
    const parts = pathname.split('/');

    // Get the last part of the array, which is the slug
    const slug = parts.pop() || '';

    const fetchBlog = async () => {
      try {
        const response = await fetch(`https://adminbackend.base2brand.com/api/B2Badmin/blogs/slug/${slug}`);
        if (!response.ok) {
          throw new Error(`Blog not found: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log("Fetched data:", data);
        setBlog(data.blog);
      } catch (err) {
        // console.error("Fetching blog failed:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
 

    if (typeof slug === 'string') {
      fetchBlog();
    }
  }, [pathname]);

  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error: {error}</p>;
  // if (typeof window !== "undefined") {
  //     useEffect(() => {
  //         let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

  //         if (!canonicalLink) {
  //           // Create and append the canonical link if it doesn't exist
  //           canonicalLink = document.createElement("link");
  //           canonicalLink.rel = "canonical";
  //           document.head.appendChild(canonicalLink);
  //         }

  //         // Safely set the canonical link's href
  //         canonicalLink.href = window.location.href;
  //       }, [ window.location.href]);
  //     }

  const baseURL = "https://base2brand.com/blog";
  const wwwURL = "https://www.base2brand.com/blog";
  let canonical = '';

  if (typeof window !== "undefined" && blog?.slugUrl) {
    const isUsingWWW = window.location.href.includes("www.");

    // Replace spaces with hyphens and remove other special characters
    const formattedTitle = blog.slugUrl.replace(/\s+/g, '-').replace(/[^\w\-]/g, '').toLowerCase();

    canonical = isUsingWWW
      ? `${wwwURL}/${formattedTitle}`
      : `${baseURL}/${formattedTitle}`;
  }
  // console.log('blog?.pageTitle', blog?.pageTitle)
  const PageMeta = {
    title: blog?.pageTitle || "Default Blog Title",  // Fallback title
    description: blog?.pageDescription || "Default blog description.",  // Fallback description
    canonical: canonical,
    image: "/img/portfolio/b1.png",  // Image for sharing
  };

  // console.log('PageMeta:', PageMeta);

  return (
    <>
      <Header />
      <PageHead PageMeta={PageMeta} />
      <head>
        <meta property="og:title" content={PageMeta?.title} />
        <meta property="og:description" content={PageMeta.description} />
      </head>


      <div className="bgblack">
        <div className="container-fluid p-5 pb-5">
          <div className="row text-white mb-5 pb-5 justify-content-center g-0 g-lg-0 g-xl-5">
            <div className="col-md-9 mb-4">
              <div className="blog_section bg-dark">
                <img className="blogs w-100" src={blog?.imageUrl} alt="Blog" />
                <div className="p-4 pb-3 bgblack">
                  <h1 className="blog_desc mb-2">{blog?.heading} </h1>
                  <div className="title_description blog_detail_description" dangerouslySetInnerHTML={{ __html: blog?.description }}></div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <BlogListing />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BlogDetail;
