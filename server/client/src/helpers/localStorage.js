export const setUserLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getUserLocalStorage = (key) => {
  JSON.parse(localStorage.getItem(key));
};

export const deleteLocalStorage = (key) => {
  localStorage.removeItem(key);
};
