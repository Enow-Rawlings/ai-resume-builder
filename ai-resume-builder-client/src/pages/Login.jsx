import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import api from '../configs/api.js'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice.js'
import { toast } from 'react-hot-toast'

const Login = () => {

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state"); 
  const [state, setState] = React.useState(urlState || "login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`api/users/${state}`, formData)
      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch(login(data));
        toast.success(data.message)
      }
    } catch (error) {
      // console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-87.5 w-full text-center bg-[#F3F4F4] border border-indigo-600 rounded-2xl px-8"
      >
        <h1 className="text-indigo-600 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Please {state} in to continue
        </p>

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-[#f3f4f4] border border-indigo-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
           <User2Icon size={16} color="indigo" />
              {" "}
              
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full bg-transparent text-indigo-600 placeholder-indigo-600 border-none outline-none "
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-[#f3f4f4] border border-indigo-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
         <Mail size={13} color="indigo"/>
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="w-full bg-transparent text-indigo-600 placeholder-indigo-600 border-none outline-none "
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className=" flex items-center mt-4 w-full bg-[#f3f4f4] border border-indigo-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
          {/* <Lock size={13} color="#9CA3AF"/> */}
          <Lock size={13} color="indigo"/>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-indigo-600 placeholder-indigo-600 border-none outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 text-left">
          <button className="text-sm text-indigo-600 hover:underline">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition "
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-indigo-400 hover:underline ml-1">
            click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
