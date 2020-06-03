import React from "react";
import Definitions from "utils/Definitions";

export default (props) => {
    const
        size = props.size || 100,
        strokeWidth = props.strokeWidth || 8,
        bgColor = props.bgColor || Definitions.COMPONENT_BG_COLOR,
        color = props.color || Definitions.SECONDARY_COLOR,
        percentage = props.percentage || 0;

    const radius = (size / 2) - (strokeWidth / 2);
    
    return (
        <div
            width={ size }
            height={ size }
            style={{
                position: "relative",
                ...props.style
            }}
        >
            <svg
                width={ size }
                height={ size }
                style={{
                    transform: "rotate(-90deg)"
                }}
            >
                <circle
                    cx={ size / 2 }
                    cy={ size / 2 }
                    r={ radius }
                    fill="transparent"
                    stroke={ bgColor }
                    strokeWidth={ strokeWidth }
                />
                <circle
                    cx={ size / 2 }
                    cy={ size / 2 }
                    r={ radius }
                    fill="transparent"
                    stroke={ color }
                    strokeWidth={ strokeWidth }
                    strokeDasharray={ 2 * Math.PI * radius }
                    strokeDashoffset={ (100 - percentage) * (2 * Math.PI * radius) / 100 }
                />
            </svg>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
            >
                { props.children }
            </div>
        </div>
    );
}