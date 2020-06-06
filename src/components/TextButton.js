import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default ({ title, onClick }) => {
    const [focused, setFocused] = React.useState(false);
    
    return (
        <span
            style={{
                cursor: "pointer",
                color: focused ? Definitions.TEXT_COLOR : Definitions.PLACEHOLDER_COLOR,
                fontSize: DEFAULT_SIZES.NORMAL_SIZE
            }}
            onMouseEnter={ () => setFocused(true) }
            onMouseLeave={ () => setFocused(false) }
            onClick={ onClick }
        >
            { title }
        </span>
    );
}