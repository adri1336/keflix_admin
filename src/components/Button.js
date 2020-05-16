import React from "react";
import Definitions from "utils/Definitions";

export default class Input extends React.Component {
    render() {
        return (
            <div
                style={{
                    margin: Definitions.DEFAULT_MARGIN
                }}
            >
                <button
                    style={{
                        ...this.props.style,
                        
                        
                        backgroundColor: "#555555",
                        border: "1px solid",
                        borderColor: "#242424",
                        borderRadius: 2,
                        padding: Definitions.DEFAULT_PADDING
                        

                    }}
                    type={ this.props.type || "text" }
                >
                    <span
                         style={{
                            color: "#b9bbbe",
                            fontSize: 14,
                            fontWeight: "bold"
                        }}
                    >
                        { this.props.title.toUpperCase() }    
                    </span>
                </button>
            </div>
        );
    }
}