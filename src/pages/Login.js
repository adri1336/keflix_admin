import React from "react";
import { useTranslation } from "react-i18next";
import Definitions, { STORAGE_KEYS } from "utils/Definitions";
import Input from "components/Input";
import Checkbox from "components/Checkbox";
import Button from "components/Button";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Alert from "components/Alert";
import * as Auth from "api/Auth";
import * as Account from "api/Account";
import { AuthContext } from "context/Auth";
import { clearAuthLocalStorage } from "utils/Functions";

export default () => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const
        [server, setServer] = React.useState(""),
        [email, setEmail] = React.useState(""),
        [password, setPassword] = React.useState(""),
        [remember, setRemember] = React.useState(false),
        [modal, setModal] = React.useState(null);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setModal({ loading: true });
        
        let fixedServer = server;
        if(fixedServer.slice(-1) === "/") {
            fixedServer = fixedServer.slice(0, -1); 
        }

        const account = {
            email: email,
            password: password
        };
        const data = await Auth.login(fixedServer, account);

        if(data && data.account.admin) {
            if(remember) {
                localStorage.setItem(STORAGE_KEYS.SERVER, fixedServer);
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
            }
            login(data.access_token, data.refresh_token, data.account, fixedServer);
        }
        else {
            setModal({ alert: t("login.message_alert") });
        }
    }

    const handleAlertButton = () => {
        setModal(null);
    }

    const login = React.useCallback((accessToken, refreshToken, account, server) => {
        const tmdb_api_key = localStorage.getItem(STORAGE_KEYS.TMDB_API_KEY);
        const tmdb_lang = localStorage.getItem(STORAGE_KEYS.TMDB_LANG);
        authContext.setState({
            accessToken: accessToken,
            refreshToken: refreshToken,
            account: account,
            server: server,
            tmdb: {
                api_key: tmdb_api_key,
                lang: tmdb_lang
            }
        });
    }, [authContext]);

    React.useEffect(() => {
        const
            server = localStorage.getItem(STORAGE_KEYS.SERVER),
            accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
            refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if(server && accessToken && refreshToken) {
            setModal({ loading: true });
            (
                async () => {
                    let data = await Account.getPassToken(server, accessToken);
                    if(data) {
                        login(accessToken, refreshToken, data, server);
                    }
                    else {
                        //try refresh token
                        data = await Auth.token(server, refreshToken);
                        if(data) {
                            const { account, access_token, refresh_token } = data;
                            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
                            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
                            login(access_token, refresh_token, account, server);
                        }
                        else {
                            clearAuthLocalStorage();
                            setModal(null);
                        }
                    }
                }
            )();
        }
    }, [login]);

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
                { modal?.alert && <Alert title={ t("login.title_alert") } message={ modal.alert } buttons={ [{ title: t("login.close_button_alert") }] } onButtonClick={ handleAlertButton }/> }
            </Modal>
            
            <img
                src={ process.env.PUBLIC_URL + "/assets/logo.png" }
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
                        inputProps={{ maxLength: 64 }}
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
                        onChange={ (event) => setRemember(event.target.checked) }
                        checked={ remember }
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