import React from "react";
import Definitions from "utils/Definitions";

export default (props) => {
    const
        borderSize = props.borderSize || 4,
        size = props.size || 30,
        animationDuration = props.animationDuration || 2,
        bgColor = props.bgColor || "white",
        color = props.color || Definitions.SECONDARY_COLOR;

    return (
        <div>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div
                style={{
                    ...props.style,
                    border: borderSize + "px solid " + bgColor,
                    borderRadius: "50%",
                    borderTop: borderSize + "px solid " + color,
                    width: size,
                    height: size,
                    animation: "spin " + animationDuration + "s linear infinite"
                }}
            />
        </div>
    );
}