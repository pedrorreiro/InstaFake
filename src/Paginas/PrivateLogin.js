import React from "react";
import { useContext } from "react";
import { Context } from "../Context";
import { Navigate } from "react-router-dom";

function PrivateLogin({children}) {

  const [user] = useContext(Context);

  return (
    <div className="Insta-Box">
        {user === null ? children : <Navigate to="/" replace/>}

    </div>
  );
}

export default PrivateLogin;
