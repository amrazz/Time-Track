import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import useApi from "../../api/useApi";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const AuthSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/\d/, "Must contain at least one number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const Register = () => {
  const api = useApi();
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        full_name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
      };
      const response = await api.post("/auth/register", payload);
      if (response.status === 200) {
        toast.success("User registered successfully.");
        resetForm();
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Email already registered.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 min-h-screen flex justify-center items-center px-4 overflow-hidden">
      <ToastContainer />
      <motion.div
        className="w-full max-w-md px-8 py-6 backdrop-blur-3xl bg-white/5 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Register
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={AuthSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-3">
              {/* First and Last Name */}
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-white mb-1">
                    First Name
                  </label>
                  <Field
                    name="firstName"
                    type="text"
                    className="w-full p-2 text-sm border text-white border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-xs mt-1 min-h-[18px]"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-white mb-1">
                    Last Name
                  </label>
                  <Field
                    name="lastName"
                    type="text"
                    className="w-full p-2 text-sm border text-white border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-xs mt-1 min-h-[18px]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full p-2 text-sm border text-white border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-1 min-h-[18px]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full p-2 text-sm border text-white border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1 min-h-[18px]"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="w-full p-2 text-sm border text-white border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-xs mt-1 min-h-[18px]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg transition duration-300"
              >
                Register
              </button>

              {/* Link to Login */}
              <div className="text-center mt-3 text-sm text-white">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-purple-400 hover:underline font-medium"
                >
                  Login
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Register;
