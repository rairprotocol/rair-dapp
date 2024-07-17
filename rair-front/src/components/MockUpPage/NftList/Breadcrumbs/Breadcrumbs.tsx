import React, { memo, MouseEvent, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import SingleTokenHome from '../../assets/singleTokenHome.svg?react';
import { TParamsBreadcrumbsComponent } from '../../mockupPage.types';
import { IBreadcrumbsComponent } from '../nftList.types';

import './Breadcrumbs.css';

const BreadcrumbsComponent: React.FC<IBreadcrumbsComponent> = ({
  embeddedParams
}) => {
  const params = useParams<TParamsBreadcrumbsComponent>();
  const { contract, product, blockchain } = embeddedParams
    ? embeddedParams
    : params;
  const navigate = useNavigate();
  const { primaryColor, textColor, iconColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    embeddedParams
      ? embeddedParams.setMode('collection')
      : navigate(`/collection/${blockchain}/${contract}/${product}/0`);
  }
  function goToSingleView(event: MouseEvent) {
    event.preventDefault();
    embeddedParams ? embeddedParams.setMode('tokens') : navigate(-1);
  }
  let breadcrumbs: ReactElement[] = [];

  const { pathname } = useLocation();
  const mode = embeddedParams
    ? embeddedParams.mode
    : pathname?.split('/')?.at(1);

  const HomeButton = () => {
    if (embeddedParams) {
      return (
        <div
          className="nft-home-icon"
          style={{
            color:
              import.meta.env.VITE_TESTNET === 'true'
                ? `${
                    textColor === '#FFF' || textColor === 'black'
                      ? '#F95631'
                      : textColor
                  }`
                : `${
                    textColor === '#FFF' || textColor === 'black'
                      ? '#E882D5'
                      : textColor
                  }`
          }}>
          <SingleTokenHome
            style={{
              fill:
              import.meta.env.VITE_TESTNET === 'true'
              ? 
              `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
              : `${
                iconColor === '#1486c5' ? '#E882D5' : iconColor}`
            }}
            width={24}
            height={24}
          />
        </div>
      );
    } else {
      return (
        <NavLink to="/">
          <div
            style={{
              color:
                import.meta.env.VITE_TESTNET === 'true'
                  ? `${
                      textColor === '#FFF' || textColor === 'black'
                        ? '#F95631'
                        : textColor
                    }`
                  : `${
                      textColor === '#FFF' || textColor === 'black'
                        ? '#E882D5'
                        : textColor
                    }`
            }}
            className="nft-home-icon">
            <SingleTokenHome
              style={{
                fill:
                import.meta.env.VITE_TESTNET === 'true'
                ? 
                `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
                : `${
                  iconColor === '#1486c5' ? '#E882D5' : iconColor}`
              }}
              width={24}
              height={24}
            />
          </div>
        </NavLink>
      );
    }
  };

  switch (mode) {
    case 'collection':
      breadcrumbs = [
        <HomeButton key="1" />,
        <Typography
          key="3"
          color={`${
            primaryColor === 'rhyno' ? 'var(--charcoal)' : 'var(--charcoal-60)'
          }`}>
          Collection
        </Typography>
      ];
      break;
    case 'tokens':
      breadcrumbs = [
        <HomeButton key="1" />,
        <Link
          underline="hover"
          key="2"
          color={`${
            primaryColor === 'rhyno' ? 'var(--charcoal)' : 'var(--charcoal-60)'
          }`}
          href="/all"
          onClick={handleClick}>
          Collection
        </Link>,
        <Typography
          key="3"
          color={`${primaryColor === 'rhyno' ? 'var(--charcoal)' : '#FFFFFF'}`}>
          Single Token
        </Typography>
      ];
      break;
    case 'unlockables':
      breadcrumbs = [
        <HomeButton key="1" />,
        <Link
          underline="hover"
          key="2"
          color="gray"
          href="/all"
          onClick={handleClick}>
          Collection
        </Link>,
        <Link
          underline="hover"
          key="3"
          color="gray"
          href="/all"
          onClick={goToSingleView}>
          Single Token
        </Link>,
        <Typography key="3" color={textColor}>
          Unlockables Content
        </Typography>
      ];
      break;
    default:
  }

  return (
    <Stack spacing={2} className="breadcrumbs-container">
      <Breadcrumbs
        color="var(--charcoal-80)"
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
};

export const BreadcrumbsView = memo(BreadcrumbsComponent);
