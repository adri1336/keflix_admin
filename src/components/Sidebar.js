import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdAccountCircle } from "react-icons/md";
import { AuthContext } from "context/Auth";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";

export default ({ routes, width }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();
    
    return (
        <div
            style={{
                position: "fixed",
                backgroundColor: Definitions.SECONDARY_BG_COLOR,
                width: width,
                minWidth: width,
                height: "100%",
                borderRight: "1px solid " + Definitions.COMPONENT_BG_COLOR,
                zIndex: 1
            }}
        >
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    padding: Definitions.DEFAULT_PADDING
                }}
            >
                <span
                    style={{
                        color: Definitions.DARK_TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.MEDIUM_SIZE
                    }}
                >
                    { Definitions.APP_VERSION }
                </span>
            </div>
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
            
            <div>
                {
                    routes.map(route => {
                        if(route.sidebar !== undefined && !route.sidebar) {
                            return null;
                        }

                        return (
                            <TabButton
                                key={ route.path }
                                route={ route }
                            />
                        );
                    })
                }
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginLeft: Definitions.DEFAULT_MARGIN,
                    alignItems: "center",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: 100
                }}
            >
                <MdAccountCircle
                    color={ Definitions.SECONDARY_TEXT_COLOR }
                    size={ DEFAULT_SIZES.TITLE_SIZE }
                    style={{
                        marginRight: Definitions.DEFAULT_PADDING
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <span
                        style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE
                        }}
                    >
                        { authContext.state.account.email }
                    </span>
                    <span
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={
                            () => {
                                localStorage.clear();
                                authContext.setState(null);
                            }
                        }
                    >
                        <span
                            style={{
                                color: Definitions.TEXT_COLOR,
                                fontSize: DEFAULT_SIZES.MEDIUM_SIZE
                            }}
                        >
                            { t("sidebar.logout_button") }
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ route }) => {
    const
        location = useLocation(),
        [focused, setFocused] = React.useState(false);

    return (
        <Link
            to={ route.path }
            style={{
                display: "flex",
                borderTop: route.separator ? "1px solid " + Definitions.COMPONENT_BG_COLOR : "0",
                borderLeft: location.pathname === route.path ? "3px solid " + Definitions.SECONDARY_COLOR : "3px solid transparent",
                flex: 1,
                alignItems: "center",
                padding: Definitions.DEFAULT_PADDING,
                backgroundColor: focused ? Definitions.COMPONENT_BG_COLOR : "transparent",
                textDecoration: "none",
                outline: "none"
            }}
            tabIndex={ -1 }
            onMouseEnter={ () => setFocused(true) }
            onMouseLeave={ () => setFocused(false) }
        >
            <route.icon
                color={ Definitions.SECONDARY_TEXT_COLOR }
                size={ DEFAULT_SIZES.BIG_SIZE }
                style={{
                    marginRight: Definitions.DEFAULT_PADDING
                }}
            />
            <span
                style={{
                    color: Definitions.SECONDARY_TEXT_COLOR,
                    fontSize: DEFAULT_SIZES.NORMAL_SIZE
                }}
            >
                { route.name }
            </span>
        </Link>
    );
}