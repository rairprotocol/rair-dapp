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

const BreadcrumbsComponent = () => {
  const { blockchain, product, contract } =
    useParams<TParamsBreadcrumbsComponent>();
  const navigate = useNavigate();
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    navigate(`/collection/${blockchain}/${contract}/${product}/0`);
    console.info('You clicked a breadcrumb.');
  }
  function goToSingleView(event: MouseEvent) {
    event.preventDefault();
    navigate(-1);
  }
  let breadcrumbs: ReactElement[] = [];

  const { pathname } = useLocation();
  const mode = pathname?.split('/')?.at(1);

  switch (mode) {
    case 'collection':
      breadcrumbs = [
        <NavLink key="1" to="/">
          <div className="nft-home-icon">
            <SingleTokenHome width={24} height={24} />
          </div>
        </NavLink>,
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
        <NavLink key="1" to="/">
          <div className="nft-home-icon">
            <SingleTokenHome width={24} height={24} />
          </div>
        </NavLink>,

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
        <NavLink key="1" to="/">
          <div className="nft-home-icon">
            <SingleTokenHome width={24} height={24} />
          </div>
        </NavLink>,

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
