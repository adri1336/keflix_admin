import React from "react";
import { useTranslation } from "react-i18next";
import Definitions from "utils/Definitions";
import Input from "components/Input";
import Checkbox from "components/Checkbox";
import Button from "components/Button";
import Spinner from "components/Spinner";
import Modal from "components/Modal";

export default () => {
    const { t } = useTranslation();

    const
        [server, setServer] = React.useState(""),
        [email, setEmail] = React.useState(""),
        [password, setPassword] = React.useState(""),
        [loading, setLoading] = React.useState(false);

    const handleSubmit = (event) => {
        setLoading(true);
        
        event.preventDefault();
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
                    display: loading ? "flex" : "none"
                }}
            >
                <Spinner/>
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
                    disabled={ loading ? true : false }
                >
                    <Input
                        required
                        title={ t("login.server_input").toUpperCase() }
                        type="url"
                        style={{ width: "100%" }}
                        value={ server }
                        onChange={ (event) => setServer(event.target.value) }
                    />
                    <Input
                        title={ t("login.email_input").toUpperCase() }
                        required
                        type="email"
                        style={{ width: "100%" }}
                        value={ email }
                        onChange={ (event) => setEmail(event.target.value) }
                    />
                    <Input
                        title={ t("login.password_input").toUpperCase() }
                        required
                        type="password"
                        style={{ width: "100%" }}
                        value={ password }
                        onChange={ (event) => setPassword(event.target.value) }
                    />
                    <Checkbox
                        title={ t("login.remember_checkbox").toUpperCase() }
                        style={{ width: "100%" }}
                    />
                    <Button
                        title={ t("login.login_button").toUpperCase() }
                        type="submit"
                        style={{ width: "100%" }}
                    />
                </fieldset>
            </form>
        </div>
    );
}