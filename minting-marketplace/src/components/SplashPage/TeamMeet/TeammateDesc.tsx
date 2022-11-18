import { useState } from 'react';

import { ITeammateDesc } from '../splashPage.types';

const TeammateDesc: React.FC<ITeammateDesc> = ({
  desc,
  primaryColor,
  arraySplash
}) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  return (
    <div className="teammate-description">
      {desc.length === 1 &&
        desc.map((p, index) => {
          if (p.length >= 500) {
            return (
              <div
                className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}
                key={index}
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                {showMore ? p : p.substring(0, 500)}
                <button
                  className="btn-show-more"
                  onClick={() => {
                    setShowMore(!showMore);
                  }}>
                  {showMore ? 'Read less' : 'Read more...'}
                </button>
              </div>
            );
          }
          return (
            <div
              key={index}
              className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}
              style={{
                color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
              }}>
              {p}
            </div>
          );
        })}
      {desc.length >= 2 &&
        desc.map((p, index) => {
          if (!showMore && index === 0) {
            return (
              <div
                key={index}
                className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                {showMore ? p : p.substring(0, 500)}{' '}
                <button
                  className="btn-show-more"
                  onClick={() => {
                    setShowMore(!showMore);
                  }}>
                  {showMore ? 'Read less' : 'Read more...'}
                </button>
              </div>
            );
          }

          if (showMore) {
            if (index === desc.length - 1) {
              return (
                <div
                  key={index}
                  className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                  }}>
                  {p}
                  <button
                    className="btn-show-more"
                    onClick={() => {
                      setShowMore(!showMore);
                    }}>
                    Read less
                  </button>
                </div>
              );
            }
            return (
              <div
                key={index}
                className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                {p}
              </div>
            );
          }

          return null;
        })}
    </div>
  );
};

export default TeammateDesc;
