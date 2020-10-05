import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "context/Auth";
import TextButton from "components/TextButton";
import Input from "components/Input";
import Button from "components/Button";
import FileSelector from "components/FileSelector";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import { downloadFile, getVideoDurationInSeconds } from "utils/Functions";
import * as TvApi from "api/Tv";
import ProgressBar from "components/ProgressBar";
import * as TMDbApi from "api/TMDb";

export default ({ location }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const
        [state, setState] = React.useState({
            tv: location.state?.tv || null,
            loading: false,
            formValues: {
                season: null,
                episode: null,
                name: null,
                overview: null,
                runtime: null,
                files: {
                    backdrop: null,
                    video: null
                }
            },

            syncing: false,
            
            uploading: false,
            uploadFiles: {},
            uploadProgress: {},
            uploadError: false,
            uploadFinished: false
        });

    React.useEffect(() => {
        if(state.syncing) {
            (
                async () => {
                    const tv = state.tv;
                    const tmdbTv = await TMDbApi.searchTvs(authContext.state.tmdb, tv.original_name + "&first_air_date_year=" + tv.first_air_date.substr(0, 4));
                    
                    if(tmdbTv.length > 0) {
                        const tmdbId = tmdbTv[0].id;
                        const season = state.formValues.season, episode = state.formValues.episode;
                        const tmdbEpisodeInfo = await TMDbApi.tvEpisodeInfo(authContext.state.tmdb, tmdbId, season, episode);

                        if(tmdbEpisodeInfo.still_path) {
                            const url = "https://image.tmdb.org/t/p/original" + tmdbEpisodeInfo.still_path;
                            const path = await downloadFile(url, "backdrop.png");
                            
                            if(path) {
                                const
                                    response = await fetch("file:///" + path),
                                    blob = await response.clone().blob(),
                                    arrayBuffer = await response.clone().arrayBuffer();

                                const file = new File([arrayBuffer], "backdrop.png", blob);
                                if(file) {
                                    setState(state => ({ ...state, loading: false, syncing: false, formValues: { ...state.formValues, name: tmdbEpisodeInfo.name, overview: tmdbEpisodeInfo.overview, files: { ...state.formValues.files, backdrop: file } } }));
                                }
                                else {
                                    setState(state => ({ ...state, loading: false, syncing: false, formValues: { ...state.formValues, name: tmdbEpisodeInfo.name, overview: tmdbEpisodeInfo.overview, files: { ...state.formValues.files, backdrop: null } } }));
                                }
                            }
                            else {
                                setState(state => ({ ...state, loading: false, syncing: false, formValues: { ...state.formValues, name: tmdbEpisodeInfo.name, overview: tmdbEpisodeInfo.overview, files: { ...state.formValues.files, backdrop: null } } }));
                            }
                        }
                        else {
                            setState(state => ({ ...state, loading: false, syncing: false, formValues: { ...state.formValues, name: tmdbEpisodeInfo.name, overview: tmdbEpisodeInfo.overview, files: { ...state.formValues.files, backdrop: null } } }));
                        }
                    }
                    else {
                        setState(state => ({ ...state, loading: false, syncing: false }));
                    }
                }
            )();   
        }
    }, [authContext, state.syncing, state.tv, state.formValues]);

    React.useEffect(() => {
        if(state.uploading) {
            const
                tv = state.tv,
                season = state.formValues.season,
                episodeNumber = state.formValues.episode;

            (
                async () => {
                    const episode = await TvApi.createEpisode(authContext, tv.id, season, episodeNumber, { name: state.formValues.name, overview: state.formValues.overview });
                    if(episode) {
                        setState(state => ({ ...state, uploadProgress: { ...state.uploadProgress, createEpisode: 100 } }));

                        for(const key in state.uploadFiles) {
                            if(state.uploadFiles.hasOwnProperty(key)) {
                                const file = state.uploadFiles[key];
                                if(file) {
                                    let extension = ".png";
                                    if(file.type.includes("video")) {
                                        extension = ".mp4";
                                    }

                                    await TvApi.uploadEpisode(authContext, tv.id, season, episodeNumber, file, key + extension, progressEvent => {
                                        const { loaded, total } = progressEvent;

                                        setState(state => {
                                            let newUploadProgress = { ...state.uploadProgress };
                                            newUploadProgress[key] = (loaded * 100) / total;
                                            return { ...state, uploadProgress: newUploadProgress };
                                        });
                                    });
                                }
                            }
                        }
                        
                        setState(state => ({ ...state, uploadFinished: true }));
                    }
                    else {
                        setState(state => ({ ...state, uploading: false, uploadProgress: {}, uploadError: true }));
                    }
                }
            )();
        }
    }, [state.tv, state.uploading, state.uploadFiles, state.formValues, state.genres, authContext]);

    const renderPage = () => {
        if(state.loading) {
            return (
                <Modal
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <Spinner/>
                </Modal>
            );
        }

        if(state.uploadError) {
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
                            marginBottom: Definitions.DEFAULT_MARGIN
                        }}
                    >
                        { t("add_tv_episode.upload_error_message") } 
                    </span>
                    <Link
                        to="/tvs"
                        style={{
                            outline: "none",
                            textDecoration: "none"
                        }}
                        tabIndex={ -1 }
                    >
                        <Button
                            title={ t("add_tv_episode.go_back_button").toUpperCase() }
                            type="submit"
                        />
                    </Link>
                </div>
            );
        }
        else if(state.uploading) {
            return renderUploading();
        }
        else {
            return renderForm();
        }
    };

    const renderUploading = () => {
        const renderUploadProgressBars = () => {
            let items = [];
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
                        { t("add_tv_episode.uploading_create_tv").toUpperCase() } 
                    </span>
                    <ProgressBar
                        value={ state.uploadProgress.createEpisode || 0 }
                    />
                </div>
            );

            for(const key in state.uploadFiles) {
                if(state.uploadFiles.hasOwnProperty(key)) {
                    const file = state.uploadFiles[key];
                    if(file) {
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
                                    { t("add_tv_episode." + key).toUpperCase() } 
                                </span>
                                <ProgressBar
                                    value={ state.uploadProgress[key] || 0 }
                                />
                            </div>
                        );
                    }
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
                        state.uploadFinished &&
                        <Link
                            to="/tvs"
                            style={{
                                outline: "none",
                                textDecoration: "none"
                            }}
                            tabIndex={ -1 }
                        >
                            <Button
                                title={ t("add_tv_episode.go_back_button").toUpperCase() }
                                type="submit"
                                style={{ marginTop: Definitions.DEFAULT_MARGIN }}
                            />
                        </Link>
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
                    { state.uploadFinished ? t("add_tv_episode.upload_complete_title") : t("add_tv_episode.uploading_title") }
                </span>
                { renderUploadProgressBars() }
            </div>
        );
    };

    const renderForm = () => {
        const handleSubmit = event => {
            event.preventDefault();
            let newUploadFiles = {};
            if(state.formValues.files.backdrop) newUploadFiles.backdrop = state.formValues.files.backdrop;
            if(state.formValues.files.video) newUploadFiles.video = state.formValues.files.video;

            setState({ ...state, uploading: true, uploadProgress: { createEpisode: 0 }, uploadFiles: newUploadFiles });
        };

        return (
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    height: "100vh",
                    overflow: state.alert ? "hidden" : "auto"
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
                            alignItems: "center"
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
                                fontSize: DEFAULT_SIZES.TITLE_SIZE
                            }}
                        >
                            { t("add_tv_episode.page_title", { name: state.tv?.name || "" }) }
                        </span>
                    </div>
                    <div
                        style={{
                            margin: Definitions.DEFAULT_MARGIN,
                            marginTop: Definitions.DEFAULT_PADDING
                        }}
                    >
                        <form
                            onSubmit={ handleSubmit }
                        >
                            <fieldset
                                style={{
                                    display: "flex",
                                    flex: 1,
                                    border: 0,
                                    margin: 0,
                                    padding: 0
                                }}
                                disabled={ state.alert ? true : false }
                            >
                                <div
                                    role="group"
                                    style={{
                                        display: "flex",
                                        flex: 1,
                                        flexDirection: "row",
                                        border: 0,
                                        maxWidth: 1000
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flex: 1,
                                            flexDirection: "column"
                                        }}
                                    >
                                        <Input
                                            title={ t("add_tv_episode.season").toUpperCase() }
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={ state.formValues.season || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, season: event.target.value } }) }
                                        />
                                        <Input
                                            title={ t("add_tv_episode.episode").toUpperCase() }
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={ state.formValues.episode || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, episode: event.target.value } }) }
                                        />
                                        <TextButton
                                            title={ t("add_tv_episode.tmdb_sync_button") }
                                            style={{
                                                marginLeft: Definitions.DEFAULT_MARGIN,
                                                marginRight: Definitions.DEFAULT_MARGIN,
                                                marginBottom: Definitions.DEFAULT_MARGIN
                                            }}
                                            onClick={
                                                () => {
                                                    if(state.formValues.season && state.formValues.episode) {
                                                        setState({ ...state, loading: true, syncing: true });
                                                    }
                                                }
                                            }
                                        />
                                        <Input
                                            required
                                            title={ t("add_tv_episode.name").toUpperCase() }
                                            type="text"
                                            inputProps={{ maxLength: 128 }}
                                            value={ state.formValues?.name || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, name: event.target.value } }) }
                                        />
                                        <Input
                                            textArea
                                            title={ t("add_tv_episode.overview").toUpperCase() }
                                            inputProps={{ maxLength: 1024 }}
                                            value={ state.formValues.overview || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, overview: event.target.value } }) }
                                        />
                                        <Input
                                            title={ t("add_tv_episode.runtime").toUpperCase() }
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={ state.formValues.runtime || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, runtime: event.target.value } }) }
                                        />
                                        <Button
                                            title={ t("add_tv_episode.add_button").toUpperCase() }
                                            type="submit"
                                            style={{ flexDirection: "column", margin: Definitions.DEFAULT_MARGIN }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flex: 1,
                                            flexDirection: "column",
                                            marginTop: Definitions.DEFAULT_MARGIN
                                        }}
                                    >
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
                                                    flex: 1,
                                                    marginRight: Definitions.DEFAULT_PADDING
                                                }}
                                            >
                                                <FileSelector
                                                    inputId="backdrop"
                                                    title={ t("add_tv_episode.backdrop") }
                                                    inputProps={{ accept: "image/*" }}
                                                    file={ state.formValues.files.backdrop }
                                                    onChange={ file => setState({ ...state, formValues: { ...state.formValues, files: { ...state.formValues.files, backdrop: file } } }) }
                                                />
                                            </div>
                                            <FileSelector
                                                inputId="video"
                                                title={ t("add_tv_episode.video") }
                                                inputProps={{ accept: "video/*,.mkv" }}
                                                file={ state.formValues.files.video }
                                                onChange={
                                                    async file => {
                                                        let duration = await getVideoDurationInSeconds(file.path);
                                                        duration = Math.round(duration / 60);
                                                        setState({ ...state, formValues: { ...state.formValues, runtime: duration, files: { ...state.formValues.files, video: file } } });
                                                    }
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        );
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
            { renderPage() }
        </div>
    );
}