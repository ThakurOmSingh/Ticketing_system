import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { UNO_URL, apiURL } from "../env";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ticketCount } from "../store/slice/ticketSlice.js";
import { userTickets } from "../store/slice/userSlice";



const Dashboard = () => {
    const [count, setCount] = useState(0);
    const [latestTicket, setLatestTicket] = useState(null);
    const [assignedTickets, setAssignedTickets] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate()


    const token = useSelector(state=>state.user.userData.token)



    const userDetails = useSelector((state) => state.user.userData.user);
    const headers = useMemo(()=>({
    "Authorization": `Bearer ${token}`,
        }),[token])





        const getTicketCount = async () => {
          try {
            let { data } = await axios.get(`${apiURL}/api/ticket/get/count`, {
              headers,
            });
            setCount(data.response);

            dispatch(ticketCount(data.response));
            setLatestTicket(data.response.latest);
            console.log(data)

          } catch (error) {
            console.log(error);
          }
        };

  const getAssignedTicket = async () => {
    try {
      let { data } = await axios.get(`${apiURL}/api/ticket/filter`, {
        headers,
        params: {
          assignedTo: userDetails.id,
        },
      });
      setAssignedTickets(data.data);
      dispatch(userTickets(data.data))

    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getTicketCount();
    getAssignedTicket();

  }, []);

  return (
    <>
      <div
        className="d-flex p-3 rounded-3 "
        style={{
          backgroundColor: "rgb(234,243,252)",
          minHeight: "84vh",
          minWidth: "98%",
        }}
      >
        <div className=" col-8 me-3  ">
          <div
            className=" bg-light  mb-3 d-flex "
            style={{ maxHeight: "15%", minHeight: "15%" }}
          >
            <div className="d-flex w-25 justify-content-around ">
              <div className="mt-3 fw-medium ">
                Total Tickets <br />{" "}
                <strong>{count.solvedCount + count.unSolvedCount}</strong>
              </div>
              <div className="vr h-75 mt-2"></div>
            </div>

            <div className="d-flex w-25 justify-content-around">
              <div className="mt-3 fw-medium">
                Solved Tickets <br /> <strong>{count.solvedCount}</strong>
              </div>
              <div className="vr h-75 mt-2"></div>
            </div>

            <div className="d-flex justify-content-around  w-25">
              <div className="mt-3 fw-medium">
                Unsolved Tickets <br /> <strong>{count.unSolvedCount}</strong>
              </div>

              <div className="vr h-75 mt-2"></div>
            </div>

            <div className="d-flex w-25">
              <div className="mt-3 fw-medium">
                In Progress Tickets <br /> <strong>{count.inProgress}</strong>
              </div>
            </div>
          </div>

          {/* graph div */}
          <div className=""></div>
        </div>
        <div className=" col-4  ">
          { assignedTickets ? <div
            className=" bg-light mb-2  me-3 p-3"
            style={{ maxHeight: "45%", minHeight: "55%" }}
          >
            <div className="d-flex justify-content-between ">
              <h5>Assigned Tickets</h5>
              <button  className="bg-transparent border-0 " onClick={()=>{
                navigate("/tickets" , {state:{assignedTickets}})
              }}><Link>view all</Link></button>
            </div>
            {
              assignedTickets.length>0 ?
            <div>
              {assignedTickets.map((current, key) => {
                if (key + 1 < 4) {
                  return (
                    <div className="p-3">
                      <div className="d-flex justify-content-between ">
                        <div className="fw-medium text-capitalize ">
                          {current.title}
                        </div>
                        <div>
                          <button
                            className=" rounded-5 fw-medium border-0 "
                            style={{
                              color: "rgb(47,52,121)",
                              backgroundColor: "rgb(234,243,252)",
                            }}
                          >
                            open
                          </button>
                        </div>
                      </div>
                      <div className="float-end">
                        {moment(current.createdAt).format("MMM Do YYYY")}
                      </div>
                      {/* <div className="d-flex justify-content-between float end">
                        <div className="text-capitalize">
                          {current.user.name}
                        </div>
                      </div> */}
                    </div>
                  );
                } else {
                  return "";
                }
              })}
            </div>
            :
            <div><h4>No Tickets To Show</h4></div>

            }
          </div> : <div>Fetching data</div>}

          <div
            className=" bg-light me-3 p-3"
            style={{ maxHeight: "45%", minHeight: "45%" }}
          >
            {latestTicket && (
              <div>
                <div className="d-flex justify-content-between ">
                  <div>
                    <h5>Most Recent Ticket</h5>
                  </div>
                  <div>
                  <button  className="bg-transparent border-0 " onClick={()=>{
                navigate("/ticket/detail" , {state:{item : latestTicket}})
              }}><Link>See Details</Link></button>
                  </div>
                </div>

                <div className="d-flex justify-content-between ">
                  {/* <div>
                    <div className="fw-light">User</div>
                    <div className="fw-medium">{latestTicket.user.name}</div>
                  </div> */}
                  <div>
                    <div className=" fw-light ">Submitted</div>
                    <div className="fw-medium">
                      {moment(latestTicket.createdAt).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    </div>
                  </div>
                </div>

                <div className="my-2">
                  <div className=" fw-light ">Subject</div>
                  <div
                    className="fw-medium"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {latestTicket.title}
                  </div>
                </div>

                <div className="my-2">
                  <div className=" fw-light ">Ticket Issue</div>
                  <div
                    className="fw-medium"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      padding: "5px",
                    }}
                  >
                    {latestTicket.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
