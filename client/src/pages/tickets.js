import React, { useEffect, useMemo, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import "../resources/tickets.css"
import TicketTable from "../components/tickettable";
import { apiURL } from "../env";




const Tickets = () => {
  const {solvedCount , unSolvedCount } = useSelector((state) => state.ticket.ticketCount);
  const location = useLocation();
  const [assignedTickets , setAssignedTickets ] = useState([])
  const [key, setKey] = useState("Solved");
  const [totalTickets, setTotalTickets] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [showLoading, setShowLoading] = useState(true);

  let token = localStorage.getItem("token");

  const headers = useMemo(()=>({
      Authorization: `Bearer ${token}`,
  }),[token])


  const fetchTickets = async () => {
    try {
      let { data } = await axios.get(`${apiURL}/api/ticket/get/all/tickets`, {
        headers,
        params: {
          status: key === "Solved" ? "SOLVED" : "Unsolved",
          page: currentPage,
        },
      });
      setTickets(data.data);
      console.log("TICKETDATA")
      console.log(data.data)
      setShowLoading(false);

      if (key == "Solved") {
        setPageCount(Math.ceil(solvedCount / 10));
      } else {
        setPageCount(Math.ceil(unSolvedCount / 10));
        // setTotal(unSolvedCount)
      }
    } catch (error) {
      console.log(error);

    }
  };



  const handleChange = (event, value) => {
    setCurrentPage(value);
    fetchTickets();
  };


  useEffect(()=>{

    location.state ? setTickets(location.state.assignedTickets)  : <></>
  },[])



  useEffect(() => {
    fetchTickets();
  }, [key]);

  return showLoading ? (
    <div>Fetching data</div>
  ) : (
    <div
      className=" main-div rounded-3"

    >
      <div className="m-3">
        <div className="d-flex justify-content-between mx-4">
          <div>
            Total:{" "}
            <strong>{`${
              unSolvedCount + solvedCount
            } Tickets`}</strong>
          </div>
          <div>
          <Link to={"/ticket/create"}>
            <button className="rounded-2 bg-light border-0 ">
              Create Ticket
            </button>
          </Link>

          </div>
        </div>

        <div className="divisor z-1 ">
          <hr className=" z-n1 "/>
        </div>
      </div>


      <div className="m-3">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          >
          <Tab eventKey={"Solved"} title={`Solved (${solvedCount})`}>
          <TicketTable data={tickets} currentPage={currentPage} />
          </Tab>
          <Tab
            eventKey={"Unsolved"}
            title={`Unsolved (${unSolvedCount})`}
          >
            <TicketTable data={tickets} currentPage={currentPage} />
          </Tab>
        </Tabs>
      </div>
        {/* <div className="me-4 p-1">

           FILTER FOR APPLICATION
       <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown button
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a onClick={(e)=>{SettingsApplications(e.target.value)}}>{}</a></li>
  </ul>
</div>


        </div> */}


      <div>
      <div className="my-5">
        {/* <h6>{`Showing ${} - ${} of ${}`}</h6> */}
      </div>
      <div className="float-end">
        <Pagination
          count={pageCount}
          size="small"
          page={currentPage}
          onChange={handleChange}
        />
      </div>

      </div>

    </div>
  );
};


export default Tickets;
