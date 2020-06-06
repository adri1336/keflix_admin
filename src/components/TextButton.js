import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default ({ style, color, title, onClick }) => {    
    return (
        <div
            style={{
                ...style
            }}
        >
            <span
                style={{
                    cursor: "pointer",
                    color: color || Definitions.SECONDARY_COLOR,
                    fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    fontWeight: "bold"
                }}
                onClick={ onClick }
            >
                { title }
            </span>
        </div>
    );
}