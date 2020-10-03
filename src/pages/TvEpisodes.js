import React from "react";
import { AuthContext } from "context/Auth";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import Table from "components/Table";
import { useTranslation } from "react-i18next";
import { BsPlus } from "react-icons/bs";
import { MdArrowBack } from "react-icons/md";
import TextButton from "components/TextButton";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Alert from "components/Alert";
import * as TvApi from "api/Tv";

export default ({ history, location }) => {
    const authContext = React.useContext(AuthContext);
    const [state, setState] = React.useState({
        data: location.state?.tv || null,
        alert: null,
        loading: false,
        deleteEpisode: null
    });
    const { t } = useTranslation();

    const renderAlert = () => {
        const handleDeleteAlert = async id => {
            if(id === "delete") {
                setState({ ...state, loading: true, alert: null });

                const episodeIndex = state.deleteEpisode;
                const episode = state.data.episode_tvs[episodeIndex];

                const result = await TvApi.destroyEpisode(authContext, state.data.id, episode.season, episode.episode);
                if(result) {
                    state.data.episode_tvs.splice(episodeIndex, 1);
                }
                setState({ ...state, loading: false, alert: null });
            }
            else {
                setState({ ...state, alert: null });
            }
        };

        switch(state.alert) {
            case "delete": {
                return (
                    <Alert
                        title={ t("tv_episodes.delete_title") }
                        message={ t("tv_episodes.delete_episode_message") }
                        buttons={ [{ id: "close", title: t("tv_episodes.close_button") }, { id: "delete", title: t("tv_episodes.delete_button") }] }
                        onButtonClick={ handleDeleteAlert }
                    />
                );
            }
            default: {
                return <div/>;
            }
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                marginLeft: -Definitions.SIDEBAR_WIDTH,
                backgroundColor: Definitions.PRIMARY_COLOR,
                zIndex: 1,
                height: "100vh"
            }}
        >
            {
                (state.loading || state.alert) &&
                <Modal
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex"
                    }}
                >
                    { state.loading && <Spinner/> }
                    {
                        state.alert &&
                        renderAlert()
                    }
                </Modal>
            }
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    position: "relative"
                }}
            >
                <div
                    style={{
                        margin: Definitions.DEFAULT_MARGIN,
                        display: "flex",
                        flex: 1,
                        flexDirection: "column"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: Definitions.DEFAULT_PADDING
                        }}
                    >
                        <div
                            style={{
                                cursor: "pointer",
                                marginRight: Definitions.DEFAULT_PADDING
                            }}
                            onClick={ () => history.replace("/tv", { tv: state.data }) }
                        >
                            <MdArrowBack
                                size={ DEFAULT_SIZES.TITLE_SIZE }
                                color={ Definitions.TEXT_COLOR }
                            />
                        </div>
                        <span
                            style={{
                                color: Definitions.TEXT_COLOR,
                                fontSize: DEFAULT_SIZES.TITLE_SIZE,
                                marginBottom: Definitions.DEFAULT_PADDING
                            }}
                        >
                            { t("tv_episodes.title", { name: state.data?.name || "" }) }
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: Definitions.DEFAULT_PADDING
                        }}
                    >
                        <span
                            style={{
                                flex: 1,
                                color: Definitions.TEXT_COLOR,
                                fontSize: DEFAULT_SIZES.NORMAL_SIZE
                            }}
                        >
                            { t("tv_episodes.total", { total: state.data?.episode_tvs.length || 0 }) }
                        </span>
                        <div
                            style={{
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                textDecoration: "none",
                                outline: "none"
                            }}
                            tabIndex={ -1 }
                            onClick={ () => history.replace("/tv/episodes/add", { tv: state.data }) }
                        >
                            <BsPlus
                                color={ Definitions.SECONDARY_TEXT_COLOR }
                                size={ DEFAULT_SIZES.BIG_SUBTITLE_SIZE }
                                style={{
                                    marginRight: Definitions.DEFAULT_PADDING
                                }}
                            />
                            <span
                                style={{
                                    color: Definitions.TEXT_COLOR,
                                    fontSize: DEFAULT_SIZES.NORMAL_SIZE
                                }}
                            >
                                { t("tv_episodes.add_button") }
                            </span>
                        </div>
                    </div>
                    <Table
                        data={ state.data.episode_tvs }                   
                        headers={[
                            {
                                id: "season",
                                name: t("tv_episodes.season_header"),
                                orderable: true,
                                filterable: true
                            },
                            {
                                id: "episode",
                                name: t("tv_episodes.episode_header"),
                                orderable: true,
                                filterable: true
                            },
                            {
                                id: "name",
                                name: t("tv_episodes.name_header"),
                                orderable: true,
                                filterable: true
                            },
                            {
                                id: "remove",
                                name: t("tv_episodes.remove_header")
                            }
                        ]}
                        onRenderCell={
                            (headerId, index) => {
                                if(headerId === "remove") {
                                    return (
                                        <TextButton
                                            title={ t("tv_episodes.remove_header") }
                                            color="red"
                                            onClick={ () => setState({ ...state, alert: "delete", deleteEpisode: index })}
                                        />
                                    );
                                }
                                else {
                                    return (
                                        <span
                                            style={{
                                                color: Definitions.DARK_TEXT_COLOR,
                                                fontSize: DEFAULT_SIZES.NORMAL_SIZE
                                            }}
                                        >
                                            { state.data.episode_tvs[index][headerId] }
                                        </span>
                                    );
                                }
                            }
                        }
                    />
                </div>
            </div>
        </div>
    );
}