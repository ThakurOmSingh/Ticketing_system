import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../env";
import { BackButton } from "../Assets/svg";

const CreateTicket = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [uuid, setUuid] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [priority, setPriority] = useState("");
  const [screenShots, setScreenShots] = useState("");
  const token = localStorage.getItem("token");
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    }),
    [token]
  );

  let Applications_data = {
    "UNO Home"              : "5a9af8cd-2890-4637-b4f2-70641a759a9b",
    "Team Management"       : "0f60a797-3418-477c-a24f-880905b1bd80",
    "Content Management"    : "19c180d8-cfeb-47e1-bcff-619591affbab",
    "LEARN"                 : "07a17362-e39f-43de-8f21-51166a8e12c3",
    "Paint Simulator"       : "efebca8a-6584-4da7-b1ea-09281840bb6e",
    "Digital Workflows"     : "fed6f7e9-d8bf-457e-97e2-501234d65202",
    "Dynamic Assistance"    : "188230d3-3f6d-4648-9a0a-0fc7a68db55c",
    "360Â° Content Creator" : "16269833-3c0f-42a4-8e89-dc3347fb908c",
    "XR Content Library"    : "e9dfc406-b05b-4bfe-a254-2dc4007a3363",
    "Metaverse"             : "f17efe60-eee0-422f-94e4-210e233af1c9",
    "Mining Simulator"      : "2355a0a3-4913-48a2-bea8-0eab01d62335",
    "Driving Simulator"     : "9ded368a-f3d8-49a6-9df4-39a0a3da32f1",
    "Fire Simulator"        : "acc3d15a-fd11-4701-929f-771ef5e97b88",
    "3D XR Skillhub"        : "30aa8afb-dc80-47be-badf-5e753e76f303",
    "Walkthroughs"          : "2f2d6465-5f2f-4782-a6ff-146b95ebcde7",
    "HR Onboarding"         : "0aec249c-6cbd-432a-bf0b-62d2169c6f34",
    "Meetings"              : "d6baabf9-e861-4c14-acdc-57ed853e1eb7",
    "Digitial SOP"          : "811eeb66-ddab-4716-baa8-afc8bf5cba42",
    "2D LMS"                : "cc9d5c2c-4c4f-4c1f-a62a-823a38e0ddb6",
    "Psychometric Analysis" : "febb358f-51f0-4125-8d96-d80b0c64976c",
    "XR Launcher"           : "4dfad132-22f1-419b-9ae4-ce04ef9d1979",
    "Metaverse Launcher"    : "f7fcddfe-dcce-4989-bc09-7aabf61c0b5d",
    "Creator Launcher"      : "7013f814-ba6e-41a6-8699-c669fed53b94",
    "QR Scan"               : "d8f07d6c-1b1c-4c3a-888a-33cfa5b8d1ec",
    "Ticketing System"      : "d8f07d6c-1b1c-4c3a-888a-88cfa5b8d1op",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Array.from(screenShots).forEach((file, index) => {
      formData.append("screenshot", file);
    });
    formData.append("name", name);
    formData.append("uuid", uuid);
    formData.append("email", email);
    formData.append("isAdmin", Boolean(isAdmin));
    formData.append("phone", phone);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("origin", origin);
    formData.append("applicationId", applicationId);
    formData.append("priority", priority);

    try {
      await axios.post(`${apiURL}/api/ticket/create`, formData, {
        headers,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <div
        className="rounded-3 p-3"
        style={{
          backgroundColor: "rgb(234,243,252)",
          minHeight: "84vh",
          nWidth: "100%",
        }}
      >
        <div className="d-flex ">
          <div className="mx-2">
            <button
              className=" bg-transparent border-0 "
              onClick={() => {
                handleBackClick();
              }}
            >
              <BackButton />
            </button>
          </div>
          <div>
            <h4>Generate Ticket</h4>
          </div>
        </div>
        <div className="d-flex m-3 p-5 w-100 ">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group w-100 d-flex flex-column ">
              <label htmlFor="name" className="">
                Name
              </label>
              <input
                className="my-2"
                size={150}
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group d-flex flex-column ">
              <label htmlFor="uuid">UUID</label>
              <input
                className="my-2"
                size={150}
                type="text"
                id="uuid"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
              />
            </div>
            <div className="form-group d-flex flex-column ">
              <label htmlFor="email">Email</label>
              <input
                className="my-2"
                size={150}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group d-flex flex-column ">
              <label htmlFor="phone">Phone</label>
              <input
                className="my-2"
                size={150}
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group d-flex flex-column ">
              <label htmlFor="title">Title</label>
              <input
                className="my-2"
                size={150}
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group d-flex flex-column ">
              <label htmlFor="description">Description</label>
              <textarea
                className="my-2"
                size={150}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group d-flex flex-column ">
              <label htmlFor="origin">Origin</label>
              <input
                className="my-2"
                size={150}
                type="text"
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <div className="form-group d-flex flex-column ">
              <label htmlFor="applicationId">Application ID</label>
              <input
                className="my-2"
                size={150}
                type="text"
                id="applicationId"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
              />
            </div>
            <div className="form-group d-flex flex-column ">
              <label htmlFor="priority">Priority</label>
              <input
                className="my-2"
                size={150}
                type="text"
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="image">ScreenShot</label>
              <input
                className="my-2"
                size={150}
                type="file"
                multiple
                id="image"
                onChange={(e) => setScreenShots(e.target.files)}
              />
            </div>
            <button type="submit">Submit</button>
            <img src={screenShots} />
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTicket;
