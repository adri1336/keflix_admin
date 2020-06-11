import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import IconButton from "components/IconButton";

export default (props) => {
    const
        [focused, setFocused] = React.useState(),
        [passwordVisible, setPasswordVisible] = React.useState(false);
    
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: Definitions.COMPONENT_BG_COLOR,
                    padding: Definitions.DEFAULT_PADDING,
                    outline: "none",
                    border: "1px solid",
                    borderColor: focused ? Definitions.SECONDARY_COLOR : Definitions.COMPONENT_BORDER_COLOR,
                    borderRadius: Definitions.DEFAULT_BORDER_RADIUS,
                    marginTop: 2
                }}
            >
                <input.element
                    style={{
                        width: "100%",
                        color: Definitions.TEXT_COLOR,
                        backgroundColor: "transparent",
                        border: 0,
                        margin: 0,
                        padding: 0,
                        outline: "none"
                    }}
                    onFocus={ () => setFocused(true) }
                    onBlur={ () => setFocused(false) }
                    required={ props.required || false }
                    onChange={ props.onChange }
                    value={ props.value }
                    { ...props.inputProps }
                    type={ passwordVisible === true ? "text" : type }
                />
                {
                    type === "password" &&
                    <IconButton
                        icon={{ class: passwordVisible ? AiFillEyeInvisible : AiFillEye }}
                        style={{ marginLeft: Definitions.DEFAULT_PADDING / 2 }}
                        onClick={ () => setPasswordVisible(!passwordVisible) }
                    />
                }
            </div>
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