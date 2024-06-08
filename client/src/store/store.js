import {configureStore , combineReducers} from "@reduxjs/toolkit"
import ticketReducer from './slice/ticketSlice'
import userReducer from "./slice/userSlice"
import configReducer from './slice/configSlice'

const rootReducer = combineReducers({
    ticket: ticketReducer,
    user: userReducer,
    config : configReducer
  });

  export const store = configureStore({
    reducer: rootReducer
  });


