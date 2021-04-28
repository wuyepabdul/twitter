import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import NotFound from "./components/NotFound/NotFound";
import Signup from "./components/Signup/Signup";
import Signin from "./components/Signin/Signin";
import Profile from "./components/Profile/Profile";
import UserProfile from "./components/Profile/UserProfile";
import "./App.css";
import { useDispatch } from "react-redux";
import SubscribedPosts from "./components/SubscribedPost/SubscribedPosts";
import Home from "./components/screens/Home/Home";
import { userActions } from "./redux/actions/userActions";
import Explore from "./components/screens/Explore/Explore";

function App() {
  const Routing = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = localStorage.getItem("user");
    useEffect(() => {
      if (typeof user === "string") {
        const parseUser = JSON.parse(user);
        dispatch(userActions(parseUser));
        //history.push("/");
      } else if (typeof user === "object") {
        dispatch(userActions(user));
      } else {
        history.push("/signin");
      }
    }, []);
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/explore" component={Explore} />
        <Route exact path="/subscribedPosts" component={SubscribedPosts} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile/:userId" component={UserProfile} />
        <Route exact path="/profile/:userId" component={} />

        <Route component={NotFound} />
      </Switch>
    );
  };

  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;
