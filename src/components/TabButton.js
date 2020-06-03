import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { useLocation, Link } from "react-router-dom";

export default ({ route }) => {
    const
        location = useLocation(),
        [focused, setFocused] = React.useState(false);

    return (
        <Link
            to={ route.path }
            style={{
                display: "flex",
                borderTop: route.separator ? "1px solid " + Definitions.COMPONENT_BG_COLOR : "0",
                borderLeft: location.pathname === route.path ? "2px solid " + Definitions.SECONDARY_COLOR : "2px solid transparent",
                flex: 1,
                alignItems: "center",
                padding: Definitions.DEFAULT_PADDING,
                backgroundColor: focused ? Definitions.COMPONENT_BG_COLOR : "transparent",
                textDecoration: "none",
                outline: "none"
            }}
            onMouseEnter={ () => setFocused(true) }
            onMouseLeave={ () => setFocused(false) }
        >
            <route.icon
                color={ Definitions.SECONDARY_TEXT_COLOR }
                size={ DEFAULT_SIZES.BIG_SIZE }
                style={{
                    marginRight: Definitions.DEFAULT_PADDING
                }}
            />
            <span
                style={{
                    color: Definitions.SECONDARY_TEXT_COLOR,
                    fontSize: DEFAULT_SIZES.NORMAL_SIZE
                }}
            >
                { route.name }
            </span>
        </Link>
    );
}