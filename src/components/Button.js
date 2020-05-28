import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default (props) => {
    return (
        <div
            style={{
                marginLeft: Definitions.DEFAULT_MARGIN
            }}
        >
            <button
                style={{
                    ...props.style,
                    backgroundColor: Definitions.COMPONENT_BG_COLOR,
                    border: 0,
                    padding: Definitions.DEFAULT_PADDING,
                    outline: "none"
                }}
                onClick={ props.onClick }
                type={ props.type || "button" }
            >
                <span
                        style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE
                    }}
                >
                    { props.title }    
                </span>
            </button>
        </div>
    );
}