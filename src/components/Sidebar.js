import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import TabButton from "components/TabButton";
import { MdAccountCircle } from "react-icons/md";
import { AuthContext } from "context/Auth";
import { useTranslation } from "react-i18next";

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

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
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
                    <a
                        href="/#"
                        style={{
                            textDecoration: "none",
                            outline: "none"
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
                    </a>
                </div>
            </div>
        </div>
    );
}