//@ts-nocheck
import React, { memo } from 'react';

import cl from './Status.module.css';

const StatusComponent = ({ onChange, value }) => {
  return (
    <div className={cl.field}>
      <label htmlFor={cl.status}>email:</label>
      <input
        className={cl.status}
        type="email"
        // pattern="/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
        onChange={onChange}
        maxLength="35"
        value={value}
        placeholder="Email"
        id="email"
        name="email"
        required
      />
    </div>
  );
};

export const Status = memo(StatusComponent);
