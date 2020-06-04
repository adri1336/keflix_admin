import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export const FILTER_DATA_TYPES = {
    TEXT: 0,
    NUMBER: 1,
    BOOLEAN: 2,
    BOOLEAN_BOTH: 3
};

export const ORDERS = {
    ASC: 0,
    DESC: 1
};

export default ({ data, headersAlign, cellsAlign, headers, onRenderCell, onRowClick }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                border: "1px solid " + Definitions.COMPONENT_BG_COLOR,
                borderRadius: Definitions.DEFAULT_BORDER_RADIUS
            }}
        >
            <table
                style={{
                    borderCollapse: "collapse",
                    overflow: "scroll"
                }}
            >

                <thead>
                    {
                        headers && headers.length > 0 &&
                        <tr
                            style={{
                                backgroundColor: Definitions.SECONDARY_BG_COLOR,
                                borderBottom: "1px solid " + Definitions.COMPONENT_BG_COLOR
                            }}
                        >
                            {
                                headers.map(header => {
                                    return (
                                        <Header
                                            key={ header.id }
                                            headersAlign={ headersAlign }
                                            header={ header }
                                        />
                                    );
                                })
                            }
                        </tr>
                    }
                </thead>

                <tbody>
                {
                    data && data.length > 0 &&
                    data.map((element, index) => {
                        return (
                            <Row
                                key={ index }
                                headers={ headers }
                                index={ index }
                                cellsAlign={ cellsAlign }
                                onRenderCell={ onRenderCell }
                                onRowClick={ onRowClick }
                            />
                        );
                    })
                }
                </tbody>

            </table>
        </div>
    );
};

const Header = ({ header, headersAlign, onOrderChange }) => {
    const [order, setOrder] = React.useState(header.orderable ? (header.order || ORDERS.ASC) : null);
    const nextOrderIcon = { class: order === ORDERS.ASC ? IoIosArrowDown : IoIosArrowUp };

    let contentJustifyContent = null;
    switch(headersAlign) {
        case "center": {
            contentJustifyContent = "center";
            break;
        }
        case "right": {
            contentJustifyContent = "flex-end";
            break;
        }
        default: {
            contentJustifyContent = "flex-start";
        }
    }

    return (
        <th
            style={{
                padding: Definitions.DEFAULT_PADDING
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: contentJustifyContent
                }}
            >
            {
                order !== null &&
                <div
                    style={{
                        cursor: "pointer",
                        marginRight: 2
                    }}
                    onClick={
                        () => {
                            const newOrder = order === ORDERS.ASC ? ORDERS.DESC : ORDERS.ASC;
                            setOrder(newOrder);
                            if(onOrderChange) {
                                onOrderChange(newOrder);
                            }
                        }
                    }
                >
                    <nextOrderIcon.class
                        color={ Definitions.SECONDARY_TEXT_COLOR }
                        size={ DEFAULT_SIZES.BIG_SIZE }
                    />
                </div>
            }
            {
                header.name &&
                <span
                    style={{
                        color: Definitions.DARK_TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE
                    }}
                >
                    { header.name.toUpperCase() }
                </span>
            }
            </div>
        </th>
    );
}

const Row = ({ headers, index, cellsAlign, onRenderCell, onRowClick }) => {
    const [focused, setFocused] = React.useState(false);

    return (
        <tr
            style={{
                backgroundColor: focused ? Definitions.COMPONENT_BG_COLOR : "transparent",
                borderBottom: "1px solid " + Definitions.COMPONENT_BG_COLOR,
                textAlign: cellsAlign || "left",
                cursor: onRowClick ? "pointer" : "auto"
            }}
            onMouseEnter={ () => setFocused(true) }
            onMouseLeave={ () => setFocused(false) }
            onClick={
                () => {
                    if(onRowClick) {
                        onRowClick(index);
                    }
                }
            }
        >
            {
                onRenderCell &&
                headers.map(header => {
                    const content = onRenderCell(header.id, index);

                    return (
                        <td
                            key={ header.id }
                            style={{
                                padding: Definitions.DEFAULT_PADDING
                            }}
                        >
                            { content }
                        </td>
                    );
                })
            }
        </tr>
    );
}