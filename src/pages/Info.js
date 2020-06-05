import React from "react";
import { AuthContext } from "context/Auth";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import * as Info from "api/Info";
import { useTranslation } from "react-i18next";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import CircleProgressBar from "components/CircleProgressBar";
import { makeCancelable } from "utils/Functions";

export default () => {
    const authContext = React.useContext(AuthContext);
    const [data, setData] = React.useState(null);
    const { t } = useTranslation();

    React.useEffect(() => {
        if(!data) {
            const getDataPromise = makeCancelable(Info.get(authContext));
            getDataPromise
                .promise
                .then(info => {
                    if(info) {
                        setData(info);
                    }
                })
                .catch(error => { console.log(error) });
            return () => getDataPromise.cancel();
        }
    }, [data, authContext]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                position: "relative"
            }}
        >
            {
                !data &&
                <Modal
                    relative
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <Spinner/>
                </Modal>
            }
            <div
                style={{
                    margin: Definitions.DEFAULT_MARGIN,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.TITLE_SIZE,
                        marginBottom: Definitions.DEFAULT_PADDING
                    }}
                >
                    { t("info.system") } 
                </span>

                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        userSelect: "text"
                    }}
                >
                    <span
                        style={{
                            color: Definitions.DARK_TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                        }}
                    >
                        { t("info.platform", { platform: data?.system.platform }) } 
                    </span>
                    <span
                        style={{
                            color: Definitions.DARK_TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                        }}
                    >
                        { t("info.server_version", { version: data?.server.version }) } 
                    </span>
                    <span
                        style={{
                            color: Definitions.DARK_TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                        }}
                    >
                        { t("info.address", { address: authContext?.state.server }) } 
                    </span>
                    <span
                        style={{
                            color: Definitions.DARK_TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                        }}
                    >
                        { t("info.media_path", { path: data?.system.media_path }) } 
                    </span>
                </div>
                
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "row",
                        marginTop: Definitions.DEFAULT_MARGIN
                    }}
                >
                    
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "center"
                        }}
                    >
                        <CircleProgressBar
                            size={ 150 }
                            strokeWidth={ 6 }
                            percentage={ data?.system.cpu.usedPercentage }
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    height: "100%",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <span
                                    style={{
                                        color: Definitions.TEXT_COLOR,
                                        fontSize: DEFAULT_SIZES.TITLE_SIZE,
                                    }}
                                >
                                    { data ? data?.system.cpu.usedPercentage.toFixed(2) + "%" : "0%" }
                                </span>
                                <span
                                    style={{
                                        color: Definitions.TEXT_COLOR,
                                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                                    }}
                                >
                                    { t("info.cpu").toUpperCase() }
                                </span>
                            </div>
                        </CircleProgressBar>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <CircleProgressBar
                            size={ 150 }
                            strokeWidth={ 6 }
                            percentage={ data?.system.memory.usedPercentage }
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    height: "100%",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <span
                                    style={{
                                        color: Definitions.TEXT_COLOR,
                                        fontSize: DEFAULT_SIZES.TITLE_SIZE,
                                    }}
                                >
                                    { data ? data?.system.memory.usedPercentage.toFixed(2) + "%" : "0%" }
                                </span>
                                <span
                                    style={{
                                        color: Definitions.TEXT_COLOR,
                                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                                    }}
                                >
                                    { t("info.memory").toUpperCase() }
                                </span>
                            </div>
                        </CircleProgressBar>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "center"
                        }}
                    >
                        <CircleProgressBar
                            size={ 150 }
                            strokeWidth={ 6 }
                            percentage={ data?.system.disk.usedPercentage }
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    height: "100%",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <span
                                    style={{
                                        color: Definitions.TEXT_COLOR,
                                        fontSize: DEFAULT_SIZES.TITLE_SIZE,
                                    }}
                                >
                                    { data ? data?.system.disk.usedPercentage.toFixed(2) + "%" : "0%" }
                                </span>
                                <span
                                    style={{
                                        color: Definitions.TEXT_COLOR,
                                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                                    }}
                                >
                                    { t("info.disk").toUpperCase() }
                                </span>
                            </div>
                        </CircleProgressBar>
                    </div>
                    
                </div>

            </div>

            <div
                style={{
                    margin: Definitions.DEFAULT_MARGIN,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.TITLE_SIZE,
                        marginBottom: Definitions.DEFAULT_PADDING
                    }}
                >
                    { t("info.stats") } 
                </span>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap"
                    }}
                >
                    {
                        data && Object.keys(data.stats).map(stat => {
                            return (
                                <div
                                    key={ stat }
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: Definitions.DEFAULT_PADDING
                                    }}
                                >
                                    <span
                                        style={{
                                            color: Definitions.TEXT_COLOR,
                                            fontSize: DEFAULT_SIZES.TITLE_SIZE
                                        }}
                                    >
                                        { data.stats[stat] } 
                                    </span>
                                    <span
                                        style={{
                                            color: Definitions.TEXT_COLOR,
                                            fontSize: DEFAULT_SIZES.NORMAL_SIZE
                                        }}
                                    >
                                        { t("info." + stat).toUpperCase() } 
                                    </span>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}