import { FC } from "react"
import "./OvalButton.css"

interface IOvalButton {
    onclick: () => void;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    children: React.ReactNode;
}

const OvalButton: FC<IOvalButton> = ({
    onclick,
    backgroundColor,
    borderColor,
    textColor,
    children,
}) => {
    return (
        <button
            className="button"
            type="button"
            onClick={onclick}
            style={{
                background: backgroundColor,
                borderColor,
                color: textColor,
            }} 
        >
            {children}
        </button>
    )
}

export default OvalButton