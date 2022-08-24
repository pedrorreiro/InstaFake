import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from '../db/db';

function PrivateRoute({children}) {

  return (
    <div className="Insta-Box">
        {auth.currentUser !== null ? children : <Navigate to="/login" replace/>}

    </div>
  );
}

export default PrivateRoute;
