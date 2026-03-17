
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "var(--footer-bg)",
        borderTop: "0.5px solid var(--border-soft)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "32px 0",
        position: "relative",
        zIndex: 1,
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        className="container mx-auto px-6 lg:px-14"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Brand */}
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "4px",
              background: "linear-gradient(90deg, #1dd9b0, #c42db8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Lienify
          </h2>
          <p style={{ fontSize: "13px", color: "var(--footer-muted)", margin: 0 }}>
            Turning long URLs into effortless connections.<br/>
           Simple, fast, and truly yours.
          </p>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: "13px", color: "var(--footer-muted)", margin: 0 }}>
          &copy; 2026 Lienify. All rights reserved.
        </p>

        {/* Socials */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
            <a
              key={i}
              href="#"
              style={{ color: "var(--footer-muted)", transition: "color 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "var(--footer-txt)")}
              onMouseOut={(e) => (e.currentTarget.style.color = "var(--footer-muted)")}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;


