import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import Button from "components/Button";

export default (props) => {
    const
        bgColor = props.bgColor || Definitions.PRIMARY_COLOR,
        textColor = props.textColor || Definitions.TEXT_COLOR,
        title = props.title || null,
        message = props.message || null,
        buttons = props.buttons;

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
                                style={{ margin: Definitions.DEFAULT_PADDING }}
                                onClick={
                                    () => {
                                        if(props.onButtonClick) {
                                            props.onButtonClick(button.id, button.title);
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