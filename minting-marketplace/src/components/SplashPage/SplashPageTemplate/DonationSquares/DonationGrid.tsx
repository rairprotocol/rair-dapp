import './DonationSquare.css';
import DonationSquare from './DonationSquare';
import { useState } from 'react';

const DonationGrid = ({ donationGridArray }) => {
  const mobile_match = window.matchMedia('(min-width: 1100px)');
  const [mobileView, setMobile] = useState(mobile_match.matches);
  window.addEventListener('resize', () => setMobile(mobile_match.matches));
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
