import React from "react";
import Definitions from "utils/Definitions";

export default class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
    }

    render() {
        
        return (
            <div
                style={{
                    flexDirection: "column",
                    margin: Definitions.DEFAULT_MARGIN
                }}
            >
                <label
                    style={{
                        color: "#b9bbbe",
                        fontSize: 14,
                        fontWeight: "bold"
                    }}
                >
                    { this.props.title && this.props.title.toUpperCase() }
                </label>
                <input
                    style={{
                        ...this.props.style,
                        backgroundColor: "rgba(128, 128, 128, 0.3)",
                        padding: Definitions.DEFAULT_PADDING,
                        transition: "0.5s",
                        outline: "none",
                        boxSizing: "border-box",
                        border: "1px solid",
                        borderColor: this.state.focused ? Definitions.SECONDARY_COLOR : "#242424",
                        color: Definitions.TEXT_COLOR,
                        borderRadius: 2,
                        marginTop: 2
                    }}
                    type={ this.props.type || "text" }
                    onFocus={ () => this.setState({ focused: true }) }
                    onBlur={ () => this.setState({ focused: false }) }
                />
            </div>
        );
    }
}