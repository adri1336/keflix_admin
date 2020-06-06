import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdEdit } from "react-icons/md";

export default ({ style, title, editable, value, onClick }) => {
    if(editable === undefined) {
        editable = true;
    }

    return(
        <div
            style={{
                ...style,
                display: "flex",
                flexDirection: "column"
            }}
        >
            {
                title &&
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                        fontWeight: "bold",
                        marginBottom: Definitions.DEFAULT_PADDING / 2
                    }}
                >
                    { title }
                </span>
            }
            {
                value &&
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <span
                        style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                            marginRight: Definitions.DEFAULT_PADDING
                        }}
                    >
                        { value }
                    </span>
                    {
                        editable &&
                        <EditButtonIcon
                            icon={{ class: MdEdit }}
                            onClick={ onClick }
                        />
                    }
                </div>
            }
        </div>
    );
};

export const EditButtonIcon = ({ icon, onClick }) => {
    const [focused, setFocused] = React.useState(false);

    return (
        <icon.class
            size={ DEFAULT_SIZES.NORMAL_SIZE }
            color={ focused ? Definitions.TEXT_COLOR : Definitions.PLACEHOLDER_COLOR }
            style={{
                cursor: "pointer"
            }}
            onMouseEnter={ () => setFocused(true) }
            onMouseLeave={ () => setFocused(false) }
            onClick={ onClick }
        />
    );
}