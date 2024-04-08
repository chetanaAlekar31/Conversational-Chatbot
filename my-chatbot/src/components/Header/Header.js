import React, { useMemo,useEffect,useState,useCallback,useRef } from 'react';
import BotFace from '../../assests/new_bot_icon.svg'
import './Header.css'
import Chat from '../Chat/Chat'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Fab,Popper,Box} from '@mui/material'; 
import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';

function Header() {

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'spring-popper' : undefined;

  const handleClick = (event) => {
    console.log(event.currentTarget)
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const StyledFab = styled((props) => (
    <Fab  {...props}/>))({
      backgroundColor: 'transparent',
      minHeight: '20px',
      width: '30px',
      height: '30px',
      boxShadow : 'none',
      '&:hover': {
      backgroundColor: '#e35364',
      }
  });

  const arrowRef = useRef()

  return (
    <div className="App">
      <div className='Header'>
        <div className='name-icon'>
          <img src={BotFace} width='50rem'/> 
          <h2>STELLA</h2>
        </div>
        {/* <div className='about_section' onClick={handleClick}>
          <StyledFab  size="small">
            <MoreVertIcon/>
          </StyledFab>
        </div> */}
      </div>
        <Popper id={id} open={open} anchorEl={anchorEl} 
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          }
        ]}
        transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
              The content of the Popper.
            </Box>
          </Fade>
        )}
      </Popper>
      <Chat/>
  </div>
  )
}

export default Header