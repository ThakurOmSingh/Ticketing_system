import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { UNO_URL, apiURL, path } from "../env";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useDispatch, useSelector } from "react-redux";
import "../resources/tickets.css";
import { allUsers, userData } from "../store/slice/userSlice";

const TicketDetail = () => {
  const dispatch = useDispatch();
  const QueryPriority = ["HIGH", "MEDIUM", "LOW"];

  const QueryStatus = ["NEW", "INPROGRESS", "SOLVED", "REOPEN"];

  const QueryType = ["NONE", "BUG", "SALES"];

  // const QueryActionType = [
  //   "PRIORITY",
  //   "STATUS",
  //   "TYPE",
  //   "ASSIGNED",
  //   "REOPEN",
  //   "MULTIPLE",
  // ];

  const [count, setCount] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [ticketDetails, setTicketDetails] = useState({});
  const [userDetails, setUserDetails] = useState([]);
  const [allAdminDetails, setAllAdminDetails] = useState([]);
  const [type, setType] = useState(ticketDetails.type);
  const [priority, setPriority] = useState(ticketDetails.priority);
  const [status, setStatus] = useState(ticketDetails.status);
  const [assignedTo, setAssignedTo] = useState("");
  const [formActive, setFormActive] = useState(false);
  const [actionType, setActionType] = useState("");
  const [comment, setComment] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [actionLog, setActionLog] = useState([]);
  const [showLogs , setShowLogs] = useState(false)
  const [logs , setLogs] = useState([])

  const location = useLocation();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const adminId = useSelector((state) => state.user.userData);
  const userData = useSelector((state) => state.user.userData);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );


// Getting details of all the admins----------------------
  const getAllAdmins = async () => {
    try {
      let { data } = await axios.get(`${UNO_URL}/api/user/list/${userData.user.groupId}`, {
        headers,
      });
      console.log("REQUEST SENT TO ",`${UNO_URL}/api/user/list/${userData.user.groupId}`)
      setAllAdminDetails(data.data);
      dispatch(allUsers());
    } catch (error) {
      console.log(error);
    }
  };

