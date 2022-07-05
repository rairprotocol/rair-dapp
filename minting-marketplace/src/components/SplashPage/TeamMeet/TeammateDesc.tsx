//@ts-nocheck
import React, { useState } from 'react';

const TeammateDesc = ({ desc, primaryColor, arraySplash }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="teammate-description">
      {desc.length === 1 &&
        desc.map((p, index) => {
          if (p.length >= 500) {
            return (
              <p
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
              </p>
            );
          }
          return (
            <p
              key={index}
              className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}
              style={{
                color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
              }}>
              {p}
            </p>
          );
        })}
      {desc.length >= 2 &&
        desc.map((p, index) => {
          if (!showMore && index === 0) {
            return (
              <p
                key={index}
                className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}
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
              </p>
            );
          }

          if (showMore) {
            if (index === desc.length - 1) {
              return (
                <p
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
                </p>
              );
            }
            return (
              <p
                key={index}
                className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                {p}
              </p>
            );
          }

          return null;
        })}
    </div>
  );
};

export default TeammateDesc;
