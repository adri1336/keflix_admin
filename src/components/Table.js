import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import ContentEditable from "react-contenteditable";
import { useTranslation } from "react-i18next";
import { normalizeString } from "utils/Functions";

export const ORDERS = {
    ASC: 0,
    DESC: 1
};

const filterHeaderHeight = 20;
const isTableFilterable = (headers) => {
    for (let index = 0; index < headers.length; index++) {
        const header = headers[index];
        if(header.filterable) {
            return true;
        }
    }
    return false;
};

export default ({ data, headersAlign, cellsAlign, headers, onRenderCell, onRowClick }) => {
    const [filteredData, setFilteredData] = React.useState(Object.create(data));
    const [tableHeight, setTableHeight] = React.useState(0);
    
    const containerElement = React.createRef();

    React.useEffect(() => {
        headers.forEach(header => {
            header.filter = "";
        });
    }, [headers]);

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

    const getFilters = () => {
        let filters = {};
        headers.forEach(header => {
            if(header.filter) {
                let stringFilter = header.filter.toString();
                stringFilter = normalizeString(stringFilter).toLowerCase();

                filters[header.id] = stringFilter;
            }
        });
        return filters;
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
                                                tableFilterable={ isTableFilterable(headers) }
                                                headersAlign={ headersAlign }
                                                header={ header }
                                                onOrderChange={
                                                    (headerId, order) => {
                                                        if(data.length > 0) {
                                                            const newData = filteredData.sort((a, b) => {
                                                                if(a[headerId] < b[headerId]) {
                                                                    return -1;
                                                                }
                                                                if(a[headerId] > b[headerId] ) {
                                                                    return 1;
                                                                }
                                                                return 0;
                                                            });
                                                            if(order === ORDERS.DESC) {
                                                                newData.reverse();
                                                            }

                                                            setNewData(Object.create(newData));
                                                        }
                                                    }
                                                }
                                                onFilterRequest={
                                                    () => {
                                                        if(data.length > 0) {
                                                            const filters = getFilters();
                                                            const newData = data.filter(item => {
                                                                for(let property in filters) {
                                                                    if(item[property] !== undefined) {
                                                                        let stringValue = item[property].toString();
                                                                        stringValue = normalizeString(stringValue).toLowerCase();

                                                                        if(!stringValue.includes(filters[property])) {
                                                                            return false;
                                                                        }
                                                                    }
                                                                }
                                                                return true;
                                                            });
                                                            setNewData(Object.create(newData));
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

const Header = ({ tableFilterable, header, headersAlign, onOrderChange, onFilterRequest }) => {
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
                    flexDirection: "column"
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
                                fontWeight: "bold",
                                whiteSpace: "nowrap"
                            }}
                        >
                            { header.name.toUpperCase() }
                        </span>
                    }
                </div>
                {
                    tableFilterable &&
                    <FilteredHeader
                        header={ header }
                        onFilterChange={
                            value => {
                                if(header.filter !== value) {
                                    header.filter = value;
                                    if(onFilterRequest) {
                                        onFilterRequest();
                                    }
                                }
                            }
                        }
                    />
                }
            </div>
        </div>
    );
}

const FilteredHeader = ({ header, onFilterChange }) => {
    const [value, setValue] = React.useState(null);
    const [focused, setFocused] = React.useState(false);
    const { t } = useTranslation();
    
    React.useEffect(() => {
        if(value !== null && onFilterChange) {
            onFilterChange(value);
        }
    }, [value, onFilterChange]);

    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                marginTop: Definitions.DEFAULT_PADDING
            }}
        >
            <div
                style={{
                    display: "flex",
                    position: "relative",
                    width: "100%",
                    height: filterHeaderHeight,
                    paddingTop: Definitions.DEFAULT_PADDING
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: "calc(100% + " + Definitions.DEFAULT_PADDING * 2 + "px)",
                        margin: -Definitions.DEFAULT_PADDING,
                        height: 1,
                        backgroundColor: Definitions.PLACEHOLDER_COLOR
                    }}
                />
                {
                    header.filterable &&
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            position: "absolute",
                            width: "calc(100% - " + Definitions.DEFAULT_PADDING * 2 + "px)",
                            left: Definitions.DEFAULT_PADDING,
                            height: "calc(100% - 10px)"
                        }}
                    >
                        <span
                            style={{
                                flex: 1,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                resize: "none",
                                color: (value || focused) ? Definitions.TEXT_COLOR : Definitions.PLACEHOLDER_COLOR,
                                fontSize: DEFAULT_SIZES.MEDIUM_SIZE
                            }}
                            onFocus={ () => setFocused(true) }
                            onBlur={ () => setFocused(false) }
                        >
                            <ContentEditable
                                html={ focused ? value || "" : value || t("table.filter_placeholder") }
                                onChange={ event => setValue(event.target.value) }
                                style={{
                                    outline: "none"
                                }}
                            />
                        </span>
                        <div
                            style={{
                                width: filterHeaderHeight,
                                height: filterHeaderHeight
                            }}
                        >
                            {
                                value && 
                                <FilteredHeaderDeleteButton
                                    onClick={ () => setValue("") }
                                />
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

const FilteredHeaderDeleteButton = ({ onClick }) => {
    const [focused, setFocused] = React.useState(false);

    return (
        <TiDelete
            style={{
                cursor: "pointer"
            }}
            color={ focused ? Definitions.TEXT_COLOR : Definitions.PLACEHOLDER_COLOR }
            size={ filterHeaderHeight }
            onMouseEnter={ () => setFocused(true) }
            onMouseLeave={ () => setFocused(false) }
            onClick={ onClick }
        />
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