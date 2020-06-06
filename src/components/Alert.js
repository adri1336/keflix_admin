import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import Button from "components/Button";
import Input from "components/Input";

export default (props) => {
    const
        bgColor = props.bgColor || Definitions.PRIMARY_COLOR,
        textColor = props.textColor || Definitions.TEXT_COLOR,
        title = props.title || null,
        message = props.message || null,
        buttons = props.buttons,
        input = props.input || false,
        inputType = props.inputType || "text";

    const [inputValue, setInputValue] = React.useState("");

    return (
        <div
            style={{
                minWidth: 300,
                maxWidth: 400,
                minHeight: 100,
                maxHeight: 200,
                borderRadius: Definitions.DEFAULT_BORDER_RADIUS,
                backgroundColor: bgColor,
                padding: Definitions.DEFAULT_MARGIN
            }}
        >
            {
                title &&
                <span
                    style={{
                        color: textColor,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                        fontWeight: "bold"
                    }}
                >
                    { title }
                </span>
            }
            {
                message &&
                <p
                    style={{
                        color: textColor,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE
                    }}
                >
                    { message }
                </p>
            }
            {
                input &&
                <div
                    style={{
                        marginTop: -Definitions.DEFAULT_PADDING,
                        marginBottom: -Definitions.DEFAULT_PADDING,
                        marginLeft: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN
                    }}
                >
                    <Input
                        value={ inputValue }
                        type={ inputType }
                        onChange={ (event) => setInputValue(event.target.value) }
                    />
                </div>
            }
            {
                buttons &&
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end"
                    }}
                >
                    {
                        buttons.map((button, index) => (
                            <Button
                                key={ index }
                                title={ button.title }
                                style={{
                                    margin: Definitions.DEFAULT_PADDING,
                                    marginRight: index === buttons.length - 1 ? 0 : Definitions.DEFAULT_PADDING,
                                    marginBottom: 0
                                }}
                                onClick={
                                    () => {
                                        if(props.onButtonClick) {
                                            props.onButtonClick(button.id, inputValue);
                                        }
                                    }
                                }
                            />
                        ))
                    }
                </div>
            }
        </div>
    );
}