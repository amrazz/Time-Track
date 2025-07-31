import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import useApi from "../../api/useApi";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "motion/react";
import qs from "qs";

import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthProvider";

const AuthSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/\d/, "Must contain at least one number"),
});

const Login = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { saveAuthData } = useAuth();

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = qs.stringify({
        username: values.email,
        password: values.password,
      });
      const response = await api.post("/auth/login", payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;
        const userResponse = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (userResponse.status === 200) {
          saveAuthData({
            accessToken : access_token,
            refreshToken : refresh_token,
            user: userResponse.data,
          });
          toast.success("User Logged in successfully.");
          resetForm();
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Email already registered.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 min-h-screen flex justify-center items-center px-4">
      <motion.div
        className="w-full max-w-md p-10 opacity-10 backdrop-blur-3xl bg-white/5 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={AuthSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-5">
              <div>
                <label className="block mb-1 font-semibold text-white">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full p-3 border text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-white">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full p-3 border text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition duration-300"
              >
                Login
              </button>

              <div className="text-center mt-4 text-sm text-white">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-purple-400 hover:underline font-medium"
                >
                  Register
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Login;
