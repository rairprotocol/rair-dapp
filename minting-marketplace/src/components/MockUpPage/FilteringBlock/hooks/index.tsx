import React, { ChangeEvent } from 'react';

export const useInput = (initialValue: string) => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return {
    value,
    onChange: handleChange,
    setValue
  };
};
