import { combineReducers } from "redux";
import { showFormReducer } from "./showFormReducer";
import { userReducer } from "./userReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  showForm: showFormReducer,
});
