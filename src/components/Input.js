import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default (props) => {
    const [focused, setFocused] = React.useState();

    const
        title = props.title || null,
        type = props.type || "text",
        textArea = props.textArea !== undefined && props.textArea ? true : false;
    
    const input = { element: textArea ? TextArea : Input };
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
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
            <input.element
                style={{
                    ...props.style,
                    backgroundColor: Definitions.COMPONENT_BG_COLOR,
                    padding: Definitions.DEFAULT_PADDING,
                    outline: "none",
                    border: "1px solid",
                    borderColor: focused ? Definitions.SECONDARY_COLOR : Definitions.COMPONENT_BORDER_COLOR,
                    color: Definitions.TEXT_COLOR,
                    borderRadius: Definitions.DEFAULT_BORDER_RADIUS,
                    marginTop: 2
                }}
                type={ type }
                onFocus={ () => setFocused(true) }
                onBlur={ () => setFocused(false) }
                required={ props.required || false }
                onChange={ props.onChange }
                value={ props.value }
                { ...props.inputProps }
            />
        </div>
    );
}

const Input = (props) => {
    return <input { ...props }/>
}

const TextArea = (props) => {
    return (
        <textarea
            { ...props }
            style={{
                ...props.style,
                resize: "vertical"
            }}
            rows={ 5 }
        />
    );
}