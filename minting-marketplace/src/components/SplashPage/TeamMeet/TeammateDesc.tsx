import { useState } from 'react';

import { ITeammateDesc } from '../splashPage.types';

const TeammateDesc: React.FC<ITeammateDesc> = ({
  readMoreCount,
  setReadMoreCount,
  desc,
  primaryColor,
  readMoreCountFlag,
  arraySplash
}) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const readMoreCounter = () => {
    if (setReadMoreCount && readMoreCount != undefined && readMoreCountFlag) {
      if (showMore) {
        setReadMoreCount(readMoreCount - 1 * readMoreCountFlag);
      } else {
        setReadMoreCount(readMoreCount + 1 * readMoreCountFlag);
      }
    }
  };

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
                    readMoreCounter();
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
                    readMoreCounter();
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
                      readMoreCounter();
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
