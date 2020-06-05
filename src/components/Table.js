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

export default ({ data, headersAlign, cellsAlign, headers, onRenderCell, onSortRequest, onRowClick }) => {
    const [filteredData, setFilteredData] = React.useState(Object.create(data));
    const [tableHeight, setTableHeight] = React.useState(0);
    
    const containerElement = React.createRef();

    React.useEffect(() => {
        if(data && data.length > 0) {
            setFilteredData(Object.create(data));
        }
    }, [data]);

    React.useEffect(() => {
        setTableHeight(containerElement.current.clientHeight);

        let resizing = false;
        window.addEventListener("resize", () => {
            if(!resizing) {
                setTableHeight(0);
            }
            resizing = true;

            if(containerElement.current) {
                resizing = false;
                setTableHeight(containerElement.current.clientHeight);
            }
        });
        return () => window.removeEventListener("resize", () => {});
    }, [containerElement]);

    const setNewData = (newData) => {
        for (let i = 0; i < newData.length; i++) {
            const filteredElement = newData[i];
            for (let j = 0; j < data.length; j++) {
                const dataElement = data[j];
                if(filteredElement === dataElement) {
                    filteredElement.realIndex = j;
                    break;
                }
            }
        }
        setFilteredData(newData);
    }

    return (
        <div
            ref={ containerElement }
            style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                border: "1px solid " + Definitions.COMPONENT_BG_COLOR,
                borderRadius: Definitions.DEFAULT_BORDER_RADIUS
            }}
        >
            <div
                style={{
                    display: "block",
                    width: "100%",
                    height: tableHeight,
                    overflow: "auto"
                }}
            >
                <div
                    style={{
                        display: "table",
                        width: "100%",
                        borderCollapse: "collapse",
                        overflow: "scroll"
                    }}
                >

                    <div
                        style={{
                            display: "table-header-group"
                        }}
                    >
                        {
                            headers && headers.length > 0 &&
                            <div
                                style={{
                                    display: "table-row",
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
                                                onOrderChange={
                                                    (headerId, order) => {
                                                        if(onSortRequest) {
                                                            const newData = Object.create(onSortRequest(headerId));
                                                            if(order === ORDERS.DESC) {
                                                                newData.reverse();
                                                            }
                                                            setNewData(newData);
                                                        }
                                                    }
                                                }
                                            />
                                        );
                                    })
                                }
                            </div>
                        }
                    </div>

                    <div
                        style={{
                            display: "table-row-group"
                        }}
                    >
                        {
                            filteredData && filteredData.length > 0 &&
                            filteredData.map((element, index) => {
                                return (
                                    <Row
                                        key={ index }
                                        headers={ headers }
                                        index={ element?.realIndex === undefined ? index : element.realIndex }
                                        cellsAlign={ cellsAlign }
                                        onRenderCell={ onRenderCell }
                                        onRowClick={ onRowClick }
                                    />
                                );
                            })
                        }
                    </div>

                </div>
            </div>
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
        <div
            style={{
                display: "table-cell",
                position: "sticky",
                top: 0,
                backgroundColor: Definitions.SECONDARY_BG_COLOR,
                padding: Definitions.DEFAULT_PADDING
            }}
        >
            <div
                style={{
                    display: "flex",
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
                                onOrderChange(header.id, newOrder);
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
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                        fontWeight: "bold"
                    }}
                >
                    { header.name.toUpperCase() }
                </span>
            }
            </div>
        </div>
    );
}

const Row = ({ headers, index, cellsAlign, onRenderCell, onRowClick }) => {
    const [focused, setFocused] = React.useState(false);

    return (
        <div
            style={{
                display: "table-row",
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
                        <div
                            key={ header.id }
                            style={{
                                display: "table-cell",
                                padding: Definitions.DEFAULT_PADDING
                            }}
                        >
                            { content }
                        </div>
                    );
                })
            }
        </div>
    );
}