import React from "react";
import Definitions from "utils/Definitions";

export default class Checkbox extends React.Component {
    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    margin: Definitions.DEFAULT_MARGIN
                }}
            >
                <input
                    style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "rgba(128, 128, 128, 0.3)",
                    }}
                    type="checkbox"
                />
                <label
                    style={{
                        color: "#b9bbbe",
                        fontSize: 14,
                        fontWeight: "bold"
                    }}
                >
                    { this.props.title && this.props.title.toUpperCase() }
                </label>
            </div>
        );
    }
}