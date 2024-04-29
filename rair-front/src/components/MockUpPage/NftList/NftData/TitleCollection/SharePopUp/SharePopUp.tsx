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
import { ColorStoreType } from '../../../../../../ducks/colors/colorStore.types';
import { ISharePopUp } from '../../../../mockupPage.types';

import './SharePopUp.css';

const SharePopUp: React.FC<ISharePopUp> = ({
  onClose,
  selectedValue,
  open
}) => {
  const [copySuccess /*setCopySuccess*/] = useState<string>('Copy link');
  const currentUrl = document.location.href;

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const { headerLogo, primaryColor, textColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

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
      navigator.clipboard.writeText(currentUrl);
      closePopUp();
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        style={{
          backgroundColor: `${
            primaryColor === '#dedede'
              ? 'var(--rhyno-40)'
              : `color-mix(in srgb, ${primaryColor} 40%, #888888)`
          }`,
          color: textColor
        }}>
        Share
      </DialogTitle>
      <List
        style={{
          backgroundColor: `${
            primaryColor === '#dedede'
              ? 'var(--rhyno-40)'
              : `color-mix(in srgb, ${primaryColor} 40%, #888888)`
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
          <ListItemText style={{ color: textColor }} primary={copySuccess} />
        </ListItem>
        {hotdropsVar !== 'true' && (
          <>
            <ListItem style={{ overflow: 'hidden' }} autoFocus button>
              <FacebookShareButton
                className="share-copy-link network__share-button"
                url={currentUrl}
                // quote={'Rair tech'}
                style={{ display: 'flex' }}>
                <ListItemAvatar>
                  <FacebookRoundedIcon
                    style={{ color: '#4267B2', fontSize: 40 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  style={{
                    color: textColor
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
                    color: textColor
                  }}
                  primary="Share on Twitter"
                />
              </TwitterShareButton>
            </ListItem>
          </>
        )}
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
