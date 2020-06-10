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
import * as GenreApi from "api/Genre";
import { makeCancelable } from "utils/Functions";
import Checkbox from "components/Checkbox";
import Button from "components/Button";

export default ({ history, location }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const [state, setState] = React.useState({
        loading: true,
        genres: null,
        alert: null,
        editAlert: null,
        updating: false,
        movie: location.state?.movie || null,
        currentGenres: null,
        selectedGenres: null
    });

    React.useEffect(() => {
        if(state.loading && !state.genres) {
            const getDataPromise = makeCancelable(GenreApi.get(authContext));
            getDataPromise
                .promise
                .then(info => {
                    if(info) {
                        let newCurrentGenres = [];
                        if(state.movie) {
                            for(let index = 0; index < info.length; index++) {
                                const genre = info[index];
                                let found = false;

                                for(let j = 0; j < state.movie.genres.length; j++) {
                                    const movieGenre = state.movie.genres[j];
                                    if(movieGenre.id === genre.id) {
                                        found = true;
                                        break;
                                    }
                                }

                                newCurrentGenres.push(found);
                            }
                        }
                        
                        setState(state => ({ ...state, loading: false, genres: info, currentGenres: newCurrentGenres, selectedGenres: newCurrentGenres.slice(0) }));
                    }
                    else {
                        setState(state => ({ ...state, loading: false, genres: {} }));
                    }
                })
                .catch(error => { console.log(error) });
            return () => getDataPromise.cancel();
        }
    }, [state.loading, state.genres, state.movie, authContext]);

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
            const genresChanged = () => {
                if(state.currentGenres && state.selectedGenres && state.currentGenres.length > 0 && state.selectedGenres.length > 0 && state.currentGenres.length === state.selectedGenres.length) {
                    for(let i = 0; i < state.currentGenres.length; i++) {
                        if(state.currentGenres[i] !== state.selectedGenres[i]) {
                            return true;
                        }
                    }
                }
                return false;
            };

            if(state.movie && state.movie.id > 0) {
                const movie = state.movie;
                
                const renderMovieGenres = () => {
                    const handleUpdateGenresButton = async () => {
                        setState({ ...state, updating: true });
                        
                        let newMovieGenres = [];
                        for(let index = 0; index < state.selectedGenres.length; index++) {
                            const selectedGenre = state.selectedGenres[index];
                            if(selectedGenre) {
                                newMovieGenres.push(state.genres[index].id);
                            }
                        }
                        
                        const updatedMovie = await MovieApi.updateGenres(authContext, state.movie.id, newMovieGenres);
                        setState({ ...state, movie: updatedMovie, updating: false, currentGenres: state.selectedGenres.slice(0) });
                    };

                    if(state.genres && state.genres.length > 0) {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    margin: Definitions.DEFAULT_MARGIN
                                }}
                            >
                                <span
                                    style={{
                                        color: Definitions.TEXT_COLOR,
                                        fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                                        fontWeight: "bold",
                                        marginBottom: Definitions.DEFAULT_PADDING / 2
                                    }}
                                >
                                    { t("movie.genres") }
                                </span>
                                <div
                                    style={{
                                        maxWidth: 500,
                                        maxHeight: 200,
                                        overflowX: "hidden",
                                        overflowY: "auto"
                                    }}
                                >
                                    {
                                        state.genres.map((genre, index) => {
                                            return (
                                                <Checkbox
                                                    key={ index }
                                                    title={ genre.name.toUpperCase() }
                                                    style={{ margin: 0, marginBottom: Definitions.DEFAULT_PADDING / 2 }}
                                                    checked={ state.selectedGenres[index] || false }
                                                    onChange={
                                                        event => {
                                                            let newSelectedGenres = state.selectedGenres;
                                                            newSelectedGenres[index] = event.target.checked;
                                                            setState({ ...state, selectedGenres: newSelectedGenres })
                                                        }
                                                    }
                                                />
                                            );
                                        })
                                    }
                                </div>
                                {
                                    genresChanged() &&
                                    <div
                                        style={{
                                            display: "flex",
                                            flex: 1,
                                            marginTop: Definitions.DEFAULT_PADDING / 2
                                        }}
                                    >
                                        <Button
                                            title={ t("movie.update_button").toUpperCase() }
                                            style={{ flexDirection: "column", width: "100%" }}
                                            onClick={ handleUpdateGenresButton }
                                        />
                                    </div>
                                }
                            </div>
                        );
                    }
                }

                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection:"row"
                        }}
                    >
                        <fieldset
                            style={{
                                display: "flex",
                                flex: 1,
                                border: 0,
                                margin: 0,
                                padding: 0
                            }}
                            disabled={ (state.loading || state.updating || state.alert, state.editAlert) ? true : false }
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
                                { renderMovieGenres() }
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.tagline") }
                                    value={ movie.tagline || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "tagline", inputProps: { type: "text", maxLength: 128 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.release_date") }
                                    value={ movie.release_date || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "release_date", inputProps: { type: "date" } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.runtime") }
                                    value={ movie.runtime || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "runtime", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.popularity") }
                                    value={ movie.popularity || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "popularity", inputProps: { type: "number", min: 0, step: "0.001" } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.vote_average") }
                                    value={ movie.vote_average || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "vote_average", inputProps: { type: "number", min: 0, max: 10, step: "0.001" } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.adult") }
                                    value={ movie.adult ? t("movie.yes") : t("movie.no") }
                                    onClick={ () => handleEditAlert("adult", "update", !movie.adult) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.published") }
                                    value={ movie.published ? t("movie.yes") : t("movie.no") }
                                    onClick={ () => handleEditAlert("published", "update", !movie.published) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.total_views") }
                                    value={ movie.total_views.toString() }
                                    onClick={ () => setState({ ...state, editAlert: { property: "total_views", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.views_last_month") }
                                    value={ movie.views_last_month.toString() }
                                    onClick={ () => setState({ ...state, editAlert: { property: "views_last_month", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.views_last_week") }
                                    value={ movie.views_last_week.toString() }
                                    onClick={ () => setState({ ...state, editAlert: { property: "views_last_week", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("movie.views_today") }
                                    value={ movie.views_today.toString() }
                                    onClick={ () => setState({ ...state, editAlert: { property: "views_today", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    editable={ false }
                                    title={ t("movie.created_at") }
                                    value={ movie.createdAt || "" }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    editable={ false }
                                    title={ t("movie.updated_at") }
                                    value={ movie.updatedAt || "" }
                                />
                            </div>
                        </fieldset>
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
                zIndex: 1,
                height: "100vh",
                overflow: (state.alert || state.editAlert) ? "hidden" : "auto"
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