import { FC } from "react"
import "./BlockButton.css"

interface IBlockButton {
    onclick: () => void;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    children: string;
}

const BlockButton: FC<IBlockButton> = ({
    onclick,
    backgroundColor,
    borderColor,
    textColor,
    children,
}) => {
    return (
        <button
            type="button"
            className="block-button"
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

export default BlockButton