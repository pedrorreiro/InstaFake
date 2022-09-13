import React, {useContext} from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate  } from "react-router-dom";
import { Context } from "../Context";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { excluirPost } from "../db/dbPost";

export default function PostMenu(props) {

  const [user] = useContext(Context);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { post } = props;

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
        <Tooltip title="Opções">
            <MoreHorizIcon className="opcoesPost"
                onClick={handleClick}
            />
        </Tooltip>
      </Box>
      <Menu
        style={{zIndex: 99999999999}}
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
   
        <MenuItem onClick={async () => {
            props.setUploading(true);
            await excluirPost(post);
            props.setUploading(false);
        }}>
          <ListItemIcon>
          <DeleteIcon/>
            Excluir
          </ListItemIcon>

        </MenuItem>

      </Menu>
    </React.Fragment>
  );
}