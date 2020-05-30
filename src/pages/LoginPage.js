import React from "react";
import { useTranslation } from "react-i18next";
import Definitions from "utils/Definitions";
import Input from "components/Input";
import Checkbox from "components/Checkbox";
import Button from "components/Button";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Alert from "components/Alert";
import * as Auth from "api/Auth";

export default () => {
    const { t } = useTranslation();

    const
        [server, setServer] = React.useState(""),
        [email, setEmail] = React.useState(""),
        [password, setPassword] = React.useState(""),
        [modal, setModal] = React.useState(null);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setModal({ loading: true });
        
        const account = {
            email: email,
            password: password
        };
        const data = await Auth.login(server, account);
        console.log("data: ", data);
        if(data) {

        }
        else {
            setModal({ alert: "No se ha podido iniciar sesión, comprueba que todos los datos sean correctos." });
        }
    }

    const handleAlertButton = () => {
        setModal(null);
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                backgroundColor: Definitions.PRIMARY_COLOR,
                justifyContent: "center",
                alignItems: "center",
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
                { modal?.alert && <Alert title="Error" message={ modal.alert } buttons={ [{ title: "Cerrar" }] } onButtonClick={ handleAlertButton }/> }
            </Modal>
            
            <img
                src={ require("assets/logo.png") }
                style={{
                    width: 200,
                    margin: 20
                }}
                alt="logo"
            />
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
                        title={ t("login.server_input").toUpperCase() }
                        type="url"
                        
                        value={ server }
                        onChange={ (event) => setServer(event.target.value) }
                    />
                    <Input
                        title={ t("login.email_input").toUpperCase() }
                        required
                        type="email"
                        value={ email }
                        onChange={ (event) => setEmail(event.target.value) }
                    />
                    <Input
                        title={ t("login.password_input").toUpperCase() }
                        required
                        type="password"
                        value={ password }
                        onChange={ (event) => setPassword(event.target.value) }
                    />
                    <Checkbox
                        title={ t("login.remember_checkbox").toUpperCase() }
                    />
                    <Button
                        title={ t("login.login_button").toUpperCase() }
                        type="submit"
                        style={{ flexDirection: "column", margin: Definitions.DEFAULT_MARGIN }}
                    />
                </fieldset>
            </form>
        </div>
    );
}