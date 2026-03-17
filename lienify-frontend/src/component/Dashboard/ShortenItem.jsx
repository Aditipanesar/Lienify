
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import api from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreContext } from '../../contextApi/ContextApi';
import { Hourglass } from 'react-loader-spinner';
import Graph from './Graph';

const ShortenItem = ({ originalUrl, shortUrl, clickCount, createdDate }) => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const [analyticToggle, setAnalyticToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [analyticsData, setAnalyticsData] = useState([]);

    const analyticsHandler = (shortUrl) => {
        if (!analyticToggle) setSelectedUrl(shortUrl);
        setAnalyticToggle(!analyticToggle);
    };

    const fetchMyShortUrl = async () => {
        setLoader(true);
        try {
            const startDate = dayjs().subtract(1, "year").startOf("day").format("YYYY-MM-DDTHH:mm:ss");
            const endDate = dayjs().endOf("day").format("YYYY-MM-DDTHH:mm:ss");
            const { data } = await api.get(
                `/api/urls/analytics/${selectedUrl}?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                    },
                }
            );
            setAnalyticsData(data);
            setSelectedUrl("");
        } catch (error) {
            navigate("/error");
            console.log(error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (selectedUrl) fetchMyShortUrl();
    }, [selectedUrl]);

    return (
        <div className="lf-item">
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                flexWrap: "wrap",
                paddingBottom: "12px",
            }}>
                {/* Left: URL info */}
                <div style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <Link
                            target="_blank"
                            className="lf-item-link"
                            to={`${import.meta.env.VITE_BACKEND_URL}/s/${shortUrl}`}
                            style={{ fontSize: "15px", fontFamily: "var(--font-mono, monospace)" }}
                        >
                            {import.meta.env.VITE_BACKEND_URL + "/s/" + shortUrl}
                        </Link>
                        <FaExternalLinkAlt style={{ color: "var(--item-link)", fontSize: "12px", flexShrink: 0 }} />
                    </div>

                    <p className="lf-item-orig" style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "480px",
                        marginBottom: "12px",
                    }}>
                        {originalUrl}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <span className="lf-item-clicks" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "14px" }}>
                            <MdOutlineAdsClick style={{ fontSize: "18px" }} />
                            {clickCount} {clickCount === 1 ? "Click" : "Clicks"}
                        </span>
                        <span className="lf-item-meta" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                            <FaRegCalendarAlt />
                            {dayjs(createdDate).format("MMM DD, YYYY")}
                        </span>
                    </div>
                </div>

                {/* Right: Action buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <CopyToClipboard
                        onCopy={() => setIsCopied(true)}
                        text={`${import.meta.env.VITE_BACKEND_URL}/s/${shortUrl}`}
                    >
                        <button className="lf-copy-btn">
                            {isCopied ? "Copied" : "Copy"}
                            {isCopied ? <LiaCheckSolid /> : <IoCopy />}
                        </button>
                    </CopyToClipboard>

                    <button
                        className="lf-analytics-btn"
                        onClick={() => analyticsHandler(shortUrl)}
                    >
                        Analytics
                        <MdAnalytics />
                    </button>
                </div>
            </div>

            {/* Analytics graph section */}
            {analyticToggle && (
                <div style={{
                    borderTop: "0.5px solid var(--border-soft)",
                    marginTop: "8px",
                    paddingTop: "16px",
                    minHeight: "280px",
                    position: "relative",
                }}>
                    {loader ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "260px" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                <Hourglass
                                    visible={true}
                                    height="48"
                                    width="48"
                                    colors={["#8b5cf6", "#c42db8"]}
                                />
                                <p style={{ color: "var(--txt-muted)", fontSize: "13px" }}>Loading analytics…</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {analyticsData.length === 0 && (
                                <div style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", flexDirection: "column",
                                    justifyContent: "center", alignItems: "center",
                                    zIndex: 2,
                                }}>
                                    <p style={{ color: "var(--txt-heading)", fontWeight: 700, fontSize: "1rem", marginBottom: "4px" }}>
                                        No Data For This Time Period
                                    </p>
                                    <p style={{ color: "var(--txt-secondary)", fontSize: "13px", textAlign: "center", maxWidth: "280px" }}>
                                        Share your short link to view where your engagements are coming from
                                    </p>
                                </div>
                            )}
                            <div style={{ height: "260px" }}>
                                <Graph graphData={analyticsData} />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShortenItem;
