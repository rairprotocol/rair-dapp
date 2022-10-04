import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import TwitterIcon from '@mui/icons-material/Twitter';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import { RootState } from '../../../../../../ducks';
import { ISharePopUp } from '../../../../mockupPage.types';

import './SharePopUp.css';

const SharePopUp: React.FC<ISharePopUp> = ({
  onClose,
  selectedValue,
  open,
  primaryColor
}) => {
  const [copySuccess /*setCopySuccess*/] = useState<string>('Copy link');
  const currentUrl = document.location.href;

  const headerLogo = useSelector<RootState, string>(
    (store) => store.colorStore.headerLogo
  );

  const handleClose = () => {
    onClose(selectedValue);
  };

  const closePopUp = () => {
    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  const handleCopy = async () => {
    if (currentUrl) {
      window.navigator.clipboard.writeText(currentUrl);
      closePopUp();
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        style={{
          background: `${
            primaryColor === 'rhyno' ? '#e3e4e6' : 'rgb(56, 54, 55)'
          }`,
          color: `${primaryColor === 'rhyno' ? 'black' : 'white'}`
        }}>
        Share
      </DialogTitle>
      <List
        style={{
          background: `${
            primaryColor === 'rhyno' ? '#e3e4e6' : 'rgb(56, 54, 55)'
          }`
        }}
        sx={{ pt: 0 }}>
        <ListItem onClick={handleCopy} autoFocus button>
          <ListItemAvatar>
            <img
              style={{ width: 30, height: 'auto', marginLeft: '10px' }}
              src={headerLogo}
              alt="Rair Tech"
            />
          </ListItemAvatar>
          <ListItemText
            style={{ color: `${primaryColor === 'rhyno' ? 'black' : 'white'}` }}
            primary={copySuccess}
          />
        </ListItem>
        <ListItem style={{ overflow: 'hidden' }} autoFocus button>
          <FacebookShareButton
            className="share-copy-link network__share-button"
            url={currentUrl}
            quote={'Rair tech'}
            style={{ display: 'flex' }}>
            <ListItemAvatar>
              <FacebookRoundedIcon style={{ color: '#4267B2', fontSize: 40 }} />
            </ListItemAvatar>
            <ListItemText
              style={{
                color: `${primaryColor === 'rhyno' ? 'black' : 'white'}`
              }}
              primary="Share on Facebook"
            />
          </FacebookShareButton>
        </ListItem>
        <ListItem autoFocus>
          <TwitterShareButton
            className="share-copy-link"
            url={currentUrl}
            // quote={'Rair tech'} - property quote doesn't exist in the lib
            style={{ display: 'flex' }}>
            <ListItemAvatar>
              <TwitterIcon style={{ color: '#1D9BF0', fontSize: 40 }} />
            </ListItemAvatar>
            <ListItemText
              style={{
                color: `${primaryColor === 'rhyno' ? 'black' : 'white'}`
              }}
              primary="Share on Twitter"
            />
          </TwitterShareButton>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default SharePopUp;

//will be used in future

// function copyStringToClipboard(str) {
//     var el = document.createElement('textarea');
//     el.value = str;
//     el.setAttribute('readonly', '');
//     document.body.appendChild(el);
//     el.select();
//     document.execCommand('copy');
//     document.body.removeChild(el);
//     setCopySuccess("Copies");
// }
