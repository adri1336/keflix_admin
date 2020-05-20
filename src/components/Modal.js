import React from "react";

export default (props) => {   
    return (
        <div
            style={{
                ...props.style,
                width: "100vw",
                height: "100vh",
                position: "fixed",
                zIndex: 1
            }}
        >
            { props.children }
        </div>
    );
}