import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const ErrorPage = ({ message }) => {
    const navigate = useNavigate();
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: "calc(100vh - 64px)",
            padding: "24px",
        }}>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lf-error-page"
                style={{ padding: "40px 48px", textAlign: "center", maxWidth: "480px" }}
            >
                <FaExclamationTriangle style={{ fontSize: "48px", color: "#c42db8", marginBottom: "16px" }} />
                <h1 style={{ color: "var(--txt-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
                    Oops! Something went wrong.
                </h1>
                <p style={{ color: "var(--txt-secondary)", marginBottom: "24px", fontSize: "14px" }}>
                    {message || "An unexpected error has occurred."}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="lf-btn-primary"
                >
                    Go back to home
                </button>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
