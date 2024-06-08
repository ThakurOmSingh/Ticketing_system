import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from "axios";
import { apiURL } from "../env";

const Filter = (props) => {

    const [value, setValue] = useState()
    let token = localStorage.getItem('token');






  const filterQuery = async (key,value) =>{

    console.log("(key,value");
    console.log(key);
    console.log(value);

    try{
      let {data} = await axios.get(`${apiURL}/api/ticket/filter?${key}=${value}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      console.log(data.data)
      props.func(data.data)
    }catch(err){
      console.log("ERROE IN FILTER")
      console.log(err)
    }

  }

return (
  <div className='d-flex flex-row m-1'>
    <div className='m-1'>
  <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Priority
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={()=>{filterQuery("priority","HIGH")}}>High</Dropdown.Item>
        <Dropdown.Item onClick={()=>{filterQuery("priority","MEDIUM")}}>Medium</Dropdown.Item>
        <Dropdown.Item onClick={()=>{filterQuery("priority","LOW")}}>Low</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

</div>

  <div className='m-1'>
    <Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic">
      Status
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item onClick={()=>{filterQuery("status","NEW")}}>New</Dropdown.Item>
      <Dropdown.Item onClick={()=>{filterQuery("status","INPROGRESS")}}>In progress</Dropdown.Item>
      <Dropdown.Item onClick={()=>{filterQuery("status","SOLVED")}}>Solved</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>

  </div>
  <div className='m-1'>

  <Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic">
      Type
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item onClick={()=>{filterQuery("type","BUG")}}>Bug</Dropdown.Item>
      <Dropdown.Item onClick={()=>{filterQuery("type","SALES")}}>Sales</Dropdown.Item>
      {/* <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
    </Dropdown.Menu>
  </Dropdown>
</div>

      <div className='m-1'>
  <Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic">
      Others
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item href="#/action-1">Assigned To You</Dropdown.Item>
      {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
    </Dropdown.Menu>
  </Dropdown>

  </div>
  </div>


);
}

export default Filter