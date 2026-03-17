
import React, { useState } from 'react'
import Graph from './Graph'
import { useStoreContext } from '../../contextApi/ContextApi'
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'
import ShortenPopUp from './ShortenPopUp'
import { FaLink } from 'react-icons/fa'
import ShortenUrlList from './ShortenUrlList'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import { motion } from 'framer-motion'

const DashboardLayout = () => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [shortenPopUp, setShortenPopUp] = useState(false);

    const { isLoading, data: myShortenUrls, refetch } = useFetchMyShortUrls(token, onError);
    const { isLoading: loader, data: totalClicks } = useFetchTotalClicks(token, onError);

    function onError() { navigate("/error"); }

    return (
        <div
            className="lf-page lg:px-14 sm:px-8 px-4"
            style={{ minHeight: "calc(100vh - 64px)" }}
        >
            {loader ? (
                <Loader />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:w-[92%] w-full mx-auto py-12"
                >
                    {/* Graph card */}
                    <div
                        className="lf-card"
                        style={{ padding: "24px", marginBottom: "20px", height: "400px", position: "relative" }}
                    >
                        {totalClicks.length === 0 && (
                            <div style={{
                                position: "absolute", inset: 0,
                                display: "flex", flexDirection: "column",
                                justifyContent: "center", alignItems: "center",
                                zIndex: 2,
                            }}>
                                <h1 style={{ color: "var(--txt-heading)", fontWeight: 700, fontSize: "1.2rem", marginBottom: "6px" }}>
                                    No Data For This Time Period
                                </h1>
                                <p style={{ color: "var(--txt-secondary)", fontSize: "14px", textAlign: "center", maxWidth: "320px" }}>
                                    Share your short link to view where your engagements are coming from
                                </p>
                            </div>
                        )}
                        <Graph graphData={totalClicks} />
                    </div>

                    {/* Create button */}
                    <div style={{ textAlign: "right", marginBottom: "24px" }}>
                        <button
                            className="lf-create-btn"
                            onClick={() => setShortenPopUp(true)}
                        >
                            Create a New Short URL
                        </button>
                    </div>

                    {/* Links list */}
                    <div>
                        {!isLoading && myShortenUrls.length === 0 ? (
                            <div style={{ display: "flex", justifyContent: "center", paddingTop: "48px" }}>
                                <div
                                    className="lf-card"
                                    style={{ display: "flex", gap: "10px", alignItems: "center", padding: "20px 28px" }}
                                >
                                    <p style={{ color: "var(--txt-secondary)", fontWeight: 600, fontSize: "15px", margin: 0 }}>
                                        You haven't created any short link yet
                                    </p>
                                    <FaLink style={{ color: "#8b5cf6", fontSize: "18px" }} />
                                </div>
                            </div>
                        ) : (
                            <ShortenUrlList data={myShortenUrls} />
                        )}
                    </div>
                </motion.div>
            )}

            <ShortenPopUp
                refetch={refetch}
                open={shortenPopUp}
                setOpen={setShortenPopUp}
            />
        </div>
    );
};

export default DashboardLayout;
