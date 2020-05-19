import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default class Checkbox extends React.Component {
    render() {
        return (
            <div
                style={{
                    margin: Definitions.DEFAULT_MARGIN
                }}
            >
                <label
                    style={{
                        color: Definitions.SECONDARY_TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.MEDIUM_SIZE,
                        fontWeight: "bold",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <input
                        style={{
                            width: 20,
                            height: 20
                        }}
                        type="checkbox"
                    />
                    { this.props.title }
                </label>
            </div>
        );
    }
}