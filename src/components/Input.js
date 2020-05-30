import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default (props) => {
    const [focused, setFocused] = React.useState();

    const
        title = props.title || null,
        type = props.type || "text";
    
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                margin: Definitions.DEFAULT_MARGIN
            }}
        >
            {
                title &&
                <label
                    style={{
                        color: Definitions.SECONDARY_TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.MEDIUM_SIZE,
                        fontWeight: "bold"
                    }}
                >
                    { title }
                </label>
            }
            <input
                style={{
                    ...props.style,
                    backgroundColor: Definitions.COMPONENT_BG_COLOR,
                    padding: Definitions.DEFAULT_PADDING,
                    outline: "none",
                    border: "1px solid",
                    borderColor: focused ? Definitions.SECONDARY_COLOR : Definitions.COMPONENT_BORDER_COLOR,
                    color: Definitions.TEXT_COLOR,
                    borderRadius: 2,
                    marginTop: 2
                }}
                type={ type }
                onFocus={ () => setFocused(true) }
                onBlur={ () => setFocused(false) }
                required={ props.required || false }
                onChange={ props.onChange }
                value={ props.value }
            />
        </div>
    );
}