
import React, { useState } from 'react'
import { useStoreContext } from '../../contextApi/ContextApi';
import { useForm } from 'react-hook-form';
import TextField from '../TextField';
import { Tooltip } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import api from '../../api/api';
import toast from 'react-hot-toast';

const CreateNewShorten = ({ setOpen, refetch }) => {
    const { token } = useStoreContext();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: { originalUrl: "" },
        mode: "onTouched",
    });

    const createShortUrlHandler = async (data) => {
        setLoading(true);
        try {
            const cleanUrl = data.originalUrl.trim();
            try {
                new URL(cleanUrl);
            } catch {
                toast.error("Please enter a valid URL");
                setLoading(false);
                return;
            }

            const { data: res } = await api.post("/api/urls/shorten", data, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });

            const shortenUrl = `${import.meta.env.VITE_BACKEND_URL}/s/${res.shortUrl}`;
            navigator.clipboard.writeText(shortenUrl).then(() => {
                toast.success("Short URL copied to clipboard!", {
                    position: "bottom-center",
                    duration: 3000,
                });
            });

            reset();
            setOpen(false);
            if (refetch) refetch();
        } catch (error) {
            toast.error("Failed to create short URL");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="lf-form"
            style={{
                width: "min(450px, 92vw)",
                padding: "32px 32px 28px",
                position: "relative",
            }}
        >
            {/* Close button */}
            {!loading && (
                <Tooltip title="Close">
                    <button
                        onClick={() => setOpen(false)}
                        style={{
                            position: "absolute",
                            top: "14px",
                            right: "14px",
                            background: "var(--bg-pill)",
                            border: "0.5px solid var(--border-mid)",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--txt-secondary)",
                            transition: "background 0.2s",
                        }}
                        onMouseOver={e => e.currentTarget.style.background = "var(--border-soft)"}
                        onMouseOut={e => e.currentTarget.style.background = "var(--bg-pill)"}
                    >
                        <RxCross2 style={{ fontSize: "16px" }} />
                    </button>
                </Tooltip>
            )}

            {/* Title */}
            <h1 className="lf-form-title" style={{ marginBottom: "4px" }}>
                Create Short URL
            </h1>
            <hr className="lf-form-divider" />

            <form onSubmit={handleSubmit(createShortUrlHandler)}>
                <div style={{ marginBottom: "20px" }}>
                    <TextField
                        label="Enter URL"
                        required
                        id="originalUrl"
                        placeholder="https://example.com"
                        type="url"
                        message="URL is required"
                        register={register}
                        errors={errors}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="lf-btn-primary"
                    style={{
                        width: "100%",
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Creating…" : "Create & Copy"}
                </button>
            </form>
        </div>
    );
};

export default CreateNewShorten;
