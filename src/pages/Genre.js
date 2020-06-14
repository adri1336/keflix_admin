import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Input from "components/Input";
import Button from "components/Button";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Alert from "components/Alert";
import * as GenreApi from "api/Genre";
import { AuthContext } from "context/Auth";
import EditableText from "components/EditableText";
import TextButton from "components/TextButton";

export default ({ history, location }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const
        [genre, setGenre] = React.useState(location.state?.genre || null),
        [name, setName] = React.useState(genre?.name || ""),
        [modal, setModal] = React.useState(null);

    const renderPage = () => {
        if(genre) {
            return (
                <div>
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        editable={ false }
                        title={ t("genre.id") }
                        value={ genre.id }
                    />
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        title={ t("genre.name") }
                        value={ genre.name }
                        onClick={ () => setModal({ editAlert: { property: "name", inputValue: genre.name || "", inputProps: { type: "text", maxLength: 64 } } }) }
                    />
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        editable={ false }
                        title={ t("genre.created_at") }
                        value={ genre.createdAt }
                    />
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        editable={ false }
                        title={ t("genre.updated_at") }
                        value={ genre.updatedAt }
                    />
                    <TextButton
                        title={ t("genre.delete_genre_button") }
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        color="red"
                        onClick={ () => setModal({ delete: true }) }
                    />
                </div>
            );
        }
        else {
            const handleSubmit = async (event) => {
                event.preventDefault();
                setModal({ loading: true });

                const createdGenre = await GenreApi.create(authContext, { name: name });
                if(createdGenre) {
                    setModal({ successfulCreateAlert: true });
                    setGenre(createdGenre);
                }
                else {
                    setModal({ unsuccessfulCreateAlert: true });
                }
            };

            return (
                <form
                    style={{
                        width: 400
                    }}
                    onSubmit={ handleSubmit }
                >
                    <fieldset
                        style={{
                            border: 0
                        }}
                        disabled={ modal ? true : false }
                    >
                        <Input
                            required
                            title={ t("genre.name").toUpperCase() }
                            value={ name }
                            onChange={ (event) => setName(event.target.value) }
                            inputProps={{ maxLength: 64 }}
                        />
                        <Button
                            title={ t("genre.add_button").toUpperCase() }
                            type="submit"
                            style={{ flexDirection: "column", margin: Definitions.DEFAULT_MARGIN }}
                        />
                    </fieldset>
                </form>
            );
        }
    };

    const handleEditAlert = async (property, id, input) => {
        if(id === "update") {
            let newGenre = {};
            newGenre[property] = input;

            setModal({ loading: true });
            const updatedGenre = await GenreApi.update(authContext, genre.id, newGenre);
            
            if(updatedGenre) {
                setModal({ successfulUpdateAlert: true });
                setGenre(updatedGenre);
            }
            else {
                setModal({ unsuccessfulUpdateAlert: true });
            }
        }
        else {
            setModal(null);
        }
    }

    const handleDeleteAlert = async (id) => {
        if(id === "delete") {
            setModal({ loading: true });

            const result = await GenreApi.destroy(authContext, genre.id);
            if(result) {
                history.replace("/genres");
            }
            else {
                setModal({ unsuccessfulDeleteAlert: true });
            }
        }
        else {
            setModal(null);
        }
    }
    
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
            <Modal
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: modal ? "flex" : "none"
                }}
            >
                { modal?.loading && <Spinner/> }
                { modal?.unsuccessfulCreateAlert && <Alert title={ t("genre.error_title") } message={ t("genre.unsuccessful_create") } buttons={ [{ title: t("genre.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.successfulCreateAlert && <Alert title={ t("genre.info_title") } message={ t("genre.successful_register") } buttons={ [{ title: t("genre.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.editAlert && <Alert input inputValue={ modal.editAlert.inputValue } inputProps={ modal.editAlert.inputProps } title={ t("genre.edit_title") } message={ t("genre.edit_" + modal.editAlert.property) } buttons={ [{ id: "close", title: t("genre.close_button") }, { id: "update", title: t("genre.update_button") }] } onButtonClick={ (id, input) => handleEditAlert(modal.editAlert.property, id, input) }/> }
                { modal?.unsuccessfulUpdateAlert && <Alert title={ t("genre.error_title") } message={ t("genre.unsuccessful_update") } buttons={ [{ title: t("genre.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.successfulUpdateAlert && <Alert title={ t("genre.info_title") } message={ t("genre.successful_update") } buttons={ [{ title: t("genre.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.delete && <Alert title={ t("genre.delete_title") } message={ t("genre.delete_genre_message") } buttons={ [{ id: "close", title: t("genre.close_button") }, { id: "delete", title: t("genre.delete_button") }] } onButtonClick={ handleDeleteAlert }/> }
                { modal?.unsuccessfulDeleteAlert && <Alert title={ t("genre.error_title") } message={ t("genre.unsuccessful_delete") } buttons={ [{ title: t("genre.close_button") }] } onButtonClick={ () => setModal(null) }/> }
            </Modal>
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
                        to="/genres"
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
                        { genre ? t("genre.title") : t("genre.add_title") } 
                    </span>
                </div>
                { renderPage() }
            </div>
        </div>
    );
}