import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "context/Auth";
import TextButton from "components/TextButton";
import Input from "components/Input";
import Button from "components/Button";
import Checkbox from "components/Checkbox";
import FileSelector from "components/FileSelector";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import { makeCancelable, downloadFile, downloadYoutubeVideo } from "utils/Functions";
import * as GenreApi from "api/Genre";
import * as TvApi from "api/Tv";
import ProgressBar from "components/ProgressBar";
import Alert from "components/Alert";
import Table from "components/Table";
import * as TMDbApi from "api/TMDb";
import * as Fanart from "api/Fanart";

export default () => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const
        [state, setState] = React.useState({
            loading: true,
            alert: null,

            genres: null,
            formValues: null,
            
            uploading: false,
            uploadFiles: {},
            uploadProgress: {},
            uploadError: false,
            uploadFinished: false,
            
            searching: false,
            searchValue: null,
            searchData: null,
            
            selectedTv: null,
            youtubeTrailerKey: null,
            downloading: false,
            downloadFiles: {},
            downloadProgress: {}
        });

    React.useEffect(() => {
        if(state.loading) {
            if(!state.genres) {
                const apiPromise = makeCancelable(GenreApi.get(authContext));
                apiPromise
                    .promise
                    .then(info => {
                        let formValues = { published: true, genres: [], files: {} };
                        for (let index = 0; index < info.length; index++) {
                            formValues.genres.push(false);
                        }
                        setState({ loading: false, genres: info, formValues: formValues });
                    })
                    .catch(error => { console.log(error) });
                return () => apiPromise.cancel();
            }
        }
    }, [state.loading, state.genres, authContext]);

    React.useEffect(() => {
        if(state.uploading) {
            let toUploadTv = { ...state.formValues };
            toUploadTv.published = false;
            toUploadTv.genres = [];
            
            for (let index = 0; index < state.genres.length; index++) {
                const checked = state.formValues.genres[index];
                if(checked) {
                    const genre = state.genres[index];
                    toUploadTv.genres.push(genre.id);
                } 
            }

            (
                async () => {
                    const tv = await TvApi.create(authContext, toUploadTv);
                    if(tv) {
                        const id = tv.id;
                        setState(state => ({ ...state, uploadProgress: { ...state.uploadProgress, createTv: 100 } }));

                        for(const key in state.uploadFiles) {
                            if(state.uploadFiles.hasOwnProperty(key)) {
                                const file = state.uploadFiles[key];
                                if(file) {
                                    let extension = ".png";
                                    if(file.type.includes("video")) {
                                        extension = ".mp4";
                                    }

                                    await TvApi.upload(authContext, id, file, key + extension, progressEvent => {
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
                        
                        if(state.formValues.published) {
                            await TvApi.update(authContext, id, { published: true });
                        }

                        setState(state => ({ ...state, uploadFinished: true }));
                    }
                    else {
                        setState(state => ({ ...state, uploading: false, uploadProgress: {}, uploadError: true }));
                    }
                }
            )();
        }
    }, [state.uploading, state.uploadFiles, state.formValues, state.genres, authContext]);

    React.useEffect(() => {
        if(state.searching && state.loading) {
            (
                async () => {
                    const results = await TMDbApi.searchTvs(authContext.state.tmdb, state.searchValue);
                    if(results && results.length > 0) {
                        setState(state => ({ ...state, loading: false, searchData: results }));
                    }
                    else {
                        setState(state => ({ ...state, loading: false }));
                    }
                }
            )();
        }
    }, [state.searching, state.loading, state.searchValue, state.searchData, authContext]);

    React.useEffect(() => {
        const getTvNewFormValues = (tv, genres) => {
            let newFormValues = {
                name: tv.name || "",
                original_name: tv.original_name || "",
                overview: tv.overview || "",
                genres: genres,
                first_air_date: tv.first_air_date || "",
                popularity: tv.popularity || "",
                vote_average: tv.vote_average || "",
                adult: tv.adult || false,
                published: true
            };
            return newFormValues;
        };

        if(state.selectedTv && state.loading) {
            (
                async () => {
                    if(state.searchLogos) {
                        const tmdbId = state.selectedTv.id;
                        const { tvdb_id } = await TMDbApi.getTvExternalIds(authContext.state.tmdb, tmdbId);
                        
                        let images = [];
                        if(tvdb_id) {
                            images = await Fanart.getTvImages(authContext.state.fanart, tvdb_id);
                        }
                        console.log("images: ", images);

                        let logos = [];
                        for (const key in images) {
                            if (images.hasOwnProperty(key)) {
                                if(key.includes("logo")) {
                                    logos = [ ...logos, ...images[key] ];
                                }
                                
                            }
                        }
                        
                        if(logos && logos.length > 0) {
                            setState(state => ({ ...state, loading: false, searchLogos: false, logos: logos }));
                        }
                        else setState(state => ({ ...state, searchLogos: false, logos: null }));
                    }
                    else {
                        //generos
                        let selectedTvGenres = [];
                        for(let index = 0; index < state.genres.length; index++) {
                            selectedTvGenres.push(false);
                        }

                        const tmdbGenres = await TMDbApi.genres(authContext.state.tmdb);
                        const tvGenres = state.selectedTv.genre_ids;
                        if(tmdbGenres && tmdbGenres.length > 0 && state.genres && state.genres.length > 0) {
                            for(let index = 0; index < state.genres.length; index++) {
                                const genre = state.genres[index];
                                for(let j = 0; j < tmdbGenres.length; j++) {
                                    const tmdbGenre = tmdbGenres[j];
                                    if(tmdbGenre.name === genre.name) {
                                        for(let x = 0; x < tvGenres.length; x++) {
                                            const tmdbGenreId = tvGenres[x];
                                            if(tmdbGenreId === tmdbGenre.id) {
                                                selectedTvGenres[index] = true;
                                                break;
                                            }
                                        }
                                        break;
                                    }   
                                }
                            }
                        }

                        //youtube trailer video
                        const videoResults = await TMDbApi.getTvVideos(authContext.state.tmdb, state.selectedTv.id);
                        let youtubeKey = null;
                        if(videoResults && videoResults.length > 0) {
                            for(let i = 0; i < videoResults.length; i++) {
                                const result = videoResults[i];
                                if(result.type && result.site && result.type === "Trailer" && result.site === "YouTube") {
                                    youtubeKey = result.key;
                                    break;
                                }
                            }
                        }

                        //obtener los datos adicionales de la pelicula
                        let tv = state.selectedTv;
                        tv = await TMDbApi.getTv(authContext.state.tmdb, tv.id);
                        
                        const newFormValues = getTvNewFormValues(tv, selectedTvGenres);
                        if(state.selectedLogoUrl || tv.poster_path || tv.backdrop_path || youtubeKey) {
                            let newDownloadFiles = {};
                            if(state.selectedLogoUrl) newDownloadFiles.logo = state.selectedLogoUrl;
                            if(tv.poster_path) newDownloadFiles.poster = tv.poster_path;
                            if(tv.backdrop_path) newDownloadFiles.backdrop = tv.backdrop_path;
                            if(youtubeKey) newDownloadFiles.trailer = youtubeKey;

                            setState(state => ({
                                ...state,
                                formValues: newFormValues,
                                selectedTv: null,
                                youtubeTrailerKey: youtubeKey,
                                downloading: true,
                                downloadFiles: newDownloadFiles,
                                downloadProgress: {},
                                loading: false
                            }));
                        }
                        else {
                            setState(state => ({
                                ...state,
                                formValues: newFormValues,
                                selectedTv: null,
                                youtubeTrailerKey: null,
                                downloading: false,
                                downloadProgress: {},
                                loading: false
                            }));
                        }
                    }
                }
            )();
        }
    }, [state.selectedTv, state.loading, state.genres, state.searchLogos, state.selectedLogoUrl, authContext]);

    React.useEffect(() => {
        if(state.downloading) {
            (
                async () => {
                    for(const key in state.downloadFiles) {
                        if(state.downloadFiles.hasOwnProperty(key)) {
                            let path = null;
                            if(key === "trailer") {
                                path = await downloadYoutubeVideo(state.youtubeTrailerKey, "trailer.mp4", progress => {
                                    setState(state => ({ ...state, downloadProgress: { ...state.downloadProgress, trailer: progress } }));
                                });
                            }
                            else {
                                const url = key === "logo" ? state.selectedLogoUrl : "https://image.tmdb.org/t/p/" + (key === "poster" ? "w200" : "original") + state.downloadFiles[key];
                                path = await downloadFile(url, key + ".png", status => {
                                    setState(state => {
                                        let newDownloadProgress = { ...state.downloadProgress };
                                        newDownloadProgress[key] = status.percent;
                                        return { ...state, downloadProgress: newDownloadProgress };
                                    });
                                });
                            }

                            if(path) {
                                const
                                    response = await fetch("file:///" + path),
                                    blob = await response.clone().blob(),
                                    arrayBuffer = await response.clone().arrayBuffer();

                                const file = new File([arrayBuffer], key + (blob.type.includes("video") ? ".mp4" : ".png"), blob);
                                if(file) {
                                    setState(state => {
                                        let newFiles = { ...state.formValues.files };
                                        newFiles[key] = file;
                                        return { ...state, formValues: { ...state.formValues, files: newFiles } };
                                    });
                                }
                            }
                        }
                    }
                    setState(state => ({ ...state, youtubeTrailerKey: null, downloading: false, downloadFiles: {}, downloadProgress: {} }));
                }
            )();
        }
    }, [state.downloading, state.downloadFiles, state.youtubeTrailerKey, state.selectedLogoUrl]);

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
                        { t("add_tv.upload_error_message") } 
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
                            title={ t("add_tv.go_back_button").toUpperCase() }
                            type="submit"
                        />
                    </Link>
                </div>
            );
        }
        else if(state.uploading) {
            return renderUploading();
        }
        else if(state.logos) {
            return renderLogoSelection();
        }
        else if(state.searching) {
            return renderSearching();
        }
        else if(state.downloading) {
            return renderDownloading();
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
                        { t("add_tv.uploading_create_tv").toUpperCase() } 
                    </span>
                    <ProgressBar
                        value={ state.uploadProgress.createTv || 0 }
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
                                    { t("add_tv." + key).toUpperCase() } 
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
                                title={ t("add_tv.go_back_button").toUpperCase() }
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
                    { state.uploadFinished ? t("add_tv.upload_complete_title") : t("add_tv.uploading_title") }
                </span>
                { renderUploadProgressBars() }
            </div>
        );
    };

    const renderLogoSelection = () => {
        return (
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
                    <MdArrowBack
                        size={ DEFAULT_SIZES.TITLE_SIZE }
                        color={ Definitions.TEXT_COLOR }
                        style={{
                            marginRight: Definitions.DEFAULT_PADDING,
                            cursor: "pointer"
                        }}
                        onClick={ () => { setState({ ...state, searching: false, searchValue: null, searchData: null, logos: null }) } }
                    />
                    <span
                        style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.TITLE_SIZE,
                            marginBottom: Definitions.DEFAULT_PADDING
                        }}
                    >
                        { t("add_tv.select_logo_title") } 
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: 40
                    }}
                >
                    <TextButton
                        title={ t("add_tv.skip_logo_button") }
                        style={{
                            marginLeft: Definitions.DEFAULT_MARGIN,
                            marginRight: Definitions.DEFAULT_MARGIN
                        }}
                        color={ Definitions.TEXT_COLOR }
                        onClick={ () => setState(state => ({ ...state, loading: true, logos: null, selectedLogoUrl: null })) }
                    />
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}
                    >
                        {
                            state.logos.map((logo, index) => {
                                return (
                                    <div
                                        key={ index }
                                        style={{
                                            margin: Definitions.DEFAULT_MARGIN,
                                            padding: Definitions.DEFAULT_PADDING,
                                            height: 100,
                                            cursor: "pointer"
                                        }}
                                        onClick={ () => setState(state => ({ ...state, loading: true, logos: null, selectedLogoUrl: logo.url })) }
                                    >
                                        <img
                                            alt={ "logo " + logo.id }
                                            src={ logo.url }
                                            style={{
                                                maxHeight: 100,
                                                objectFit: "contain",
                                                border: "1px solid white",
                                                borderRadius: Definitions.DEFAULT_BORDER_RADIUS,
                                                padding: Definitions.DEFAULT_PADDING
                                            }}
                                            tabIndex={ -1 }
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    };

    const renderSearching = () => {
        return (
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
                    <MdArrowBack
                        size={ DEFAULT_SIZES.TITLE_SIZE }
                        color={ Definitions.TEXT_COLOR }
                        style={{
                            marginRight: Definitions.DEFAULT_PADDING,
                            cursor: "pointer"
                        }}
                        onClick={ () => { setState({ ...state, searching: false, searchValue: null, searchData: null }) } }
                    />
                    <span
                        style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.TITLE_SIZE,
                            marginBottom: Definitions.DEFAULT_PADDING
                        }}
                    >
                        { t("add_tv.results_title") } 
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        marginLeft: 40
                    }}
                >
                    <span
                        style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                            marginBottom: Definitions.DEFAULT_PADDING
                        }}
                    >
                        { t("add_tv.total", { total: state.searchData?.length || 0 }) }
                    </span>
                    <Table
                        data={ state.searchData || null }
                        headers={[
                            {
                                id: "name",
                                name: t("add_tv.name_header"),
                                orderable: true,
                                filterable: true
                            },
                            {
                                id: "original_name",
                                name: t("add_tv.original_name_header"),
                                orderable: true,
                                filterable: true
                            },
                            {
                                id: "first_air_date",
                                name: t("add_tv.first_air_date_header"),
                                orderable: true,
                                filterable: true
                            },
                            {
                                id: "popularity",
                                name: t("add_tv.popularity_header"),
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
                                        { state.searchData[index][headerId] }
                                    </span>
                                );
                            }
                        }
                        onRowClick={
                            index => {
                                const tv = state.searchData[index];
                                setState({ ...state, searching: false, searchData: null, searchValue: null, selectedTv: tv, loading: true, searchLogos: authContext.state?.fanart ? true : false, logos: null, selectedLogoUrl: null });
                            }
                        }
                    />
                </div>
            </div>
        );
    };

    const renderDownloading = () => {
        const renderDownloadProgressBars = () => {
            let items = [];
            for(const key in state.downloadFiles) {
                if(state.downloadFiles.hasOwnProperty(key)) {
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
                                { t("add_tv." + key).toUpperCase() } 
                            </span>
                            <ProgressBar
                                value={ state.downloadProgress[key] || 0 }
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
                    { t("add_tv.downloading_title") }
                </span>
                { renderDownloadProgressBars() }
            </div>
        );
    };

    const renderForm = () => {
        const handleSubmit = event => {
            event.preventDefault();
            let newUploadFiles = {};
            if(state.formValues.files.logo) newUploadFiles.logo = state.formValues.files.logo;
            if(state.formValues.files.poster) newUploadFiles.poster = state.formValues.files.poster;
            if(state.formValues.files.backdrop) newUploadFiles.backdrop = state.formValues.files.backdrop;
            if(state.formValues.files.trailer) newUploadFiles.trailer = state.formValues.files.trailer;

            setState({ ...state, uploading: true, uploadProgress: { createTv: 0 }, uploadFiles: newUploadFiles });
        };

        const handleTmdbSearchAlert = (id, input) => {
            if(id === "close") {
                setState({ ...state, alert: null });
            }
            else if(id === "search") {
                setState({ ...state,  alert: null, searching: true, searchValue: input, loading: true });
            }
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
                {
                    state.alert === "searchTmdbAlert" &&
                    <Modal
                        relative
                        style={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)"
                        }}
                    >
                        <Alert input title={ t("add_tv.tmdb_search_title") } message={ t("add_tv.tmdb_search_message") } buttons={ [{ id: "close", title: t("add_tv.close_button") }, { id: "search", title: t("add_tv.search_button") }] } onButtonClick={ handleTmdbSearchAlert }/>
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
                            { t("add_tv.page_title") } 
                        </span>
                    </div>
                    <div
                        style={{
                            margin: Definitions.DEFAULT_MARGIN,
                            marginTop: Definitions.DEFAULT_PADDING
                        }}
                    >
                        <TextButton
                            title={ t("add_tv.tmdb_search_button") }
                            style={{
                                marginLeft: Definitions.DEFAULT_MARGIN,
                                marginRight: Definitions.DEFAULT_MARGIN
                            }}
                            onClick={ () => setState({ ...state, alert: "searchTmdbAlert" }) }
                        />
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
                                            required
                                            title={ t("add_tv.name").toUpperCase() }
                                            type="text"
                                            inputProps={{ maxLength: 128 }}
                                            value={ state.formValues.name || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, name: event.target.value } }) }
                                        />
                                        <Input
                                            title={ t("add_tv.original_name").toUpperCase() }
                                            type="text"
                                            inputProps={{ maxLength: 128 }}
                                            value={ state.formValues.original_name || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, original_name: event.target.value } }) }
                                        />
                                        <Input
                                            textArea
                                            title={ t("add_tv.overview").toUpperCase() }
                                            inputProps={{ maxLength: 1024 }}
                                            value={ state.formValues.overview || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, overview: event.target.value } }) }
                                        />
                                        {
                                            state.genres && state.genres.length > 0 &&
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    margin: Definitions.DEFAULT_MARGIN
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
                                                    { t("add_tv.genres").toUpperCase() }
                                                </span>
                                                <div
                                                    style={{
                                                        maxHeight: 200,
                                                        overflow: "auto"
                                                    }}
                                                >
                                                    {
                                                        state.genres.map((genre, index) => {
                                                            return (
                                                                <Checkbox
                                                                    key={ index }
                                                                    title={ genre.name.toUpperCase() }
                                                                    style={{ margin: 0, marginBottom: Definitions.DEFAULT_PADDING / 2 }}
                                                                    checked={ state.formValues.genres[index] || false }
                                                                    onChange={
                                                                        event => {
                                                                            let formValuesGenres = state.formValues.genres;
                                                                            formValuesGenres[index] = event.target.checked;
                                                                            setState({ ...state, formValues: { ...state.formValues, genres: formValuesGenres } })
                                                                        }
                                                                    }
                                                                />
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        }
                                        <Input
                                            title={ t("add_tv.first_air_date").toUpperCase() }
                                            type="date"
                                            value={ state.formValues.first_air_date || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, first_air_date: event.target.value } }) }
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                flex: 1,
                                                flexDirection: "row"
                                            }}
                                        >
                                            <Input
                                                title={ t("add_tv.popularity").toUpperCase() }
                                                type="number"
                                                inputProps={{ min: 0, step: "0.001" }}
                                                value={ state.formValues.popularity || "" }
                                                onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, popularity: event.target.value } }) }
                                            />
                                            <Input
                                                title={ t("add_tv.vote_average").toUpperCase() }
                                                type="number"
                                                inputProps={{ min: 0, max: 10, step: "0.001" }}
                                                value={ state.formValues.vote_average || "" }
                                                onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, vote_average: event.target.value } }) }
                                            />
                                        </div>
                                        <Checkbox
                                            title={ t("add_tv.adult").toUpperCase() }
                                            checked={ state.formValues.adult || false }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, adult: event.target.checked } }) }
                                        />
                                        <Checkbox
                                            title={ t("add_tv.published").toUpperCase() }
                                            style={{
                                                marginBottom: 0
                                            }}
                                            checked={ state.formValues.published || false }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, published: event.target.checked } }) }
                                        />
                                        <Button
                                            title={ t("add_tv.add_button").toUpperCase() }
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
                                                height: 150,
                                                marginBottom: Definitions.DEFAULT_MARGIN
                                            }}
                                        >
                                            <FileSelector
                                                inputId="logo"
                                                title={ t("add_tv.logo") }
                                                inputProps={{ accept: "image/*" }}
                                                file={ state.formValues.files.logo }
                                                onChange={ file => setState({ ...state, formValues: { ...state.formValues, files: { ...state.formValues.files, logo: file } } }) }
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
                                                    title={ t("add_tv.poster") }
                                                    inputProps={{ accept: "image/*" }}
                                                    file={ state.formValues.files.poster }
                                                    onChange={ file => setState({ ...state, formValues: { ...state.formValues, files: { ...state.formValues.files, poster: file } } }) }
                                                />
                                            </div>
                                            <FileSelector
                                                inputId="backdrop"
                                                title={ t("add_tv.backdrop") }
                                                inputProps={{ accept: "image/*" }}
                                                file={ state.formValues.files.backdrop }
                                                onChange={ file => setState({ ...state, formValues: { ...state.formValues, files: { ...state.formValues.files, backdrop: file } } }) }
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
                                                title={ t("add_tv.trailer") }
                                                inputProps={{ accept: "video/*,.mkv" }}
                                                file={ state.formValues.files.trailer }
                                                onChange={ file => setState({ ...state, formValues: { ...state.formValues, files: { ...state.formValues.files, trailer: file } } }) }
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