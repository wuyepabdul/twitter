import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { isEmpty, isEmail, equals } from "validator";
import { showErrorMessage } from "../../helpers/message";
import { showLoading } from "../../helpers/loading";
import { signup } from "../../api/userAuth";
import { TextField } from "@material-ui/core";

const Signup = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    errorMsg: "",
    loading: false,
  });

  const {
    username,
    email,
    password,
    confirmPassword,
    errorMsg,
    loading,
  } = formData;

  /* input fields event handler  */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errorMsg: "",
      loading: false,
    });
  };

  /* signup handler */
  const handleSignup = (data) => {
    signup(data)
      .then((response) => {
        setFormData({
          ...formData,
          loading: false,
        });
        history.push("/signin");
      })
      .catch((err) => {
        setFormData({
          ...formData,
          errorMsg: err.response.data.message,
          loading: false,
        });
      });
  };

  /* submit handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
    });
    //form validation
    if (
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(confirmPassword) ||
      isEmpty(username)
    ) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: "All fields are required",
      });
    } else if (!isEmail(email)) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: "Invalid Email",
      });
    } else if (!equals(password, confirmPassword)) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: "Passwords Do Not Match",
      });
    } else {
      const { email, password, username } = formData;
      const data = { email, password, username };
      //signup up user
      setFormData({
        ...formData,
        loading: true,
      });

      handleSignup(data);
    }
  };
  return (
    <div>
      <div className="row mt-5">
        <div className="col-sm-4"></div>
        <div className="col-md-4">
          <form onSubmit={handleSubmit}>
            <h2 className=" mt-3 text-center">Sign-Up</h2>
            <div className="showLoading mt-4">
              {loading && showLoading()}
              {errorMsg && showErrorMessage(errorMsg)}
            </div>

            <TextField
              id="username"
              type="text"
              name="username"
              label="Username"
              value={username}
              onChange={handleChange}
              fullWidth={true}
            />
            <TextField
              id="email"
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={handleChange}
              fullWidth={true}
            />

            <TextField
              id="password"
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={handleChange}
              fullWidth={true}
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              fullWidth={true}
            />

            <button type="submit" className="btn btn-primary mt-4 form-control">
              {" "}
              Sign Up
            </button>
            <h6 className="text-center mt-2">
              {" "}
              Have an Account? <Link to="/signin">Sign In</Link>{" "}
            </h6>
          </form>
        </div>
        <div className="col-sm-4"></div>
      </div>
    </div>
  );
};

export default Signup;
