import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ShortenUrlPage = () => {
    const { url } = useParams();
    console.log("SHORT URL PAGE LOADED");

    useEffect(() => {
        if (url) {
            // window.location.href = import.meta.env.VITE_BACKEND_URL + `/${url}`;
           window.location.href = `${import.meta.env.VITE_BACKEND_URL}/s/${url}`;
        }
    }, [url]);
  return <p>Redirecting...</p>;
}

export default ShortenUrlPage