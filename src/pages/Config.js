import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import EditableText from "components/EditableText";
import TextButton from "components/TextButton";
import { AuthContext } from "context/Auth";
import { useTranslation } from "react-i18next";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Alert from "components/Alert";
import * as TMDb from "api/TMDb";

export default () => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();
    const tmdb = authContext.state?.tmdb;

    const [modal, setModal] = React.useState(null);

    const handleTmdbCheck = async () => {
        setModal({ loading: true });
        const data = await TMDb.genres(tmdb);
        if(data) {
            setModal({ successfulTmdbCheckAlert: true });
        }
        else {
            setModal({ unsuccessfulTmdbCheckAlert: true });
        }
    };

    const handleTmdbAlert = (property, id, input) => {
        if(id === "update") {
            let newState = Object.create(authContext.state);
            if(!newState?.tmdb) {
                newState.tmdb = {};
            }

            newState.tmdb[property] = input;
            localStorage.setItem("tmdb_" + property, input);
            authContext.setState(newState);
            setModal(null);
        }
        else {
            setModal(null);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                position: "relative"
            }}
        >
            <Modal
                relative
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: modal ? "flex" : "none"
                }}
            >
                { modal?.loading && <Spinner/> }
                { modal?.tdmdbAlert && <Alert input title={ t("config.edit_title") } message={ t("config.edit_tmdb_" + modal.tdmdbAlert) } buttons={ [{ id: "close", title: t("config.close_button") }, { id: "update", title: t("account.update_button") }] } onButtonClick={ (id, input) => handleTmdbAlert(modal.tdmdbAlert, id, input) }/> }
                { modal?.unsuccessfulTmdbCheckAlert && <Alert title={ t("config.error_title") } message={ t("config.unsuccessful_tmdb_check") } buttons={ [{ title: t("config.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.successfulTmdbCheckAlert && <Alert title={ t("config.info_title") } message={ t("config.successful_tmdb_check") } buttons={ [{ title: t("config.close_button") }] } onButtonClick={ () => setModal(null) }/> }
            </Modal>
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
                        fontSize: DEFAULT_SIZES.TITLE_SIZE,
                        marginBottom: Definitions.DEFAULT_PADDING
                    }}
                >
                    { t("config.tmdb_title") } 
                </span>
                <TextButton
                    title={ t("config.tmdb_check_button") }
                    style={{ marginBottom: Definitions.DEFAULT_PADDING }}
                    onClick={ handleTmdbCheck }
                />
                <EditableText
                    style={{ marginBottom: Definitions.DEFAULT_PADDING }}
                    selectable
                    title={ t("config.tmdb_api_key") }
                    value={ tmdb?.api_key }
                    onClick={ () => setModal({ tdmdbAlert: "api_key" }) }
                />
                <EditableText
                    style={{ marginBottom: Definitions.DEFAULT_PADDING }}
                    selectable
                    title={ t("config.tmdb_lang") }
                    value={ tmdb?.lang }
                    onClick={ () => setModal({ tdmdbAlert: "lang" }) }
                />
            </div>
        </div>
    );
}