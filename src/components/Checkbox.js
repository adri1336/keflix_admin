import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default (props) => {
    return (
        <div
            style={{
                display: "flex",
                margin: Definitions.DEFAULT_MARGIN,
                ...props.style
            }}
        >
            <label
                style={{
                    color: Definitions.SECONDARY_TEXT_COLOR,
                    fontSize: DEFAULT_SIZES.MEDIUM_SIZE,
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    outline: "none"
                }}
            >
                <input
                    style={{
                        width: 20,
                        height: 20
                    }}
                    type={ props.type || "checkbox" }
                    onChange={ props.onChange }
                    checked={ props.checked }
                />
                { props.title }
            </label>
        </div>
    );
}