import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import TextField from './TextField';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: { username: "", email: "", password: "" },
        mode: "onTouched",
    });

    const registerHandler = async (data) => {
        setLoader(true);
        try {
            await api.post("/api/auth/public/register", data);
            reset();
            navigate("/login");
            toast.success("Registration Successful!");
        } catch (error) {
            console.log(error);
            toast.error("Registration Failed!");
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="lf-page min-h-[calc(100vh-64px)] flex justify-center items-center px-4">
            <motion.form
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit(registerHandler)}
                className="lf-form sm:w-[440px] w-[360px] py-8 sm:px-8 px-5"
            >
                <h1 className="lf-form-title">Register Here</h1>
                <hr className="lf-form-divider" />

                <div className="flex flex-col gap-4">
                    <TextField
                        label="UserName"
                        required
                        id="username"
                        type="text"
                        message="*Username is required"
                        placeholder="Type your username"
                        register={register}
                        errors={errors}
                    />
                    <TextField
                        label="Email"
                        required
                        id="email"
                        type="email"
                        message="*Email is required"
                        placeholder="Type your email"
                        register={register}
                        errors={errors}
                    />
                    <TextField
                        label="Password"
                        required
                        id="password"
                        type="password"
                        message="*Password is required"
                        placeholder="Type your password"
                        register={register}
                        min={6}
                        errors={errors}
                    />
                </div>

                <button
                    disabled={loader}
                    type="submit"
                    className="lf-btn-primary w-full mt-5"
                    style={{ borderRadius: "8px" }}
                >
                    {loader ? "Registering…" : "Register"}
                </button>

                <p className="lf-form-footer">
                    Already have an account?{" "}
                    <Link to="/login" className="lf-form-link">Login</Link>
                </p>
            </motion.form>
        </div>
    );
};

export default RegisterPage;
