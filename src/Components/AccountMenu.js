import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { CircularProgress } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link, useNavigate } from "react-router-dom";
import Logout from '@mui/icons-material/Logout';
import { exit } from "../db/db";
import { Context } from "../Context";
import { changeEmail, changeSenha, changeAvatar } from '../db/db';

export default function AccountMenu(props) {

  const [user] = useContext(Context);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [uploading, setUploading] = useState(false);
  const [mudandoSenha, setMudandoSenha] = useState(false);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const uploadImage = async (image) => {
    console.log("Solicitando upload de imagem");
    if (image == null) return;

    await changeAvatar(image, user.displayName);

    setUploading(false);

  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Minha Conta">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {user?.photoURL === null? 
              (<Avatar sx={{ width: 32, height: 32 }}>{user.displayName?.substr(0, 1)}</Avatar>)
              :
              (<Avatar src={user.photoURL} sx={{ width: 32, height: 32 }}></Avatar>)
            }

          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link to={`/${user.displayName}`}>
          <MenuItem>
            {user.photoURL === null ?
              (<Avatar sx={{ width: 32, height: 32 }}>{user.displayName?.substr(0, 1)}</Avatar>)
              :
              (<Avatar src={user.photoURL} sx={{ width: 32, height: 32 }}>M</Avatar>)
            } Meu Perfil
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem>
          <ListItemIcon onClick={(e) => {
            e.stopPropagation();
            
          }}>
            <div id='changeProfileImg'>
              <label htmlFor="inputImg">Alterar imagem de perfil</label>
              
              <input id="inputImg" type={"file"} accept="image/png,image/jpeg" onChange={async (e) => {
                e.stopPropagation();
                setUploading(true);

                await uploadImage(e.target.files[0]);

                setUploading(false);

                alert("Sucesso! Para ver a alteração, logue novamente.");

              }} />
            </div>

            {uploading ? <CircularProgress style={{ marginLeft: 15, width: 30 }} /> : null}
          </ListItemIcon>

        </MenuItem>
        <MenuItem>
          <ListItemIcon onClick={async (e) => {
            e.stopPropagation();
            setMudandoSenha(true)

            const result = await changeSenha();

            setMudandoSenha(false);

            alert(result.msg);

          }
          }>
            <i className="lock icon"></i>
            Alterar senha
            {mudandoSenha ? <CircularProgress style={{ marginLeft: 15, width: 20 }} /> : null}
          </ListItemIcon>

        </MenuItem>

        <MenuItem>
          <ListItemIcon onClick={async () => {

            const novoEmail = prompt("Insira o novo e-mail:", "");

            if (novoEmail !== null && novoEmail !== "") {

              const result = await changeEmail(novoEmail);

              if (result.sucess) {
                alert(result.msg);
                await exit();
              }

              else {
                alert(result.msg);
              }


            }
          }}>
            Alterar e-mail
          </ListItemIcon>
        </MenuItem>

        <MenuItem onClick={() => {
          navigate('/');
          exit();
        }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>

      </Menu>
    </React.Fragment>
  );
}