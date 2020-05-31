import React from "react";
import Definitions from "utils/Definitions";
import TabButton from "components/TabButton";

export default ({ routes }) => {
    return (
        <div
            style={{
                backgroundColor: Definitions.SECONDARY_BG_COLOR,
                width: 250,
                height: "100vh",
                marginRight: Definitions.DEFAULT_MARGIN
            }}
        >
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 50
                }}
            >
                <img
                    src={ require("assets/logo.png") }
                    style={{ width: "100%" }}
                    alt="logo"
                />
            </div>
            
            {
                routes.map((route) => {
                    return (
                        <TabButton
                            key={ route.path }
                            route={ route }
                        />
                    );
                })
            }
        </div>
    );
}