import React, {useContext} from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link, useNavigate  } from "react-router-dom";
import Logout from '@mui/icons-material/Logout';
import { exit } from "../db/db";
import { Context } from "../Context";

export default function AccountMenu(props) {

  const [user] = useContext(Context);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
            {user.photoURL === null ?
              (<Avatar sx={{ width: 32, height: 32 }}>{user.displayName.substr(0, 1)}</Avatar>)
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
              (<Avatar sx={{ width: 32, height: 32 }}>{user.displayName.substr(0, 1)}</Avatar>)
              :
              (<Avatar src={user.photoURL} sx={{ width: 32, height: 32 }}>M</Avatar>)
            } Meu Perfil
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem>
          <ListItemIcon>
          <i className="lock icon"></i>
          Alterar senha
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