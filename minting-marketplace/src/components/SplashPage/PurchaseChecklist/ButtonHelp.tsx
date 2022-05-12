//@ts-nocheck
import React from 'react'

const ButtonHelp = ({ toggleCheckList, backgroundButton }) => {
    return (
        <button
            className="btn-help"
            onClick={() => toggleCheckList()}
            style={{ background: backgroundButton }}
        >
            Need help?
        </button>
    )
}

export default ButtonHelp