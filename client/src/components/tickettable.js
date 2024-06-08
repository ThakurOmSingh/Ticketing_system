import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";


const TicketTable = ({data , currentPage}) => {
    const navigate = useNavigate()
    const handleTicketClick =(item) =>{
      navigate("/ticket/detail" , {state:{item}})
    }


    const Applications_data = {
      "UNO Home": "5a9af8cd-2890-4637-b4f2-70641a759a9b",
      "Team Management": "0f60a797-3418-477c-a24f-880905b1bd80",
      "Content Management": "19c180d8-cfeb-47e1-bcff-619591affbab",
      "LEARN": "07a17362-e39f-43de-8f21-51166a8e12c3",
      "Paint Simulator": "efebca8a-6584-4da7-b1ea-09281840bb6e",
      "Digital Workflows": "fed6f7e9-d8bf-457e-97e2-501234d65202",
      "Dynamic Assistance": "188230d3-3f6d-4648-9a0a-0fc7a68db55c",
      "360Â° Content Creator": "16269833-3c0f-42a4-8e89-dc3347fb908c",
      "XR Content Library": "e9dfc406-b05b-4bfe-a254-2dc4007a3363",
      "Metaverse": "f17efe60-eee0-422f-94e4-210e233af1c9",
      "Mining Simulator": "2355a0a3-4913-48a2-bea8-0eab01d62335",
      "Driving Simulator": "9ded368a-f3d8-49a6-9df4-39a0a3da32f1",
      "Fire Simulator": "acc3d15a-fd11-4701-929f-771ef5e97b88",
      "3D XR Skillhub": "30aa8afb-dc80-47be-badf-5e753e76f303",
      "Walkthroughs": "2f2d6465-5f2f-4782-a6ff-146b95ebcde7",
      "HR Onboarding": "0aec249c-6cbd-432a-bf0b-62d2169c6f34",
      "Meetings": "d6baabf9-e861-4c14-acdc-57ed853e1eb7",
      "Digitial SOP": "811eeb66-ddab-4716-baa8-afc8bf5cba42",
      "2D LMS": "cc9d5c2c-4c4f-4c1f-a62a-823a38e0ddb6",
      "Psychometric Analysis": "febb358f-51f0-4125-8d96-d80b0c64976c",
      "XR Launcher": "4dfad132-22f1-419b-9ae4-ce04ef9d1979",
      "Metaverse Launcher": "f7fcddfe-dcce-4989-bc09-7aabf61c0b5d",
      "Creator Launcher": "7013f814-ba6e-41a6-8699-c669fed53b94",
      "QR Scan": "d8f07d6c-1b1c-4c3a-888a-33cfa5b8d1ec",
      "Ticketing System": "d8f07d6c-1b1c-4c3a-888a-88cfa5b8d1op",
    };

    const getApplicationName = (value) =>{
        for(let curr in Applications_data){
          if(Applications_data[curr] == value){
            console.log(curr)
            return curr
          }
        }
    }

    return (
      <table class="table table-hover ">
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Ticket Id</th>
                    <th scope="col">User</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Category</th>
                    <th scope="col">Application</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    {console.log(item)}
                    return (
                      <tr onClick={()=>handleTicketClick(item)}>
                        <th>{((currentPage-1)*10) + (index + 1)}</th>
                        <td>{item.uuid}</td>
                        <td className=" text-capitalize ">
                          {item.userData.name.toLowerCase()}
                        </td>
                        <td className=" text-capitalize ">{item.title}</td>
                        <td className=" text-capitalize ">
                          {item.type.toLowerCase()}
                        </td>
                        <td className=" text-capitalize ">
                          {getApplicationName(item.applicationId)}
                        </td>
                        <td className="text-capitalize text-success ">
                          {item.status.toLowerCase()}
                        </td>
                        {item.priority == "HIGH" ? (
                          <td className="text-capitalize text-danger ">
                            {item.priority.toLowerCase()}
                          </td>
                        ) : item.priority == "LOW" ? (
                          <td className="text-capitalize text-success ">
                            {item.priority.toLowerCase()}
                          </td>
                        ) : (
                          <td className="text-capitalize text-warning ">
                            {item.priority.toLowerCase()}
                          </td>
                        )}
                        <td>
                          {moment(item.createdAt).format("DD MMM YYYY h:mm a")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
    )
  }

  export default TicketTable;