import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    loading : true,
    userData: null,
}

export const userSlice = createSlice({
    name : "userSlice",
    initialState,
    reducers:{
        userData : (state,action)=>{
            state.userData = action.payload;
            state.loading = false;
        },
        userToken : (state,action)=>{
            state.token = action.payload.token
        },
        userTickets : (state,action) =>{
            state.assigned = action.payload
        },
        allUsers : (state , action )=>{
            state.users = action.payload
        }

    }
})

export const { userData, userToken ,userTickets , allUsers} = userSlice.actions

export default userSlice.reducer;