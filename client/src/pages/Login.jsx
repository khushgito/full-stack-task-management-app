import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/menu");
        }
    }, []);

    function handleLogin(e) {
        e.preventDefault();
        const username = usernameRef.current.value.trim();
        const password = passwordRef.current.value;

        if (!username) {
            toast.error("Username cannot be empty");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            setLoading(true);
            axios
                .post(`${BACKEND_URL}/api/auth/login`, {
                    username,
                    password,
                })
                .then((res) => {
                    localStorage.setItem("token", res.data.token);
                    navigate("/menu");
                })
                .catch((error) => {
                    toast.error(error.response.data.error);
                });
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="bg-gray-900 h-screen">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a
                        onClick={() => navigate("/menu")}
                        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                    >
                        Food Delivery App
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6">
                                <div>
                                    <label
                                        htmlFor="text"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Your Username
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="text"
                                        id="text"
                                        ref={usernameRef}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="khushPatel12"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Password
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        ref={passwordRef}
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <button
                                    disabled={loading}
                                    onClick={handleLogin}
                                    className="w-full text-white bg-blue-500 disabled:bg-blue-200 hover:bg-blue-600 transition-colors focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                >
                                    Sign in
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400 mx-auto">
                                    Don’t have an account yet?{" "}
                                    <a
                                        onClick={() => navigate("/register")}
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer"
                                    >
                                        Sign up
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
