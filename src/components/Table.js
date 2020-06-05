import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { getScrollbarWidth } from "utils/Functions";

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
    const [tbodyHeight, setTbodyHeight] = React.useState(0);
    const [isScrollbarVisible, setIsScrollbarVisible] = React.useState(false);
    
    const
        containerElement = React.createRef(),
        theadElement = React.createRef(),
        tbodyElement = React.createRef();

    React.useEffect(() => {
        if(data && data.length > 0) {
            setFilteredData(Object.create(data));
        }
    }, [data]);

    React.useEffect(() => {
        setTbodyHeight(containerElement.current.clientHeight - theadElement.current.clientHeight);

        let resizing = false;
        window.addEventListener("resize", () => {
            if(!resizing) {
                setTbodyHeight(0);
            }
            resizing = true;
            if(containerElement.current && theadElement.current) {
                resizing = false;
                setTbodyHeight(containerElement.current.clientHeight - theadElement.current.clientHeight);
            }
        });
        return () => window.removeEventListener("resize", () => {});
    }, [containerElement, theadElement, tbodyElement]);

    React.useEffect(() => {
        if(tbodyElement.current) {
            if(tbodyElement.current.scrollHeight > tbodyElement.current.clientHeight) {
                if(!isScrollbarVisible) {
                    setIsScrollbarVisible(true);
                }
            }
            else {
                if(isScrollbarVisible) {
                    setIsScrollbarVisible(false);
                }
            }
        }
    }, [tbodyHeight, tbodyElement, isScrollbarVisible]);

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

                <thead
                    ref={ theadElement }
                    style={{
                        display: "table",
                        width: "100%",
                        tableLayout: "fixed",
                        backgroundColor: Definitions.SECONDARY_BG_COLOR
                    }}
                >
                    {
                        headers && headers.length > 0 &&
                        <tr
                            style={{
                                display: "table",
                                width: isScrollbarVisible ? "calc(100% - " + getScrollbarWidth() + "px)" : "100%",
                                tableLayout: "fixed",
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
                        </tr>
                    }
                </thead>

                <tbody
                    ref={ tbodyElement }
                    style={{
                        display: "block",
                        height: tbodyHeight,
                        overflow: "auto",
                        tableLayout: "fixed"
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
                    flex: 1,
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
                display: "table",
                width: "100%",
                tableLayout: "fixed",
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