import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useState, useEffect } from "react";
import { getDataUser } from "./db/db";
import PrivateRoute from "./Paginas/PrivateRoute";
import PrivateLogin from "./Paginas/PrivateLogin";
import SignUp from "./Paginas/SignUp";
import Profile from "./Paginas/Profile";
import Header from "./Components/Header";
import Direct from "./Paginas/Direct";
import { Context } from "./Context";
import { auth } from "./db/db";
import Login from "./Paginas/Login";
import Home from "./Paginas/Home";

function App() {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  
    auth.onAuthStateChanged(user => {
      setUser(user);
    });

  }, []);

  return (
    <div id="InstaFake">
      <Context.Provider value={[user, setUser]}>
        <Router>

          {user !== null ? <Header></Header> : null}

          <Routes>
            <Route path="/"
              element={
                <PrivateRoute>
                  <Home/>
                </PrivateRoute>}
            />   

            <Route path="/login" element={<PrivateLogin>
              <Login />
            </PrivateLogin>} />

            <Route path="/signup" element={<SignUp />} />
            <Route path='/:username' element={<Profile />} />
            <Route path='/direct' element={
                <Direct/>
            
          } />

          </Routes>

        </Router>
      </Context.Provider>
    </div>
  );
}

export default App;
