//@ts-nocheck
import React from 'react';

export const useInput = (initialValue) => {
    const [value, setValue] = React.useState(initialValue);

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return {
        value,
        onChange: handleChange,
        setValue
    }
}
