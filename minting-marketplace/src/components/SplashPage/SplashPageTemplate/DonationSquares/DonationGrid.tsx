import { useEffect, useState } from 'react';

import DonationSquare from './DonationSquare';

import { IDonationGrid } from '../../splashPage.types';

import './DonationSquare.css';

const DonationGrid: React.FC<IDonationGrid> = ({ donationGridArray }) => {
  const mobile_match = window.matchMedia('(min-width: 1266px)');
  const [mobileView, setMobile] = useState<boolean>(mobile_match.matches);
  useEffect(() => {
    window.addEventListener('resize', () => setMobile(mobile_match.matches));
    return () =>
      window.removeEventListener('resize', () =>
        setMobile(mobile_match.matches)
      );
  }, [mobile_match.matches]);
  return (
    <div className="donation-grid">
      {donationGridArray.map((row, index) => (
        // eslint-disable-next-line react/jsx-key
        <DonationSquare
          key={index}
          donationSquareData={row}
          mobileView={mobileView}
        />
      ))}
    </div>
  );
};

export default DonationGrid;
