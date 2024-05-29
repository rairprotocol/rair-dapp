import React, { useCallback, useEffect, useState } from 'react';

import { rFetch } from '../../utils/rFetch';

const ResalePage: React.FC = () => {
  const [resales, setResales] = useState([]);

  const getResaleData = useCallback(async () => {
    const { success, data } = await rFetch('/api/resales/open');
    if (success) {
      setResales(data);
    }
  }, []);

  useEffect(() => {
    getResaleData();
  }, [getResaleData]);

  return (
    <div>
      <h3>Resale offers</h3>
      {resales.map((offer, index) => {
        return <div key={index}>{index}</div>;
      })}
    </div>
  );
};

export default ResalePage;
