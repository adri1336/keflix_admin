import React from "react";
import { AuthContext } from "context/Auth";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Table from "components/Table";
import * as GenreApi from "api/Genre";
import * as TMDbApi from "api/TMDb";
import { useTranslation } from "react-i18next";
import { BsPlus } from "react-icons/bs";
import { MdSync } from "react-icons/md";
import { makeCancelable } from "utils/Functions";
import { Link } from "react-router-dom";

export default ({ history }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const [state, setState] = React.useState({ data: null, syncing: false });
    React.useEffect(() => {
        if(state.syncing) {
            const getGenresPromise = makeCancelable(TMDbApi.genres(authContext.state.tmdb));
            getGenresPromise
                .promise
                .then(async genres => {
                    if(genres) {
                        for (let index = 0; index < genres.length; index++) {
                            const genre = genres[index];
                            await GenreApi.create(authContext, { name: genre.name });
                        }
                        setState({ data: null });
                    }
                    else {
                        setState({ ...state, syncing: false });
                    }
                })
                .catch(error => { console.log(error) });
            return () => getGenresPromise.cancel();
        }
        else if(!state.data) {
            const getDataPromise = makeCancelable(GenreApi.get(authContext));
            getDataPromise
                .promise
                .then(info => {
                    if(info) {
                        setState({ data: info });
                    }
                    else {
                        setState({ data: {} });
                    }
                })
                .catch(error => { console.log(error) });
            return () => getDataPromise.cancel();
        }
    }, [state, authContext]);

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
                (!state.data || state.syncing) &&
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
                    flex: 1,
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
                    { t("genres.title") } 
                </span>
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
                        { t("genres.total", { total: state.data?.length }) }
                    </span>
                    <div
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            marginRight: Definitions.DEFAULT_PADDING
                        }}
                        onClick={ () => setState({ ...state, syncing: true }) }
                    >
                        <MdSync
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
                            { t("genres.tmdb_sync_button") }
                        </span>
                    </div>
                    <Link
                        to={{
                            pathname: "/genre"
                        }}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            textDecoration: "none",
                            outline: "none"
                        }}
                        tabIndex={ -1 }
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
                            { t("genres.add_button") }
                        </span>
                    </Link>
                </div>
                {
                   state.data &&
                   <Table
                        data={ state.data }
                        headers={[
                            {
                                id: "id",
                                name: t("genres.id_header"),
                                orderable: true,
                                filterable: true
                            },
                            {
                                id: "name",
                                name: t("genres.name_header"),
                                orderable: true,
                                filterable: true
                            }
                        ]}
                        onRenderCell={
                            (headerId, index) => {
                                return (
                                    <span
                                        style={{
                                            color: Definitions.DARK_TEXT_COLOR,
                                            fontSize: DEFAULT_SIZES.NORMAL_SIZE
                                        }}
                                    >
                                        { state.data[index][headerId] }
                                    </span>
                                );
                            }
                        }
                        onRowClick={
                            index => {
                                history.replace("/genre", { genre: state.data[index] });
                            }
                        }
                    />
                }
            </div>
        </div>
    );
}