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
import { makeCancelable } from "utils/Functions";
import * as GenreApi from "api/Genre";

export default ({ history, location }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const
        [state, setState] = React.useState({
            loading: true,
            genres: null,
            formValues: null,
            uploading: false
        });

    React.useEffect(() => {
        if(state.loading) {
            if(!state.genres) {
                const apiPromise = makeCancelable(GenreApi.get(authContext));
                apiPromise
                    .promise
                    .then(info => {
                        let formValues = { published: true, genres: [] };
                        for (let index = 0; index < info.length; index++) {
                            formValues.genres.push(false);
                        }
                        setState({ loading: false, genres: info, formValues: formValues });
                    })
                    .catch(error => { console.log(error) });
                return () => apiPromise.cancel();
            }
        }
        else {

        }
    }, [state, authContext]);

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

        if(state.uploading) {

        }
        else {
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
                                fontSize: DEFAULT_SIZES.TITLE_SIZE
                            }}
                        >
                            { t("add_movie.page_title") } 
                        </span>
                    </div>
                    <div
                        style={{
                            margin: Definitions.DEFAULT_MARGIN,
                            marginTop: Definitions.DEFAULT_PADDING
                        }}
                    >
                        <TextButton
                            title={ t("add_movie.tmdb_search_button") }
                            style={{
                                marginLeft: Definitions.DEFAULT_MARGIN,
                                marginRight: Definitions.DEFAULT_MARGIN
                            }}
                        />
                        <form
                        >
                            <div
                                role="group"
                                style={{
                                    display: "flex",
                                    flex: 1,
                                    flexDirection: "row",
                                    border: 0,
                                    maxWidth: 800
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
                                        title={ t("add_movie.title").toUpperCase() }
                                        type="text"
                                        inputProps={{ maxLength: 128 }}
                                        value={ state.formValues.title || "" }
                                        onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, title: event.target.value } }) }
                                    />
                                    <Input
                                        title={ t("add_movie.original_title").toUpperCase() }
                                        type="text"
                                        inputProps={{ maxLength: 128 }}
                                        value={ state.formValues.original_title || "" }
                                        onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, original_title: event.target.value } }) }
                                    />
                                    <Input
                                        textArea
                                        title={ t("add_movie.overview").toUpperCase() }
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
                                                { t("add_movie.genres").toUpperCase() }
                                            </span>
                                            <div
                                                style={{
                                                    height: 200,
                                                    overflow: "auto"
                                                }}
                                            >
                                                {
                                                    state.genres.map((genre, index) => {
                                                        return (
                                                            <Checkbox
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
                                        title={ t("add_movie.tagline").toUpperCase() }
                                        inputProps={{ maxLength: 128 }}
                                        value={ state.formValues.tagline || "" }
                                        onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, tagline: event.target.value } }) }
                                    />
                                    <Input
                                        title={ t("add_movie.release_date").toUpperCase() }
                                        type="date"
                                        value={ state.formValues.release_date || "" }
                                        onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, release_date: event.target.value } }) }
                                    />
                                    <Input
                                        title={ t("add_movie.runtime").toUpperCase() }
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={ state.formValues.runtime || "" }
                                        onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, runtime: event.target.value } }) }
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            flex: 1,
                                            flexDirection: "row"
                                        }}
                                    >
                                        <Input
                                            title={ t("add_movie.popularity").toUpperCase() }
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={ state.formValues.popularity || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, popularity: event.target.value } }) }
                                        />
                                        <Input
                                            title={ t("add_movie.vote_average").toUpperCase() }
                                            type="number"
                                            inputProps={{ min: 0, max: 10 }}
                                            value={ state.formValues.vote_average || "" }
                                            onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, vote_average: event.target.value } }) }
                                        />
                                    </div>
                                    <Checkbox
                                        title={ t("add_movie.adult").toUpperCase() }
                                        checked={ state.formValues.adult || false }
                                        onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, adult: event.target.checked } }) }
                                    />
                                    <Checkbox
                                        title={ t("add_movie.published").toUpperCase() }
                                        style={{
                                            marginBottom: 0
                                        }}
                                        checked={ state.formValues.published || false }
                                        onChange={ (event) => setState({ ...state, formValues: { ...state.formValues, published: event.target.checked } }) }
                                    />
                                    <Button
                                        title={ t("add_movie.add_button").toUpperCase() }
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
                                            title={ t("add_movie.logo") }
                                            inputProps={{ accept: "image/*" }}
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
                                                title={ t("add_movie.poster") }
                                                inputProps={{ accept: "image/*" }}
                                            />
                                        </div>
                                        <FileSelector
                                            title={ t("add_movie.backdrop") }
                                            inputProps={{ accept: "image/*" }}
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
                                                flex: 1,
                                                marginRight: Definitions.DEFAULT_PADDING
                                            }}
                                        >
                                            <FileSelector
                                                title={ t("add_movie.trailer") }
                                                inputProps={{ accept: "video/*" }}
                                            />
                                        </div>
                                        <FileSelector
                                            title={ t("add_movie.video") }
                                            inputProps={{ accept: "video/*" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            );
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
            { renderPage() }
        </div>
    );
}