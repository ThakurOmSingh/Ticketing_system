import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import jwtEncode from "jwt-encode";
import { store } from "./store/store";
import { apiURL, token, UNO_URL, applicationId } from "./env";
import { useEffect, useState } from "react";
import axios from "axios";
import AppRoutes from "./pages/appRoutes";
import { useDispatch, useSelector } from "react-redux";
import { userData, userToken } from "./store/slice/userSlice";
import { saveConfigData } from "./store/slice/configSlice";
// import ReopenTicket from "./pages/reopenTicket";

const App = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getConfiguration = async () => {
    try {
      let response = await axios.get(`${UNO_URL}/api/application/configuration/${applicationId}`
      );
      const data = response.data.data.data;
      dispatch(saveConfigData(data))
      getUserDetails(data);
    } catch (error) {
      console.log("Something Went wrong");
      console.log(error);
    }
  };

  const getUserDetails = async (config) => {
    const urlParams = new URLSearchParams(window.location.search);
    const _tokenParam = urlParams.get("referrer");
    let token = "";
    var initialPath = null;

    if (_tokenParam) {
      const decoded = jwtDecode(_tokenParam);
      localStorage.setItem("token", decoded.token);
      token = decoded.token;
      initialPath = decoded.redirectUri;
    } else if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }

    try {
      let {data} = await axios.get(`${config.UNO_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        localStorage.setItem("token", data.data.token);
        const _data = {
          token: data.data.token,
          user: data.data.user,
        };
        dispatch(userData(_data));
        setLoading(false);
        

    } catch (error) {
      localStorage.clear();
      sessionStorage.clear();
      const payload = {
        origin: window.location.origin,
        redirectUri: window.location.pathname,
      };
      const token = jwtEncode(payload, "");
      return (window.location.href = `${config.redirectUri}?referrer=${token}`);
    }
  };

  useEffect(() => {
    getConfiguration();
  }, []);

  return (
    <>
      <div className="d-flex m-0 p-0">
        <Router>{loading ? <h1>Loading</h1> : <AppRoutes />}</Router>
      </div>
    </>
  );
};

export default App;
