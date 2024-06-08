import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiURL } from '../env';
import { BackButton } from '../Assets/svg';
import Switch from '@mui/material/Switch';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";


const CreateAdmin = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [uuid, setUuid] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [open, setOpen] =useState(false);
    const [groups , setGroups] = useState([]);
    const [newGroup , setNewGroup] = useState([]);
    const [notification , setNotification] = useState(false);
    const [group , setGroup] = useState([]);
    const token = localStorage.getItem('token')
    const headers = useMemo(()=>({
        Authorization : `Bearer ${token}`,
    }
    ),[token])

    const handleClickOpen = (e) => {
        e.preventDefault();
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };



    const handleDialogSubmit = async () =>{
            try{
                let {data} = await axios.post(`${apiURL}/api/admin/group/create`,{name : newGroup})
                setNewGroup("")

            }catch(error){
                console.log(error)
                alert(error.response.data.message)
                setNewGroup("")
            }
    }


    const handleSubmit = async (e) => {
      e.preventDefault();
            let apiData = {

                    name,
                    uuid ,
                    email ,
                    phone ,
                    isAdmin : true,
                    notification ,
                    groupId : group,

            }
          try{
              let {data} = await axios.post(`${apiURL}/api/admin/create`,apiData, {
                  headers
              })
          }catch(error){
              console.log(error)
          }

    };

    const handleBackClick = () =>{
      navigate(-1)
    }

    const fetchGroups = async() =>{
        try{
            let {data} = await axios.get(`${apiURL}/api/admin/get/groups`)
            setGroups(data.data)
        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchGroups()
    },[])




    return (
      <>
          <div className='rounded-3 p-3' style={{backgroundColor:"rgb(234,243,252)", minHeight:"84vh", nWidth:"100%"}}>
              <div className='d-flex justify-content-between '>
              <div className='d-flex'>
              <div className='mx-2' ><button className=' bg-transparent border-0 ' onClick={()=>{handleBackClick()}}><BackButton/></button></div>
              <div><h4>Add New Admin</h4></div>
              </div>
              <div>
              <button className="edit-submit-button mt-2 me-3"
                  onClick={(e) => {
                    handleClickOpen(e);
                  }}
                >
                  New Group
                </button>
              </div>
              </div>
              <div className='d-flex m-3 p-5 w-100 '>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>

          <div className="form-group w-100 d-flex flex-column ">
            <label htmlFor="name" className=''>Name</label>
            <input
            className='my-2'
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
            className='my-2'
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
            className='my-2'
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
            className='my-2'
            size={150}
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>


          <div className="">
          <label htmlFor="group">Group</label>
                <select

                  className="group form-select w-100 my-2"
                  onChange={(e) => {
                    setGroup(e.target.value);
                  }}
                >

                  {groups.map((current , key) => (
                    <option key={current.id} value={current.id}>
                      {current.name}
                    </option>
                  ))}
                </select>
              </div>

          <div className="form-group d-flex flex-column ">
            <label htmlFor="applicationId">Notifications</label>
            <Switch onClick={()=>{setNotification(!notification)}}/>
          </div>




          <button type="submit" >Submit</button>

        </form>
              </div>

          </div>

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
        <DialogTitle className="fw-bold">Create New Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill the required information to create new Group
          </DialogContentText>

          <div className="d-flex flex-column ">
            <label className="m-2 fw-normal">Enter the Name of New Group</label>
            <input
              className="m-2 border-0 bg-body-secondary rounded-2 "
              type="text"
              placeholder="for e.g Development"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
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
              handleDialogSubmit();
            }}
            className=" bg-success text-light border-0 rounded-1"
          >
            Submit
          </button>
        </DialogActions>
      </Dialog>
      </>
    )

}

export default CreateAdmin