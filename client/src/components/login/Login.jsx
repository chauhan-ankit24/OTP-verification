import { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../StateContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const navigate = useNavigate();
    const { setuser } = useGlobalContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem("username");
        const storedRememberMe = localStorage.getItem("checkbox");

        if (storedRememberMe === "true") {
            setRememberMe(true);
            setEmail(storedEmail || "");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('https://otp-verify-backend.onrender.com/Login', { email, password });

            if (data.status === 400) {
                toast.error(data.msg, {
                    style: {
                        backgroundColor: 'white',
                        color: '#1e4d91',
                    },
                });
            } else if (data.status === 500) {
                toast.error('Internal server error', {
                    style: {
                        backgroundColor: 'white',
                        color: '#1e4d91',
                    },
                });
            } else if (data.status === 200) {
                console.log(data.user, "datauser");
                setuser(data.user);
                if (rememberMe) {
                    localStorage.setItem("username", email);
                    localStorage.setItem("checkbox", "true");
                } else {
                    localStorage.removeItem("username");
                    localStorage.removeItem("checkbox");
                }
                navigate('/Landing');
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed', {
                style: {
                    backgroundColor: 'white',
                    color: '#1e4d91',
                },
            });
        }
    };



    return (
        <>
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login_head">
                        Login to your account
                    </div>
                    <form className="login_form">
                        <div className="login_form_in">
                            <label htmlFor="email" className="login_label">Email</label>
                            <input type="email" id="email" className="login_input1" placeholder="john@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="login_form_in">
                            <label htmlFor="pass" className="login_label">Password</label>
                            <input type="password" placeholder="*************" id="pass" className="login_input2" value={password} onChange={(e) => setPassword(e.target.value)} />
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

                        <input
                            className="login_form_login"
                            type="submit"
                            value="Login"
                            id="signUpButton"
                            onClick={(e) => handleLogin(e)}
                        />
                    </form>
                    <div className="login_bottom">
                        <span>No account?</span> {" "}
                        <div className="login_bottom_sign" onClick={() => navigate("/Register")}>Sign Up</div>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </>
    );
};

export default Login