// function related to DIalog open and close--------------
  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseLogs = () =>{
    setShowLogs(false)
  }

 // function to fetch ticket history---------------------------
 const fetchHistory = async () =>{
  try {
    let { data } = await axios.get(`${apiURL}/api/ticket/fetch/history`, {
      params: {
        queryId: ticketDetails.id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setHistory(data.data);
  } catch (error) {
    console.log(error);
  }
}

// edit form on submit function ----------------------------
  const handleSubmit = async () => {
    setFormActive(false);
    setActionLog([])
    setComment("");
    let apiData = {
      id: ticketDetails.id,
      adminId: adminId.id,
      priority : priority ? priority : ticketDetails.priority,
      status : status ? status : ticketDetails.status ,
      type : type ? type : ticketDetails.type,
      assignedTo : assignedTo ? assignedTo : ticketDetails.assignedTo,
      actionType,
      actionLog,
      comment,
    };
    try {
      let { data } = await axios.post(
        `${apiURL}/api/ticket/update/ticket`,
        apiData,
        {
          headers,
        }
      );
      if(setShowHistory){
        fetchHistory()
      }
    } catch (error) {
      console.log(error);
    }
  };




  //Show histoory button logic
  const handleClick = async () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
        fetchHistory()
    }
  };



  useEffect(() => {
    getAllAdmins();
    setShowLoading(false);
    setTicketDetails(location.state.item);
  }, [showHistory]);






  return showLoading ? (
    <div>Fetching data</div>
  ) : (
    <div
      className="rounded-3"
      style={{
        backgroundColor: "rgb(234,243,252)",
        minHeight: "84vh",
        minWidth: "98%",
      }}
    >
      <div className="m-3">
        <div className="d-flex  flex-column ">
          <div className="d-flex justify-content-between mx-4">
            <div>
              <h4>Ticket Details</h4>
            </div>
            <div>
              <button
                className="rounded-2 bg-light border-0 "
                onClick={() => {
                  handleClick();
                }}
              >
                {showHistory ? "Ticket Details" : "Show History"}
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-between mx-4 mt-4">
            <div>
              <h6 className=" text-capitalize ">
                <span className=" fw-normal ">Created By : </span>
                {ticketDetails.userData.name}
              </h6>
            </div>
            <div>
              <h6>
                <span className=" fw-normal ">Email : </span>
                {ticketDetails.userData.email}
              </h6>
            </div>
            <div>
              <h6>
                <span className=" fw-normal ">Contact No. : </span>
                {ticketDetails.userData.phone ? ticketDetails.userData.phone : "Not Available"}
              </h6>
            </div>
          </div>
        </div>

        <div className="position-relative  ">
          <hr className=" z-n1 m-0" />
        </div>
      </div>

      <div className="p-3 d-flex  ">

    {/* ----------------------ticketDetails/history------------------  */}
        {showHistory ? (
          <div className="col-9">
            <h6>Ticket History</h6>
            <div
              className="col-9 d-flex justify-content-center"
              style={{ margin: "0 auto" }}
            >
              {history.length > 0 ? (
                <>
                  <Timeline position="alternate">
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        Created At{" "}
                        {moment(ticketDetails.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      </TimelineContent>
                    </TimelineItem>
                    {history. map((current,key) => {

                      return (
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent className="text-capitalize">
                            Updated At{" "}
                            {moment(current.createdAt).format(
                              "MMMM Do YYYY, h:mm a"
                            )}{" "}
                            <br /> Action Type :{" "}
                            {current.actionType.toLowerCase()} <br />{" "}

                            <button className="view" onClick={()=>{setShowLogs(!showLogs) ; setLogs(current.actionLog.logs)}}>{showLogs? "view less" : "view more"}</button>
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })}
                  </Timeline>
                </>
              ) : (
                <>
                  <Timeline position="alternate">
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        Created At{" "}
                        {moment(ticketDetails.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="col-9">
            <div className="d-flex col-12 ">
              <div className="col-4">
                <h6 className="text-muted ">Submitted At </h6>
                <h6>
                  {moment(ticketDetails.createdAt).format(
                    "MMMM Do YYYY, h:mm a"
                  )}
                </h6>
              </div>
              <div className="col-4">
                <h6 className="text-muted">Status</h6>
                <h6>{ticketDetails.status}</h6>
              </div>
              <div className="col-4">
                <h6 className="text-muted">Ticket Id</h6>
                <h6>{ticketDetails.uuid}</h6>
              </div>
            </div>

            <div className="d-flex flex-column mt-3">
              <h6 className="text-muted">Subject</h6>
              <p
                className="bg-light  p-2 ps-3 rounded-1 "
                style={{ width: "95%" }}
              >
                <h5 className="text-capitalize">{ticketDetails.title}</h5>
              </p>
            </div>

            <div className="d-flex flex-column mt-3">
              <h6 className="text-muted">Description</h6>
              <p
                className="bg-light  p-2 ps-3 rounded-1 "
                style={{ width: "95%", minHeight: "25vh" }}
              >
                <h5 className="text-capitalize">{ticketDetails.description}</h5>
              </p>
            </div>

            <div className="d-flex flex-column mt-3">
              <h6 className="text-muted">ScreenShots</h6>

              <h5 className="text-capitalize">
                {ticketDetails.files ? (
                  ticketDetails.files. map((current,key) => {
                    return (
                      <a
                        href={path + "/" + current.path.slice(8)}
                        target="_blank"
                        className="border-0 m-2 "
                        onClick={() => {}}
                      >
                        <img
                          src={`${path}/${current.path.slice(8)}`}
                          height={100}
                          width={100}
                        />
                      </a>
                    );
                  })
                ) : (
                  <></>
                )}
              </h5>
            </div>
          </div>
        )}
        {/* ---------------------------Edit Ticket--------------------------- section*/}
        <div
          className="col-3  p-3 bg-light rounded-2"
          style={{ minHeight: "64vh" }}
        >
          {/* edit ticket form */}
          <form onClick={() => setFormActive(true)}>
            <div className="form-group m-2 my-3 d-flex flex-column">
              <div>
                <label htmlFor="assignee" className="fw-bold ms-3">
                  Assignee
                </label>
              </div>

              <div className="d-flex justify-content-center">
                <select
                  className="assignee form-select w-50"
                  onChange={(e) => {
                    setAssignedTo(e.target.value);
                    setCount((prev) => prev + 1);

                     actionLog.push({
                      type: "Assigned",
                      prev: ticketDetails.assignedTo,
                      update: e.target.value,
                    });
                    if (count + 1 > 1) {
                      setActionType("MULTIPLE");
                    } else {
                      setActionType("ASSIGNED");
                    }
                  }}
                >
                  <option selected>
                    {ticketDetails.assignedTo == null
                      ? "None"
                      : ticketDetails.assignedTo}
                  </option>
                  {allAdminDetails. map((current,key) => (
                    <option key={current.email} value={current.email}>
                      {current.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group m-2 my-3 d-flex flex-column">
              <div>
                <label htmlFor="type" className="fw-bold ms-3">
                  Query Type
                </label>
              </div>

              <div className="d-flex justify-content-center">
                <select
                  className="type form-select w-50 text-capitalize"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setCount((prev) => prev + 1);

                     actionLog.push({
                      type: "Type",
                      prev: ticketDetails.type,
                      update: e.target.value,
                    });
                    if (count + 1 > 1) {
                      setActionType("MULTIPLE");
                    } else {
                      setActionType("TYPE");
                    }
                  }}
                >
                  {type === ticketDetails.type && (
                    <option
                      className="text-capitalize"
                      value={ticketDetails.type}
                    >
                      {ticketDetails.type.toLowerCase()}
                    </option>
                  )}
                  {QueryType. map((current,key) => (
                    <option
                      key={current}
                      className="text-capitalize"
                      value={current}
                    >
                      {current.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group m-2  my-3d-flex flex-column">
              <div>
                <label htmlFor="priority" className="fw-bold ms-3 f">
                  Priority
                </label>
              </div>

              <div className="d-flex justify-content-center">

                <select
                  className="assignee form-select w-50 text-capitalize"
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    setCount((prev) => prev + 1);

                     actionLog.push({
                      type: "Priority",
                      prev: ticketDetails.priority,
                      update: e.target.value,
                    });
                    if (count + 1 > 1) {
                      setActionType("MULTIPLE");
                    } else {
                      setActionType("PRIORITY");
                    }
                  }}
                >
                  {priority === ticketDetails.priority && (
                    <option
                      className="text-capitalize"
                      value={ticketDetails.priority}
                    >
                      {ticketDetails.priority.toLowerCase()}
                    </option>
                  )}
                  {QueryPriority. map((current,key) => (
                    <option
                      key={current}
                      className="text-capitalize"
                      value={current}
                    >
                      {current.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group m-2 my-3 d-flex flex-column">
              <div>
                <label htmlFor="assignee " className="fw-bold ms-3">
                  Status
                </label>
              </div>

              <div className="d-flex justify-content-center">

                <select
                  className="assignee form-select w-50 text-capitalize"
                  // value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setCount((prev) => prev + 1);
                     actionLog.push({
                      type: "Status",
                      prev: ticketDetails.status,
                      update: e.target.value,
                    });
                    if (count + 1 > 1) {
                      setActionType("MULTIPLE");
                    } else {
                      setActionType("STATUS");
                    }
                  }}
                >

                  {status === ticketDetails.status && (
                    <option
                      className="text-capitalize"
                      value={ticketDetails.status}
                    >
                      {ticketDetails.status.toLowerCase()}
                    </option>
                  )}
                  {QueryStatus. map((current,key) => (
                    <option
                      key={current}
                      className="text-capitalize"
                      value={current}
                    >
                      {current.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex mt-4 justify-content-center">
              {formActive ? (
                <button
                  className="edit-submit-button"
                  onClick={(e) => {
                    handleClickOpen(e);
                  }}
                >
                  Submit
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>

      {/* ---------------------------------------Dialog for action details-------------------------- */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
        }}
      >
        <DialogTitle className="fw-bold">Changes Detail</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Describe the actions you have taken while updating the Ticket
          </DialogContentText>
          <div>
            <label className="m-2 fw-normal">Select the Action Type</label>
            <select
              className="m-2 form-select  border-0 bg-body-secondary rounded-2 text-capitalize"
              onClick={(e) => setActionType(e.target.value)}
              disabled
              value={actionType}
            >
              <option>{actionType}</option>
              {/* {QueryActionType. map((current,key) => (
                <option
                  className="text-capitalize"
                  key={current}
                  value={current}
                >
                  {current.toLowerCase()}
                </option>
              ))} */}
            </select>
          </div>

          <div className="d-flex flex-column">
            <label className="m-2 fw-normal">
              What's the reason behind this change
            </label>
            <textarea
              className="m-2 border-0 bg-body-secondary rounded-2 "
              placeholder="for e.g According to the description problem is of High Priority"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            className=" bg-danger text-light border-0 rounded-1"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleSubmit();
            }}
            className=" bg-success text-light border-0 rounded-1"
          >
            Submit
          </button>
        </DialogActions>
      </Dialog>


      <Dialog
      open={showLogs}
      onClose={() => setShowLogs(false)}
    >
      <DialogTitle className="fw-bold fs-3">Logs</DialogTitle>
      <DialogContent dividers>
        {logs.map((current, key) => (
          <DialogContentText key={key} className="m-2">
            <div className="log-entry">
              <div className="log-type text-capitalize fw-bold text-black fs-5">
                {current.type.toLowerCase()}
              </div>
              <div className="log-detail text-capitalize fs-6 ms-4">
                {`${current.prev.toLowerCase()} -----> ${current.update.toLowerCase()}`}
              </div>
            </div>
          </DialogContentText>
        ))}
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => setShowLogs(false)}
          className="btn btn-success"
        >
          View less
        </button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default TicketDetail;
