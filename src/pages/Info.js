import React from "react";
import { AuthContext } from "context/Auth";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import * as Info from "api/Info";
import { useTranslation } from "react-i18next";
import Spinner from "components/Spinner";
import Modal from "components/Modal";

export default () => {
    const authContext = React.useContext(AuthContext);
    const [data, setData] = React.useState(null);
    const { t } = useTranslation();

    React.useEffect(() => {
        if(!data) {
            (
                async () => {
                    const info = await Info.get(authContext);
                    if(info) {
                        console.log(info);
                        setData(info);
                    }
                }
            )(); 
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
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    }}
                >
                    { t("info.platform", { platform: data?.system.platform }) } 
                </span>
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    }}
                >
                    { t("info.server_version", { version: data?.server.version }) } 
                </span>
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    }}
                >
                    { t("info.address", { address: authContext?.state.server }) } 
                </span>
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    }}
                >
                    { t("info.media_path", { path: data?.system.media_path }) } 
                </span>
                
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "row",
                        marginTop: Definitions.DEFAULT_PADDING
                    }}
                >
                    

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
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    }}
                >
                    { t("info.accounts", { accounts: data?.stats.accounts }) }
                </span>
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    }}
                >
                    { t("info.profiles", { profiles: data?.stats.profiles }) }
                </span>
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    }}
                >
                    { t("info.genres", { genres: data?.stats.genres }) }
                </span>
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    }}
                >
                    { t("info.movies", { movies: data?.stats.movies }) }
                </span>
            </div>
        </div>
    );
}