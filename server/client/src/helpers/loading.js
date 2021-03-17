import React, { Fragment } from "react";

export const showLoading = (msg) => (
  <Fragment>
    <div className="spinner-border text-info" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </Fragment>
);
