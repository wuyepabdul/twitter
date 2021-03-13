import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { isEmpty, isEmail } from "validator";
import { showErrorMessage } from "../../helpers/message";
import { showLoading } from "../../helpers/loading";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux/actions/userActions";
import { signin } from "../../api/userAuth";
import { setAuthentication } from "../../helpers/auth";
import { TextField } from "@material-ui/core";

const Signin = () => {
  const history = useHistory();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      history.push("/");
    }
  }, []);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loading: false,
    errorMsg: false,
  });

  const { email, password, loading, errorMsg } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errorMsg: "",
      loading: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
    });
    if (isEmpty(email) || isEmpty(password)) {
      setFormData({
        ...formData,
        errorMsg: "All fields are required",
        loading: false,
      });
    } else if (!isEmail(email)) {
      setFormData({
        ...formData,
        errorMsg: "Invalid Email",
        loading: false,
      });
    } else {
      const { email, password } = formData;
      const data = { email, password };
      setFormData({
        ...formData,
        loading: true,
      });
      signin(data)
        .then((response) => {
          console.log("res", response.data);
          setAuthentication(response.data.token, response.data.user);
          dispatch(userActions(response.data.user));
          history.push("/");
        })
        .catch((err) => {
          setFormData({
            ...formData,
            loading: false,
            errorMsg: err.response.data.message,
          });
        });
    }
  };

  return (
    <div>
      <div className="row mt-5">
        <div className="col-sm-4"></div>
        <div className="col-md-4">
          <form onSubmit={handleSubmit}>
            {console.log(password)}
            <h2 className=" mt-3 text-center">Sign-In</h2>
            {errorMsg && showErrorMessage(errorMsg)}
            {loading && showLoading()}

            <TextField
              id="standard-basic"
              name="email"
              label="Email"
              value={email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              id="standard-basic"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={handleChange}
              fullWidth
            />

            <button type="submit" className="btn btn-primary mt-4 form-control">
              {" "}
              Login
            </button>
            <h6 className="text-center mt-2">
              {" "}
              Don't Have an Account? <Link to="signup">Create One</Link>{" "}
            </h6>
          </form>
        </div>
        <div className="col-sm-4"></div>
      </div>
    </div>
  );
};

export default Signin;
