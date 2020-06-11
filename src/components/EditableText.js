import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";
import IconButton from "components/IconButton";

export default ({ style, title, editable, selectable, value, onClick }) => {
    const { t } = useTranslation();

    let isUndefined = false;
    if(!value) {
        value = t("editable_text.undefined")
        isUndefined = true;
    }

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
                            color: isUndefined ? Definitions.PLACEHOLDER_COLOR : Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                            marginRight: Definitions.DEFAULT_PADDING,
                            userSelect: "text",
                            maxWidth: "90%"
                        }}
                    >
                        { value }
                    </span>
                    {
                        editable &&
                        <IconButton
                            icon={{ class: MdEdit }}
                            onClick={ onClick }
                        />
                    }
                </div>
            }
        </div>
    );
};