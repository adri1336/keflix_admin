import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

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
                        outline: 0
                    }}
                    type="checkbox"
                />
                {
                    this.props.title &&
                    <label
                        style={{
                            color: Definitions.SECONDARY_TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.MEDIUM_SIZE,
                            fontWeight: "bold"
                        }}
                    >
                        { this.props.title }
                    </label>
                }
            </div>
        );
    }
}