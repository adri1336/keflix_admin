import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

export default class Input extends React.Component {
    render() {
        return (
            <div
                style={{
                    marginLeft: Definitions.DEFAULT_MARGIN
                }}
            >
                <button
                    style={{
                        ...this.props.style,
                        backgroundColor: Definitions.COMPONENT_BG_COLOR,
                        outline: 0,
                        border: 0,
                        padding: Definitions.DEFAULT_PADDING
                    }}
                >
                    <span
                         style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE
                        }}
                    >
                        { this.props.title }    
                    </span>
                </button>
            </div>
        );
    }
}