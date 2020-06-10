import React from "react";
import { AuthContext } from "context/Auth";
import { useTranslation } from "react-i18next";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import EditableText from "components/EditableText";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Alert from "components/Alert";
import * as MovieApi from "api/Movie";

export default ({ history, location }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const [state, setState] = React.useState({
        loading: false,
        alert: null,
        editAlert: null,
        updating: false,
        movie: location.state?.movie || null
    });

    const renderPage = () => {
        if(state.loading) {
            return (
                <Modal
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex"
                    }}
                >
                    <Spinner/>
                </Modal>
            );
        }

        const renderMovieInfo = () => {
            if(state.movie && state.movie.id > 0) {
                const movie = state.movie;

                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection:"row"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection:"column"
                            }}
                        >
                            <EditableText
                                style={{ margin: Definitions.DEFAULT_MARGIN }}
                                editable={ false }
                                title={ t("movie.id") }
                                value={ movie.id }
                            />
                            <EditableText
                                style={{ margin: Definitions.DEFAULT_MARGIN }}
                                title={ t("movie.title") }
                                value={ movie.title || "" }
                                onClick={ () => setState({ ...state, editAlert: { property: "title", inputProps: { type: "text", maxLength: 128 } } }) }
                            />
                            <EditableText
                                style={{ margin: Definitions.DEFAULT_MARGIN }}
                                title={ t("movie.original_title") }
                                value={ movie.original_title || "" }
                                onClick={ () => setState({ ...state, editAlert: { property: "original_title", inputProps: { type: "text", maxLength: 128 } } }) }
                            />
                            <EditableText
                                style={{ margin: Definitions.DEFAULT_MARGIN }}
                                title={ t("movie.overview") }
                                value={ movie.overview || "" }
                                onClick={ () => setState({ ...state, editAlert: { property: "overview", inputProps: { type: "text", maxLength: 1024 } } }) }
                            />
                        </div>
                    </div>
                );
            }
        };

        return (
            <div
                style={{
                    margin: Definitions.DEFAULT_MARGIN,
                    display: "flex",
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
                    <Link
                        to="/movies"
                        style={{
                            outline: "none",
                            textDecoration: "none",
                            marginRight: Definitions.DEFAULT_PADDING
                        }}
                        tabIndex={ -1 }
                    >
                        <MdArrowBack
                            size={ DEFAULT_SIZES.TITLE_SIZE }
                            color={ Definitions.TEXT_COLOR }
                        />
                    </Link>
                    <span
                        style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.TITLE_SIZE,
                            marginBottom: Definitions.DEFAULT_PADDING
                        }}
                    >
                        { t("movie.page_title") } 
                    </span>
                </div>
                { renderMovieInfo() }
            </div>
        );
    };

    const handleEditAlert = async (property, buttonId, inputValue) => {
        if(buttonId === "update") {
            setState({ ...state, updating: true, editAlert: null });

            let newMovie = {};
            newMovie[property] = inputValue;
            
            const updatedMovie = await MovieApi.update(authContext, state.movie.id, newMovie);
            setState({ ...state, movie: updatedMovie, updating: false, editAlert: null });
        }
        else {
            setState({ ...state, editAlert: null });
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                marginLeft: -Definitions.SIDEBAR_WIDTH,
                backgroundColor: Definitions.PRIMARY_COLOR,
                zIndex: 1
            }}
        >
            {
                (state.updating || state.alert || state.editAlert) &&
                <Modal
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex"
                    }}
                >
                    { state.updating && <Spinner/> }

                    {
                        state.editAlert &&
                        <Alert
                            input
                            inputProps={ state.editAlert.inputProps }
                            title={ t("movie.edit_alert_title") }
                            message={ t("movie.edit_alert_" + state.editAlert.property + "_message") }
                            buttons={ [{ id: "close", title: t("movie.close_button") }, { id: "update", title: t("movie.update_button") }] }
                            onButtonClick={ (id, input) => handleEditAlert(state.editAlert.property, id, input) }
                        />
                    }
                </Modal>
            }
            { renderPage() }
        </div>
    );
};