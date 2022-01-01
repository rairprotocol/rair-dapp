import React, { memo } from "react";
import cl from "./Status.module.css";

const StatusComponent = ({ onChange, value }) => {
  return (
    <div className={cl.field}>
      <label htmlFor={cl.status}>email:</label>
      <input
        className={cl.status}
        type="text"
        onChange={onChange}
        maxLength="35"
        value={value}
        placeholder="Email"
        required
      />
    </div>
  );
};

export const Status = memo(StatusComponent);
