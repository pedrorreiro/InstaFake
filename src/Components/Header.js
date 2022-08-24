import React, { useEffect, useContext, useState } from "react";
import '../css/home.css';
import logo from "../img/login/logo.png";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import direct from '../img/icons/nav/direct.svg';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { getAllUsers } from "../db/db";
import { Context } from "../Context";

export default function Header(props) {

    const [user] = useContext(Context);
    const [busca, setBusca] = useState("");

    const [uploading, setUploading] = useState(false);
    const [allInstaUsers, setAllInstaUsers] = useState([]);

    const [open, setOpen] = React.useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
  
        if(user){
            getAllInstaUsers();
        }
        

    }, [open, user]);

    async function getAllInstaUsers() {
        const users = await getAllUsers();
        const usersFiltered = users.filter(data => data.user !== user.user);
        setAllInstaUsers(usersFiltered);
        //console.log(users);
    }

    return (
        <header>
            <div id="divisorias">

                <Link to="/InstaFake" ><img id="LogoHeader" alt="logo" src={logo}></img></Link>

                <div id="InputBusca">
                    <SearchIcon id="SearchIcon" />
                    <Autocomplete
                        id="country-select-demo"
                        sx={{ width: 300 }}
                        options={allInstaUsers}
                        autoHighlight
                        clearOnEscape
                        getOptionLabel={(option) => option.user}
                        renderOption={(props, option) => {

                            if (busca !== "") {
                                return (

                                    <Link to={`/${option.user}`} key={option.user}>
                                        <Box style={{ maxHeight: "20px !important" }} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            <Avatar src={option.photoURL} style={{ marginRight: 10 }} />
                                            {option.user}
                                        </Box></Link>)
                            }


                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Pesquisar"
                                onChange={(e) => setBusca(e.target.value)}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                }}

                            />
                        )}

                    />
                </div>




                <div id="nav">
                    <Link to="/" className="nav-item">
                        <HomeIcon />
                    </Link>

                    <Link to="/direct" className="nav-item">
                        <div id="badge">
                            <div id="msgCounter">1</div>
                            <img src={direct} id="msgsIcon" alt="msgs"></img>
                        </div>
                    </Link>

                    <div className="nav-item">
                        <AddBoxIcon />
                    </div>

                    <Link to="/" className="nav-item">
                        <ExploreOutlinedIcon />
                    </Link>

                    <Link to="/" className="nav-item">
                        <FavoriteBorderIcon />
                    </Link>

                    <div className="nav-item" onClick={handleToggle} id="Account-Menu">

                        {user ? <AccountMenu setUploading={setUploading} /> : null}

                    </div>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={uploading}
                    >
                        <CircularProgress />
                    </Backdrop>
                </div>


            </div>

        </header >
    );
}