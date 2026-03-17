import { useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import { useStoreContext } from "../contextApi/ContextApi";
import api from "../api/api";
import toast from "react-hot-toast";

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();
  const urlInputRef = useRef(null);

  const [inputUrl, setInputUrl] = useState("");
  const [suggestions, setSuggestions] = useState([]); // 3 slug strings
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [savingSlug, setSavingSlug] = useState(""); // which slug is being saved
  const [savedResult, setSavedResult] = useState(null); // the saved UrlMappingDTO
  const [currentOriginalUrl, setCurrentOriginalUrl] = useState("");

  // ── not logged in: redirect to login ──────────────────────────────────
  const goToDashboard = () => {
    if (!token) navigate("/login");
    else navigate("/dashboard");
  };

  const handleCreateShortLinkClick = () => {
    if (!token) {
      navigate("/login");
    } else {
      // Scroll / focus the URL bar
      urlInputRef.current?.focus();
      urlInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // ── logged in: call /suggest, show 3 options ──────────────────────────
  const handleShorten = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!inputUrl.trim()) {
      toast.error("Please paste a URL first");
      return;
    }

    // Reset previous results
    setSuggestions([]);
    setSavedResult(null);
    setCurrentOriginalUrl(inputUrl.trim());
    setLoadingSuggest(true);

    try {
      const { data } = await api.post(
        "/api/urls/suggest",
        { originalUrl: inputUrl.trim() },
        { headers: { Authorization: "Bearer " + token } }
      );
      setSuggestions(data); // array of 3 slug strings
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setLoadingSuggest(false);
    }
  };

  // ── user picks a slug → save it ───────────────────────────────────────
  const handleSelectSlug = async (slug) => {
    setSavingSlug(slug);
    try {
      const { data } = await api.post(
        "/api/urls/shorten-selected",
        { originalUrl: currentOriginalUrl, selectedSlug: slug },
        { headers: { Authorization: "Bearer " + token } }
      );
      setSavedResult(data);
      setSuggestions([]);
      setInputUrl("");
      toast.success("Short link created!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save link. Please try again.");
    } finally {
      setSavingSlug("");
    }
  };

  const handleNewShorten = () => {
    setSavedResult(null);
    setSuggestions([]);
    setInputUrl("");
    urlInputRef.current?.focus();
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  return (
    <div className="lf-page">
      <div className="lf-blob lf-blob-1" />
      <div className="lf-blob lf-blob-2" />
      <div className="lf-blob lf-blob-3" />

      <div className="lf-content">

        {/* ── HERO ── */}
        <div className="lg:px-14 sm:px-8 px-6 pt-16 pb-6">
          <div className="max-w-2xl mx-auto text-center">

            {/* Pills */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}
            >
              <span className="lf-pill">URL shortening</span>
              <span className="lf-pill">Link analytics</span>
              <span className="lf-pill">Fast redirects</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: -32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lf-heading font-bold font-roboto"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
                letterSpacing: "-1.8px",
                lineHeight: "1.06",
                marginBottom: "18px",
              }}
            >
              Shorten. Share.{" "}
              <span className="lf-grad-text">Own your links.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lf-body"
              style={{ fontSize: "15px", lineHeight: "1.78", marginBottom: "32px" }}
            >
              Lienify turns long, messy URLs into clean, shareable links in seconds —
              with analytics built in so you always know what's working.
            </motion.p>

            {/* URL bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lf-url-bar"
              style={{ marginBottom: "16px", maxWidth: "560px", margin: "0 auto 16px" }}
            >
              <input
                ref={urlInputRef}
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  // Clear old suggestions when user types new URL
                  if (suggestions.length > 0) setSuggestions([]);
                  if (savedResult) setSavedResult(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                placeholder="Paste your long URL here…"
              />
              <button onClick={handleShorten} disabled={loadingSuggest}>
                {loadingSuggest ? "…" : "Shorten →"}
              </button>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px" }}
            >
              <button onClick={goToDashboard} className="lf-btn-primary">
                Manage Links
              </button>
              <button onClick={handleCreateShortLinkClick} className="lf-btn-ghost">
                Create Short Link
              </button>
            </motion.div>

            {/* ── SUGGESTIONS BLOCK ── */}
            <AnimatePresence>
              {loadingSuggest && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    background: "var(--bg-card)",
                    border: "0.5px solid var(--border-card)",
                    borderRadius: "14px",
                    padding: "28px 24px",
                    maxWidth: "560px",
                    margin: "0 auto",
                    backdropFilter: "blur(12px)",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "var(--txt-muted)", fontSize: "14px" }}>
                    Generating suggestions…
                  </p>
                </motion.div>
              )}

              {suggestions.length > 0 && !loadingSuggest && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: "var(--bg-card)",
                    border: "0.5px solid var(--border-card)",
                    borderRadius: "14px",
                    padding: "24px",
                    maxWidth: "560px",
                    margin: "0 auto",
                    backdropFilter: "blur(12px)",
                    boxShadow: "var(--card-shadow)",
                    textAlign: "left",
                  }}
                >
                  <p style={{
                    color: "var(--txt-muted)",
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                  }}>
                    Pick a short link
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {suggestions.map((slug, i) => (
                      <motion.div
                        key={slug}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "var(--bg-input)",
                          border: "0.5px solid var(--border-input)",
                          borderRadius: "10px",
                          padding: "12px 16px",
                          gap: "12px",
                        }}
                      >
                        <span style={{
                          fontFamily: "monospace",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--txt-link)",
                        }}>
                          {backendUrl}/s/{slug}
                        </span>
                        <button
                          onClick={() => handleSelectSlug(slug)}
                          disabled={savingSlug === slug}
                          style={{
                            background: "linear-gradient(135deg, #1dd9b0, #c42db8)",
                            color: "#fff",
                            border: "none",
                            padding: "7px 18px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            opacity: savingSlug === slug ? 0.6 : 1,
                            flexShrink: 0,
                          }}
                        >
                          {savingSlug === slug ? "Saving…" : "Use this"}
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <p style={{
                    color: "var(--txt-muted)",
                    fontSize: "12px",
                    marginTop: "12px",
                    textAlign: "center",
                  }}>
                    Choose one — it will be saved to your dashboard
                  </p>
                </motion.div>
              )}

              {savedResult && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    background: "var(--bg-card)",
                    border: "0.5px solid var(--border-mid)",
                    borderRadius: "14px",
                    padding: "24px",
                    maxWidth: "560px",
                    margin: "0 auto",
                    backdropFilter: "blur(12px)",
                    boxShadow: "var(--card-shadow)",
                    textAlign: "center",
                  }}
                >
                  <p style={{
                    color: "var(--txt-muted)",
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}>
                    Your short link is ready
                  </p>
                  <p style={{
                    fontFamily: "monospace",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "16px",
                    background: "linear-gradient(90deg, #1dd9b0, #8b5cf6, #c42db8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    {backendUrl}/s/{savedResult.shortUrl}
                  </p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${backendUrl}/s/${savedResult.shortUrl}`);
                        toast.success("Copied!");
                      }}
                      className="lf-copy-btn"
                    >
                      Copy link
                    </button>
                    <button onClick={handleNewShorten} className="lf-btn-ghost">
                      Shorten another
                    </button>
                    <button onClick={goToDashboard} className="lf-btn-ghost">
                      View dashboard
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ── FEATURES ── */}
        <div className="lg:px-14 sm:px-8 px-6 pb-16 pt-8">
          <motion.p
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lf-section-heading font-roboto font-bold text-3xl text-center"
            style={{ letterSpacing: "-0.5px", marginBottom: "36px", maxWidth: "580px", marginLeft: "auto", marginRight: "auto" }}
          >
            Trusted by individuals and teams at the world's best companies
          </motion.p>

          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-6 gap-5">
            <Card
              title="Simple URL Shortening"
              desc="Create short, memorable URLs in a few clicks. Our intuitive interface means zero setup — just paste and go."
              barColor="linear-gradient(90deg, #1dd9b0, #5dcaa5)"
            />
            <Card
              title="Powerful Analytics"
              desc="Track clicks, geographic data, and referral sources from your dashboard to understand exactly how your links perform."
              barColor="linear-gradient(90deg, #5dcaa5, #8b5cf6)"
            />
            <Card
              title="Enhanced Security"
              desc="Every shortened URL is protected with advanced encryption. Your links and your users' data stay safe."
              barColor="linear-gradient(90deg, #8b5cf6, #c42db8)"
            />
            <Card
              title="Fast and Reliable"
              desc="Lightning-fast redirects and solid infrastructure mean your links are always on, always responsive."
              barColor="linear-gradient(90deg, #c42db8, #1dd9b0)"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
