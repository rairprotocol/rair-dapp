//@ts-nocheck
import React, { memo } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { NavLink } from 'react-router-dom';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BreadcrumbsComponent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { primaryColor } = useSelector((store) => store.colorStore);

  function handleClick(event) {
    event.preventDefault();
    navigate(
      `/collection/${params.blockchain}/${params.contract}/${params.product}/0`
    );
    console.info('You clicked a breadcrumb.');
  }
  function goToSingleView(event) {
    event.preventDefault();
    navigate(-1);
  }
  let breadcrumbs = [];

  const { pathname } = useLocation();
  const mode = pathname?.split('/')?.at(1);

  switch (mode) {
    case 'collection':
      breadcrumbs = [
        <NavLink key="1" to="/">
          <HomeIcon
            style={{
              borderRadius: '8px',
              padding: '2px',
              background: '#E882D5',
              color: 'black'
            }}
            sx={{ fontSize: 'x-large' }}
          />
        </NavLink>,
        <Typography
          key="3"
          color={`${primaryColor === 'rhyno' ? 'black' : 'white'}`}>
          Collection
        </Typography>
      ];
      break;
    case 'tokens':
      breadcrumbs = [
        <NavLink key="1" to="/">
          <HomeIcon
            style={{
              borderRadius: '8px',
              padding: '2px',
              background: '#E882D5',
              color: 'black'
            }}
            sx={{ fontSize: 'x-large' }}
          />
        </NavLink>,

        <Link
          underline="hover"
          key="2"
          color="gray"
          href="/all"
          onClick={handleClick}>
          Collection
        </Link>,
        <Typography
          key="3"
          color={`${primaryColor === 'rhyno' ? 'black' : 'white'}`}>
          Single Token
        </Typography>
      ];
      break;
    case 'unlockables':
      breadcrumbs = [
        <NavLink key="1" to="/">
          <HomeIcon
            style={{
              borderRadius: '8px',
              padding: '2px',
              background: '#E882D5',
              color: 'black'
            }}
            sx={{ fontSize: 'x-large' }}
          />
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
    <Stack style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }} spacing={2}>
      <Breadcrumbs
        color="white"
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
};

export const BreadcrumbsView = memo(BreadcrumbsComponent);
