import React from "react";
import { useContext } from "react";
import { Context } from "../Context";
import { Navigate } from "react-router-dom";

function PrivateDirect({children}) {

  const [user] = useContext(Context);

  return (
        user.emailVerified ? children : <Navigate to="/" replace/>
  );
}

export default PrivateDirect;
