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
import * as TvApi from "api/Tv";
import * as GenreApi from "api/Genre";
import { makeCancelable } from "utils/Functions";
import Checkbox from "components/Checkbox";
import Button from "components/Button";
import TextButton from "components/TextButton";
import FileSelector from "components/FileSelector";
import ProgressBar from "components/ProgressBar";

export default ({ history, location }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const [state, setState] = React.useState({
        loading: true,
        genres: null,
        alert: null,
        editAlert: null,
        updating: false,
        tv: location.state?.tv || null,
        currentGenres: null,
        selectedGenres: null,

        filesChangedDate: null,
        filesChanged: {},
        newFiles: {},

        updatingFiles: false,
        updatingProgress: {},
        updateFilesFinished: false
    });

    React.useEffect(() => {
        if(state.loading && !state.genres) {
            const getDataPromise = makeCancelable(GenreApi.get(authContext));
            getDataPromise
                .promise
                .then(info => {
                    if(info) {
                        let newCurrentGenres = [];
                        if(state.tv) {
                            for(let index = 0; index < info.length; index++) {
                                const genre = info[index];
                                let found = false;

                                for(let j = 0; j < state.tv.genres.length; j++) {
                                    const tvGenre = state.tv.genres[j];
                                    if(tvGenre.id === genre.id) {
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
    }, [state.loading, state.genres, state.tv, authContext]);

    React.useEffect(() => {
        setState(state => {
            const { mediaInfo } = state.tv;
            let newFilesChanged = {};

            for(const key in mediaInfo) {
                if(mediaInfo.hasOwnProperty(key)) {
                    newFilesChanged[key] = false;
                }
            }

            return { ...state, filesChanged: newFilesChanged, filesChangedDate: Date.now() };
        });
    }, [state.tv]);

    React.useEffect(() => {
        if(state.updatingFiles && !state.updateFilesFinished) {
            (
                async () => {
                    const tvId = state.tv.id;
                    for(const key in state.filesChanged) {
                        if(state.filesChanged.hasOwnProperty(key)) {
                            const changed = state.filesChanged[key];
                            if(changed) {
                                const file = state.newFiles[key];
                                let extension = ".png";
                                if(key === "trailer" || key === "video") {
                                    extension = ".mp4";
                                }

                                if(file) {
                                    //subir 
                                    await TvApi.upload(authContext, tvId, file, key + extension, progressEvent => {
                                        const { loaded, total } = progressEvent;
        
                                        setState(state => {
                                            let newUpdatingProgress = { ...state.updatingProgress };
                                            newUpdatingProgress[key] = (loaded * 100) / total;
                                            return { ...state, updatingProgress: newUpdatingProgress };
                                        });
                                    });
                                }
                                else {
                                    //eliminar
                                    await TvApi.remove(authContext, tvId, key + extension);
                                    setState(state => {
                                        let newUpdatingProgress = { ...state.updatingProgress };
                                        newUpdatingProgress[key] = 100;
                                        return { ...state, updatingProgress: newUpdatingProgress };
                                    });
                                }
                            }
                        }
                    }
        
                    //fin get tv
                    const newTv = await TvApi.getTv(authContext, tvId);
                    setState(state => ({ ...state, tv: newTv, updateFilesFinished: true }));
                }
            )();
        }
    }, [state.updatingFiles, state.updateFilesFinished, state.filesChanged, state.newFiles, state.tv.id, authContext]);

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

        if(state.updatingFiles) {
            const renderProgressBars = () => {
                let items = [];
                for(const key in state.updatingProgress) {
                    if(state.updatingProgress.hasOwnProperty(key)) {
                        let title = "";
                        if(state.newFiles[key]) title = t("tv.uploading_new_item").toUpperCase() + " " + t("tv." + key).toUpperCase();
                        else title = t("tv.deleting_item").toUpperCase() + " " + t("tv." + key).toUpperCase();

                        items.push(
                            <div
                                key={ items.length }
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginBottom: Definitions.DEFAULT_MARGIN
                                }}
                            >
                                <span
                                    style={{
                                        color: Definitions.SECONDARY_TEXT_COLOR,
                                        fontSize: DEFAULT_SIZES.MEDIUM_SIZE,
                                        fontWeight: "bold",
                                        marginBottom: Definitions.DEFAULT_PADDING / 2
                                    }}
                                >
                                    { title } 
                                </span>
                                <ProgressBar
                                    value={ state.updatingProgress[key] || 0 }
                                />
                            </div>
                        );
                    }
                }

                return (
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column"
                        }}
                    >
                        { items }
                        {
                            state.updateFilesFinished &&
                            <Button
                                title={ t("tv.go_back_button").toUpperCase() }
                                type="submit"
                                style={{ marginTop: Definitions.DEFAULT_MARGIN }}
                                onClick={
                                    () => {
                                        setState({ ...state, newFiles: {}, updatingFiles: false, updatingProgress: {}, updateFilesFinished: false });
                                    }
                                }
                            />
                        }
                    </div>
                );
            };

            return (
                <div
                    style={{
                        margin: 100,
                        marginTop: Definitions.DEFAULT_MARGIN,
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <span
                        style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.TITLE_SIZE,
                            marginBottom: 30
                        }}
                    >
                        { state.updateFilesFinished ? t("tv.update_completed_title") : t("tv.updating_title") }
                    </span>
                    { renderProgressBars() }
                </div>
            );
        }

        const renderTvInfo = () => {
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

            const filesChanged = () => {
                for(const key in state.filesChanged) {
                    if(state.filesChanged.hasOwnProperty(key)) {
                        const changed = state.filesChanged[key];
                        if(changed) {
                            return true;
                        }
                    }
                }
                return false;
            };

            if(state.tv && state.tv.id > 0) {
                const tv = state.tv;
                
                const renderTvGenres = () => {
                    const handleUpdateGenresButton = async () => {
                        setState({ ...state, updating: true });
                        
                        let newTvGenres = [];
                        for(let index = 0; index < state.selectedGenres.length; index++) {
                            const selectedGenre = state.selectedGenres[index];
                            if(selectedGenre) {
                                newTvGenres.push(state.genres[index].id);
                            }
                        }
                        
                        const updatedTv = await TvApi.updateGenres(authContext, state.tv.id, newTvGenres);
                        setState({ ...state, tv: updatedTv, updating: false, currentGenres: state.selectedGenres.slice(0) });
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
                                    { t("tv.genres") }
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
                                            flexDirection: "row",
                                            marginTop: Definitions.DEFAULT_PADDING / 2
                                        }}
                                    >
                                        <Button
                                            title={ t("tv.undo_button").toUpperCase() }
                                            onClick={ () => { setState({ ...state, selectedGenres: state.currentGenres.slice(0) }) } }
                                            style={{ marginRight: Definitions.DEFAULT_PADDING / 2 }}
                                        />
                                        <Button
                                            title={ t("tv.update_button").toUpperCase() }
                                            onClick={ handleUpdateGenresButton }
                                        />
                                    </div>
                                }
                            </div>
                        );
                    }
                };

                const handleUpdateFilesButton = () => {
                    let newUpdatingProgress = [];
                    for(const key in state.filesChanged) {
                        if(state.filesChanged.hasOwnProperty(key)) {
                            const changed = state.filesChanged[key];
                            if(changed) {
                                newUpdatingProgress[key] = 0;
                            }
                        }
                    }
                    setState({ ...state, updatingFiles: true, updatingProgress: newUpdatingProgress });
                };

                return (
                    <fieldset
                        style={{
                            display: "flex",
                            flex: 1,
                            border: 0,
                            margin: 0,
                            padding: 0
                        }}
                        disabled={ (state.loading || state.updating || state.alert || state.editAlert) ? true : false }
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection:"row",
                                maxWidth: 1000
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flex: 1,
                                    flexDirection:"column"
                                }}
                            >
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    editable={ false }
                                    title={ t("tv.id") }
                                    value={ tv.id }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.name") }
                                    value={ tv.name || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "name", inputValue: tv.name || "",  inputProps: { type: "text", maxLength: 128 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.original_name") }
                                    value={ tv.original_name || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "original_name", inputValue: tv.original_name || "", inputProps: { type: "text", maxLength: 128 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.overview") }
                                    value={ tv.overview || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "overview", textArea: true, inputValue: tv.overview || "", inputProps: { type: "text", maxLength: 1024 } } }) }
                                />
                                { renderTvGenres() }
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.first_air_date") }
                                    value={ tv.first_air_date || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "first_air_date", inputValue: tv.first_air_date ? ( new Date(tv.first_air_date).toISOString().split("T")[0] ) : "", inputProps: { type: "date" } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.popularity") }
                                    value={ tv.popularity || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "popularity", inputValue: tv.popularity || "", inputProps: { type: "number", min: 0, step: "0.001" } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.vote_average") }
                                    value={ tv.vote_average || "" }
                                    onClick={ () => setState({ ...state, editAlert: { property: "vote_average", inputValue: tv.vote_average || "", inputProps: { type: "number", min: 0, max: 10, step: "0.001" } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.adult") }
                                    value={ tv.adult ? t("tv.yes") : t("tv.no") }
                                    onClick={ () => handleEditAlert("adult", "update", !tv.adult) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.published") }
                                    value={ tv.published ? t("tv.yes") : t("tv.no") }
                                    onClick={ () => handleEditAlert("published", "update", !tv.published) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.total_views") }
                                    value={ tv.total_views.toString() }
                                    onClick={ () => setState({ ...state, editAlert: { property: "total_views", inputValue: tv.total_views.toString() || "", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.views_last_month") }
                                    value={ tv.views_last_month.toString() }
                                    onClick={ () => setState({ ...state, editAlert: { property: "views_last_month", inputValue: tv.views_last_month.toString() || "", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.views_last_week") }
                                    value={ tv.views_last_week.toString() }
                                    onClick={ () => setState({ ...state, editAlert: { property: "views_last_week", inputValue: tv.views_last_week.toString() || "", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    title={ t("tv.views_today") }
                                    value={ tv.views_today.toString() }
                                    onClick={ () => setState({ ...state, editAlert: { property: "views_today", inputValue: tv.views_today.toString() || "", inputProps: { type: "number", min: 0 } } }) }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    editable={ false }
                                    title={ t("tv.created_at") }
                                    value={ tv.createdAt || "" }
                                />
                                <EditableText
                                    style={{ margin: Definitions.DEFAULT_MARGIN }}
                                    editable={ false }
                                    title={ t("tv.updated_at") }
                                    value={ tv.updatedAt || "" }
                                />
                                <TextButton
                                    title={ t("tv.delete_tv_button") }
                                    style={{ margin: Definitions.DEFAULT_MARGIN, marginBottom: 50 }}
                                    color="red"
                                    onClick={ () => setState({ ...state, alert: "delete" }) }
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flex: 1,
                                    flexDirection:"column"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        height: 150,
                                        marginBottom: Definitions.DEFAULT_MARGIN
                                    }}
                                >
                                    <FileSelector
                                        inputId="logo"
                                        title={ t("tv.logo") }
                                        inputProps={{ accept: "image/*" }}
                                        initial={{
                                            url: tv.mediaInfo.logo ? TvApi.getMediaFile(authContext, tv.id, "logo.png") : null,
                                            type: "image",
                                            date: state.filesChangedDate
                                        }}
                                        onChange={ file => setState({ ...state, newFiles: { ...state.newFiles, logo: file }, filesChanged: { ...state.filesChanged, logo: true } }) }
                                    />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        height: 150,
                                        marginBottom: Definitions.DEFAULT_MARGIN
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            width: 100,
                                            marginRight: Definitions.DEFAULT_PADDING
                                        }}
                                    >
                                        <FileSelector
                                            inputId="poster"
                                            title={ t("tv.poster") }
                                            inputProps={{ accept: "image/*" }}
                                            initial={{
                                                url: tv.mediaInfo.poster ? TvApi.getMediaFile(authContext, tv.id, "poster.png") : null,
                                                type: "image",
                                                date: state.filesChangedDate
                                            }}
                                            onChange={ file => setState({ ...state, newFiles: { ...state.newFiles, poster: file }, filesChanged: { ...state.filesChanged, poster: true } }) }
                                        />
                                    </div>
                                    <FileSelector
                                        inputId="backdrop"
                                        title={ t("tv.backdrop") }
                                        inputProps={{ accept: "image/*" }}
                                        initial={{
                                            url: tv.mediaInfo.backdrop ? TvApi.getMediaFile(authContext, tv.id, "backdrop.png") : null,
                                            type: "image",
                                            date: state.filesChangedDate
                                        }}
                                        onChange={ file => setState({ ...state, newFiles: { ...state.newFiles, backdrop: file }, filesChanged: { ...state.filesChanged, backdrop: true } }) }
                                    />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        height: 150,
                                        marginBottom: Definitions.DEFAULT_MARGIN
                                    }}
                                >
                                    <FileSelector
                                        inputId="trailer"
                                        title={ t("tv.trailer") }
                                        inputProps={{ accept: "video/*,.mkv" }}
                                        initial={{
                                            url: tv.mediaInfo.trailer ? TvApi.getMediaFile(authContext, tv.id, "trailer.mp4") : null,
                                            type: "video",
                                            date: state.filesChangedDate
                                        }}
                                        onChange={ file => setState({ ...state, newFiles: { ...state.newFiles, trailer: file }, filesChanged: { ...state.filesChanged, trailer: true } }) }
                                    />
                                </div>
                                {
                                    filesChanged() &&
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: Definitions.DEFAULT_PADDING / 2
                                        }}
                                    >
                                        <Button
                                            title={ t("tv.undo_button").toUpperCase() }
                                            onClick={ 
                                                () => {
                                                    let newFilesChanged = [];

                                                    for(const key in state.tv.mediaInfo) {
                                                        if(state.tv.mediaInfo.hasOwnProperty(key)) {
                                                            newFilesChanged[key] = false;
                                                        }
                                                    }
                                                    setState({ ...state, newFiles: {}, filesChanged: newFilesChanged, filesChangedDate: Date.now() });
                                                }
                                            }
                                            style={{ marginRight: Definitions.DEFAULT_PADDING / 2 }}
                                        />
                                        <Button
                                            title={ t("tv.update_button").toUpperCase() }
                                            onClick={ handleUpdateFilesButton }
                                        />
                                    </div>
                                }
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: Definitions.DEFAULT_PADDING / 2
                                    }}
                                >
                                    <Button
                                        title={ t("tv.episodes_button").toUpperCase() }
                                        onClick={ () => history.replace("/tv/episodes", { tv: state.tv }) }
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>
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
                        to="/tvs"
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
                        { t("tv.page_title") } 
                    </span>
                </div>
                { renderTvInfo() }
            </div>
        );
    };

    const handleEditAlert = async (property, buttonId, inputValue) => {
        if(buttonId === "update") {
            setState({ ...state, updating: true, editAlert: null });

            let newTv = {};
            newTv[property] = inputValue;
            
            const updatedTv = await TvApi.update(authContext, state.tv.id, newTv);
            setState({ ...state, tv: updatedTv, updating: false, editAlert: null });
        }
        else {
            setState({ ...state, editAlert: null });
        }
    };

    const renderAlert = () => {
        const handleDeleteAlert = async id => {
            if(id === "delete") {
                setState({ ...state, updating: true, alert: null });

                const result = await TvApi.destroy(authContext, state.tv.id);
                if(result) {
                    history.replace("/tvs");
                }
                else {
                    setState({ ...state, updating: false, alert: "unsuccessfulDelete" });
                }
            }
            else {
                setState({ ...state, alert: null });
            }
        };

        switch(state.alert) {
            case "delete": {
                return (
                    <Alert
                        title={ t("tv.delete_title") }
                        message={ t("tv.delete_tv_message") }
                        buttons={ [{ id: "close", title: t("tv.close_button") }, { id: "delete", title: t("tv.delete_button") }] }
                        onButtonClick={ handleDeleteAlert }
                    />
                );
            }
            case "unsuccessfulDelete": {
                return (
                    <Alert
                        title={ t("tv.error_title") }
                        message={ t("tv.unsuccessful_delete") }
                        buttons={ [{ title: t("tv.close_button") }] }
                        onButtonClick={ () => setState({ ...state, alert: null }) }
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
                        state.alert &&
                        renderAlert()
                    }
                    {
                        state.editAlert &&
                        <Alert
                            input
                            textArea={ state.editAlert.textArea || false }
                            inputValue={ state.editAlert.inputValue }
                            inputProps={ state.editAlert.inputProps }
                            title={ t("tv.edit_alert_title") }
                            message={ t("tv.edit_alert_" + state.editAlert.property + "_message") }
                            buttons={ [{ id: "close", title: t("tv.close_button") }, { id: "update", title: t("tv.update_button") }] }
                            onButtonClick={ (id, input) => handleEditAlert(state.editAlert.property, id, input) }
                        />
                    }
                </Modal>
            }
            { renderPage() }
        </div>
    );
};