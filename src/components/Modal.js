import React from "react";

export default ({ style, relative, children }) => {   
    return (
        <div
            style={{
                ...style,
                width: relative ? "100%" : "100vw",
                height: relative ? "100%" : "100vh",
                position: "absolute",
                zIndex: 1
            }}
        >
            { children }
        </div>
    );
}