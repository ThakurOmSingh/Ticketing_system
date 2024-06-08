// Header.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, SideNav, SimApps, SimLogo } from "../../Assets/svg";
import { useSelector } from "react-redux";
import { userData } from "../../store/slice/userSlice";
import "../../resources/header.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { UNO_URL, apiURL } from "../../env";

const Header = ({ sideBar, setSideBar }) => {

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState("");
  const configData = useSelector(state => state.config.configData)
  const userData = useSelector(state => state.user.userData)


  let token = localStorage.getItem("token");
  const headers = useMemo(()=>({
      Authorization: `Bearer ${token}`,
  }),[token]);


  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await axios.post(`${UNO_URL}/api/auth/logout`, {},{
      headers :{
        'Authorization' : `Bearer ${userData.token}`
      }
    })
    localStorage.clear()
    window.location.href= `${configData.redirectUri}`;
  };
  useEffect(() => {
    if (alert == "") {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setDropdownVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLogoutOpen(false);
  };



  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };



  useEffect(() => {
    setUserName(userData.user.name);
    setEmail(userData.user.email);
  }, [token]);

  return (
    <>

      <div className="position-fixed d-flex w-100 bg-white header-main justify-content-center  ">
        <div>{/* sidenav button here  */}</div>
        <div>
          <SimLogo />
        </div>
        <div className="w-100 d-flex align-items-center">
          {/* <div className="search-container">
            <div className="search-icon">
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search Something"
              className="search-input"
            />
          </div> */}

          <div className="d-flex flex-row-reverse align-items-center me-5 w-100">
            <div>
              <SimApps />
            </div>
            <div className="user-details">
              <div className="user-name">{userData.user.name}</div>
              <div className="user-role">{userData.user.designation != "" ? userData.user.designation : "Employee"}</div>
            </div>
            <div className="dropdown">
              <div onClick={() => toggleDropdown()}>
                <img
                  className="user-image mx-3 "
                  src={userData.user.avatar}
                  alt="User Avatar"
                />
              </div>
              {dropdownVisible && (
                <div
                  ref={dropdownRef}
                  className="dropdown-menu position-absolute  drop p-3 z-5 z-2 "
                  style={{ display: "block" }}
                >
                  <div className=" text-lowercase  fw-medium ">
                    {userData.user.email}
                  </div>
                  <div className=" dropdown-divider "></div>

                  <div className=" dropdown-divider logout-divider"></div>
                  <div>
                    <button
                      className="border-0 text-danger bg-transparent z-5"
                      onClick={() => {
                        setLogoutOpen(true);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


        <Dialog
          open={logoutOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you really want to exit???
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="button-custom m-3 px-5" onClick={handleClose}>
              No
            </button>
            <button
              className=" text-light bg-danger m-3 px-5"
              onClick={handleLogout}
              autoFocus
            >
              Yes
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Header;
