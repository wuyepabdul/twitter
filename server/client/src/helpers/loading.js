import React, { Fragment } from "react";

export const showLoading = (msg) => (
  <Fragment>
    <div class="spinner-border text-info" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </Fragment>
);
