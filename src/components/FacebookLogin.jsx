import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE_URL from "../utils/api";
const FacebookLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "940564397989831",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        axios
          .post(`${API_BASE_URL}/api/auth/facebook-login`, 
            { accessToken: response.authResponse.accessToken }, 
            { withCredentials: true }
          )
          .then((backendResponse) => {
            if (backendResponse.data.success) {
              const userData = backendResponse.data.user;
              login(userData);
              localStorage.setItem("cachedUser", JSON.stringify(userData));
              localStorage.setItem("cachedPages", JSON.stringify(userData.pages));
              navigate("/home");
            }
          })
          .catch((error) => console.error("مشكلة في تسجيل الدخول:", error));
      } else {
        console.error("فشل تسجيل الدخول!");
      }
    }, { scope: "public_profile,email,pages_show_list,pages_messaging,pages_manage_metadata" });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 text-center" style={{ width: "400px" }}>
        <h3 className="mb-3">تسجيل الدخول</h3>
        <button className="btn btn-primary" onClick={handleFacebookLogin}>
          <i className="bi bi-facebook me-2"></i> تسجيل الدخول بفيسبوك
        </button>
      </div>
    </div>
  );
};

export default FacebookLogin;