import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";

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
                <input
                    style={{
                        ...this.props.style,
                        backgroundColor: Definitions.COMPONENT_BG_COLOR,
                        padding: Definitions.DEFAULT_PADDING,
                        outline: "none",
                        border: "1px solid",
                        borderColor: this.state.focused ? Definitions.SECONDARY_COLOR : Definitions.COMPONENT_BORDER_COLOR,
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