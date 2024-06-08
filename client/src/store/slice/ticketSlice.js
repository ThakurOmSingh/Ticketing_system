import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    ticketData : {
        ticketCount : {
            solvedCount : 0,
            unSolvedCount : 0
        }
    }
}

export const ticketSlice = createSlice({
    name : "ticket",
    initialState,
    reducers:{
        ticketCount : (state , action) =>{
            state.ticketCount = action.payload
        }

    }
})

export const {ticketCount} = ticketSlice.actions

export default ticketSlice.reducer