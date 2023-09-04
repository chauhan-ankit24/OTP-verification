import { useState, useEffect } from "react";
import "../login/Login.css";
import "./Loader.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [otp, setOtp] = useState("");
    const [verify, setVerify] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem("username");
        const storedRememberMe = localStorage.getItem("checkbox");

        if (storedRememberMe === "true") {
            setRememberMe(true);
            setEmail(storedEmail || "");
        }
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://otp-verify-backend.onrender.com/Register", {
                name,
                email,
                password,
            });

            if (response.data.status === 200) {
                console.log("Sign up successful", response.data);
                if (rememberMe) {
                    localStorage.setItem("username", email);
                    localStorage.setItem("checkbox", "true");
                } else {
                    localStorage.removeItem("username");
                    localStorage.removeItem("checkbox");
                }
                toast.error("Registration Successfull");
                navigate("/Login");
            } else {
                console.error("Sign up failed:", response.data.msg);
                toast.error(response.data.msg);
            }
        } catch (error) {
            console.error("Sign up failed:", error);
            toast.error("An error occurred during sign up.");
        }
    };


    const sendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post("https://otp-verify-backend.onrender.com/SendOTP", {
                email
            });

            if (response.data && response.data.status === 400) {
                toast.error(response.data.msg);
                setLoading(false);
            } else {
                toast.error("OTP Send Succesfully");
                setLoading(false);
            }
        } catch (error) {
            toast.error("An error occurred while sending OTP.");
            setLoading(false);
        }
    };


    const handleVerification = async (e) => {
        e.preventDefault();
        console.log(email, otp);
        try {
            const response = await axios.post('https://otp-verify-backend.onrender.com/VerifyOTP', { email, otp });
            console.log("res is", response)
            if (response.data === 'OTP verified successfully') {
                setVerify(true);
                toast.error('Email Verified');
            } else {
                toast.error('OTP verification failed');
                toast.error('Enter correct OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Error verifying OTP');
        }
    };


    return (
        <div className="login-wrapper">
            <div className="login-container2">
                <div className="login_head">
                    Create Account
                </div>
                <form className="login_form" onSubmit={handleSignUp}>
                    <div className="login_form_in">
                        <label className="login_label" htmlFor="text">Name</label>
                        <input
                            placeholder="John Doe"
                            className="login_input1"
                            type="text"
                            id="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="login_form_in">
                        <label className="login_label" htmlFor="email">Email</label>
                        <input
                            placeholder="john@gmail.com"
                            className="login_input1"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login_form_in">
                        <label className="login_label" htmlFor="pass">Password</label>
                        <input
                            placeholder="************"
                            className="login_input2"
                            type="password"
                            id="pass"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="login_form_rem">
                        <input
                            className="login_form_rem_box"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="login_form_rem_label" htmlFor="rememberMe">Remember Me</label>
                    </div>
                    {verify ? <input className="login_form_login" type="submit" value="Sign Up" id="signUpButton" /> :
                        <div className="otp">
                            <input
                                placeholder="Enter OTP"
                                className="otp_input"
                                type="text"
                                id="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            {!loading ? <button onClick={sendOTP} className="otp_button">send OTP</button> : <span className="loader"></span>}
                            <button className="otp_verify" onClick={handleVerification}>
                                Verify this Email
                            </button>
                        </div>}
                </form>
                <div className="login_bottom">
                    Already have an account?{" "}
                    <div className="login_bottom_sign" onClick={() => navigate("/Login")}>Login</div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default SignUp
