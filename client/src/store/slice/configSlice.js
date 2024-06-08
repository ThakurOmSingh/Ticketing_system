import { createSlice } from "@reduxjs/toolkit";


let initialState = {

}

export const configSlice = createSlice({
    name : "configSlice",
    initialState,
    reducers:{
        saveConfigData : (state,action) => {
            state.configData = action.payload
        }
    }
})


export const {saveConfigData} =configSlice.actions

export default configSlice.reducer