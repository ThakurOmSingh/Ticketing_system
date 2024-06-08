import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { UseSelector, useSelector } from "react-redux";
import Dashboard from "./dashboard";
import Sidebar from "../components/Layout/sidebar";
import Header from "../components/Layout/header";
import Tickets from "./tickets";
import CreateTicket from "./createTicket";
import TicketDetail from "./ticketDetail";
import ManageUser from "./manageuser";
import CreateAdmin from "./createAdmin";
import UserDetail from "./userDetail";
// import ReopenTicket from './reopenTicket';
// import Correspondence from './correspondence';

const AppRoutes = () => {
  const [sideBar, setSideBar] = useState(true);

  return (
    <div className="w-100">
      <div className="d-flex flex-column ">
        <div className="d-flex w-100 p-2  mt-0 " style={{ minHeight: "60px", zIndex:3 }} >
          <Header sideBar={sideBar} setSideBar={setSideBar} />
        </div>
        <div className="d-flex ">
          <div className="d-flex " style={{ minWidth: "14%", maxWidth: "25%"  }}>
            <Sidebar sideBar={sideBar} />
          </div>
          <div className="d-flex " style={{ minWidth: "86%" }}>
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/ticket/create" element={<CreateTicket />} />

              <Route path="/ticket/detail" element={<TicketDetail/>} />
              <Route path="/users" element={<ManageUser/> } />
              <Route path="/users/create" element={<CreateAdmin/> } />
              <Route path='/user/details' element={<UserDetail/>} />

              {/* <Route path="/update-ticket" element={<EditTicket />}/> */}
              {/* <Route path="/create-ticket" element={< CreateTicket/>}/> */}
              <Route path="*" element={<Navigate to={`/dashboard`} />} />
              {/* <Route path="/reopen" element={<ReopenTicket />} /> */}
              {/* <Route path="/correspondence" element={<Correspondence />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppRoutes;
