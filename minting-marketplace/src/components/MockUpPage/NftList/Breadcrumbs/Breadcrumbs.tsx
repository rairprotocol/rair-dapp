import React, { memo, MouseEvent, ReactElement } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NavLink } from 'react-router-dom';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactComponent as SingleTokenHome } from '../../assets/singleTokenHome.svg';
import './Breadcrumbs.css';
import { RootState } from '../../../../ducks';
import { ColorChoice } from '../../../../ducks/colors/colorStore.types';
import { TParamsBreadcrumbsComponent } from '../../mockupPage.types';

const BreadcrumbsComponent = ({ embeddedParams }) => {
  const params = useParams<TParamsBreadcrumbsComponent>();
  const { contract, product, blockchain } = embeddedParams
    ? embeddedParams
    : params;
  const navigate = useNavigate();
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    embeddedParams
      ? embeddedParams.setMode('collection')
      : navigate(`/collection/${blockchain}/${contract}/${product}/0`);
    console.info('You clicked a breadcrumb.');
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
          onClick={() => {
            embeddedParams.setMode('collection');
          }}>
          <SingleTokenHome width={24} height={24} />
        </div>
      );
    } else {
      return (
        <NavLink to="/">
          <div className="nft-home-icon">
            <SingleTokenHome width={24} height={24} />
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
        <Typography
          key="3"
          color={`${primaryColor === 'rhyno' ? 'black' : 'white'}`}>
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
