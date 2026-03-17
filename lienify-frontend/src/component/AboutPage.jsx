
import React from "react";
import { FaLink, FaShareAlt, FaEdit, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaLink style={{ fontSize: "22px", color: "#1dd9b0", flexShrink: 0 }} />,
    title: "Simple URL Shortening",
    desc: "Shortening a link should take seconds.With Lienify, you can instantly transform long URLs into clean, shareable links that look better and work everywhere.",
  },
  {
    icon: <FaShareAlt style={{ fontSize: "22px", color: "#8b5cf6", flexShrink: 0 }} />,
    title: "Generate Multiple Links Effortlessly",
    desc: "Need several links at once? Lienify allows you to create multiple shortened links quickly, making it easier to organize campaigns, resources, or different destinations without repeating the same steps.",
  },
  {
    icon: <FaEdit style={{ fontSize: "22px", color: "#c42db8", flexShrink: 0 }} />,
    title: "Meaningful Custom Links",
    desc: "Your links shouldn't look random. Lienify lets you create links that actually make sense — readable, memorable, and more personal to what you're sharing.",
  },
  {
    icon: <FaChartLine style={{ fontSize: "22px", color: "#1dd9b0", flexShrink: 0 }} />,
    title: "Fast and Reliable",
    desc: "When someone clicks your link, it should just work. Lienify ensures smooth and quick redirects so every link reaches its destination without delays.",
  },
];

const AboutPage = () => {
  return (
    <div className="lf-page lg:px-14 sm:px-8 px-5 pt-12 pb-16">
      <div className="lf-content xl:w-[65%] lg:w-[75%] sm:w-[85%] w-full mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "32px" }}
        >
          <h1
            className="font-bold font-roboto"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "-1px",
              marginBottom: "14px",
              color: "var(--txt-heading)",
            }}
          >
            About{" "}
            <span className="lf-grad-text">Lienify</span>
          </h1>
          <p style={{ color: "var(--txt-secondary)", fontSize: "15px", lineHeight: "1.78" }}>
             Lienify makes link sharing simpler and more thoughtful.
              Instead of dealing with long, cluttered URLs, Lienify helps you 
              turn them into clean, manageable links that are easy to share and easy to remember.
              Whether you're organizing resources, sharing projects, 
              or distributing content, Lienify gives you a simple way to create and manage links without unnecessary complexity.
          </p>
        </motion.div>

        {/* Feature items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="lf-about-item"
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: "var(--bg-pill)", border: "0.5px solid var(--border-mid)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <h2>{f.title}</h2>
                <p>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
