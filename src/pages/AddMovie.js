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

export default ({ history, location }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();


    const [formValues, setFormValues] = React.useState({ published: true });

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
                                border: 0
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
                                    value={ formValues.title || "" }
                                    onChange={ (event) => setFormValues({ ...formValues, title: event.target.value }) }
                                />
                                <Input
                                    title={ t("add_movie.original_title").toUpperCase() }
                                    type="text"
                                    inputProps={{ maxLength: 128 }}
                                    value={ formValues.original_title || "" }
                                    onChange={ (event) => setFormValues({ ...formValues, original_title: event.target.value }) }
                                />
                                <Input
                                    textArea
                                    title={ t("add_movie.overview").toUpperCase() }
                                    inputProps={{ maxLength: 1024 }}
                                    value={ formValues.overview || "" }
                                    onChange={ (event) => setFormValues({ ...formValues, overview: event.target.value }) }
                                />
                                <Input
                                    title={ t("add_movie.tagline").toUpperCase() }
                                    inputProps={{ maxLength: 128 }}
                                    value={ formValues.tagline || "" }
                                    onChange={ (event) => setFormValues({ ...formValues, tagline: event.target.value }) }
                                />
                                <Input
                                    title={ t("add_movie.release_date").toUpperCase() }
                                    type="date"
                                    value={ formValues.release_date || "" }
                                    onChange={ (event) => setFormValues({ ...formValues, release_date: event.target.value }) }
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row"
                                    }}
                                >
                                    <Input
                                        title={ t("add_movie.runtime").toUpperCase() }
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={ formValues.runtime || "" }
                                        onChange={ (event) => setFormValues({ ...formValues, runtime: event.target.value }) }
                                    />
                                    <Input
                                        title={ t("add_movie.popularity").toUpperCase() }
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={ formValues.popularity || "" }
                                        onChange={ (event) => setFormValues({ ...formValues, popularity: event.target.value }) }
                                    />
                                    
                                    <Input
                                        title={ t("add_movie.vote_average").toUpperCase() }
                                        type="number"
                                        inputProps={{ min: 0, max: 10 }}
                                        value={ formValues.vote_average || "" }
                                        onChange={ (event) => setFormValues({ ...formValues, vote_average: event.target.value }) }
                                    />
                                </div>
                                <Checkbox
                                    title={ t("add_movie.adult").toUpperCase() }
                                    style={{
                                        margin: 0,
                                        marginLeft: Definitions.DEFAULT_MARGIN
                                    }}
                                    checked={ formValues.adult || false }
                                    onChange={ (event) => setFormValues({ ...formValues, adult: event.target.checked }) }
                                />
                                <Checkbox
                                    title={ t("add_movie.published").toUpperCase() }
                                    style={{
                                        margin: 0,
                                        marginTop: Definitions.DEFAULT_MARGIN,
                                        marginLeft: Definitions.DEFAULT_MARGIN
                                    }}
                                    checked={ formValues.published || false }
                                    onChange={ (event) => setFormValues({ ...formValues, published: event.target.checked }) }
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
                                    flexDirection: "column"
                                }}
                            >
                                <h1>MEDIOS</h1>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}