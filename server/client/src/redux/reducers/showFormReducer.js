export const showFormReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_SHOW_COMMENT":
      return !state;
    case "RESET_SHOW_COMMENT":
      return !state;
    default:
      return state;
  }
};
