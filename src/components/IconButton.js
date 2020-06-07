import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default ({ icon, size, style, children, onClick }) => {
    const [focused, setFocused] = React.useState(false);

    return (
        <icon.class
            size={ size || DEFAULT_SIZES.NORMAL_SIZE }
            color={ focused ? Definitions.TEXT_COLOR : Definitions.PLACEHOLDER_COLOR }
            style={{
                ...style,
                cursor: "pointer"
            }}
            onMouseEnter={ () => setFocused(true) }
            onMouseLeave={ () => setFocused(false) }
            onClick={ onClick }
        />
    );
}