//@ts-nocheck
import React, { memo } from 'react';

import cl from './Name.module.css';

const NameComponent = ({ onChange, value }) => {
  return (
    <div className={cl.field}>
      <label htmlFor={cl.name}>name:</label>
      <input
        className={cl.name}
        type="text"
        onChange={onChange}
        maxLength="25"
        value={value}
        placeholder="name"
        required
      />
    </div>
  );
};

export const Name = memo(NameComponent);
