import React from "react";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../../helpers/auth";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ListIcon from "@material-ui/icons/List";
import PersonIcon from "@material-ui/icons/Person";
import InfoIcon from "@material-ui/icons/Info";
import TwitterIcon from "@material-ui/icons/Twitter";

const Sidebar = () => {
  const history = useHistory();
  const handleLogout = () => {
    logout();
    history.push("/signin");
  };
  return (
    <div className="sidebar-container">
      <ul className="nav flex-column">
        <li className="nav-item sidebar-links">
          <Link className="twitter-icon" to="/">
            <TwitterIcon />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link " to="/">
            <HomeIcon /> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link " to="/explore">
            <i className="fas fa-hashtag">Explore</i>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link " to="#">
            <NotificationsNoneIcon /> Notifications
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link " to="#">
            <MailOutlineIcon /> Message
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="#">
            <BookmarkBorderIcon /> List
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="#">
            <ListIcon /> List
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/profile`}>
            <PersonIcon /> Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="#">
            <InfoIcon /> More ...
          </Link>
        </li>
      </ul>
      <ul className="nav nav-pills mt-3">
        <li className="nav-item">
          <i
            className="fas fa-sign-out-alt  btn btn-primary"
            onClick={handleLogout}
          >
            {" "}
            Log out
          </i>
        </li>
        <li className="nav-item dropdown"></li>
      </ul>
    </div>
  );
};

export default Sidebar;
