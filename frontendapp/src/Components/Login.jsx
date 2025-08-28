import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../userSlice";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl } from "../apiconfig";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();


  useEffect(() => {

    localStorage.clear();

  }, []);
  const onSubmit = async (formData) => {
    try {
      const response = await axios.post(
        apiUrl+"/user/login",
        formData
      );
if(response.status==200)
{

if(response.data.message=="Invalid Credentials")
{
  setError("password", {
    type: "manual",
    message: "Invalid Email or Password",
  });
}
else{
  
  const user = response.data.userInformation;
  console.log("response.data",response.data);
  localStorage.setItem("token", response.data.token);

  let userData = {
    role: user.role,
    userId: user._id,
    userName: user.firstName + " " + user.lastName,
  };

  localStorage.setItem("userData", JSON.stringify(userData));
  if (user.role === "seller") {
    navigate("/sellerviewmobiles");
  } else {
    navigate("/mobilelist");
  }
}


}

    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <div className="error">{errors.email.message}</div>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <div className="error">{errors.password.message}</div>
                )}
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
            <div className="signup-link">
              Don't have an account? <Link to="/register">Signup</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
