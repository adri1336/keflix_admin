import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Input from "components/Input";
import Checkbox from "components/Checkbox";
import Button from "components/Button";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Alert from "components/Alert";
import * as Account from "api/Account";
import { AuthContext } from "context/Auth";
import EditableText from "components/EditableText";
import TextButton from "components/TextButton";

export default ({ history, location }) => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();

    const
        [account, setAccount] = React.useState(location.state?.account || null),
        [email, setEmail] = React.useState(account?.email || ""),
        [password, setPassword] = React.useState(""),
        [admin, setAdmin] = React.useState(account?.admin || false),
        [modal, setModal] = React.useState(null);

    const renderPage = () => {
        if(account) {
            return (
                <div>
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        editable={ false }
                        title={ t("account.id") }
                        value={ account.id }
                    />
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        title={ t("account.email") }
                        value={ account.email }
                        onClick={ () => setModal({ editAlert: "email" }) }
                    />
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
                            { t("account.password") }
                        </span>
                        <TextButton
                            title={ t("account.change_password_button") }
                            onClick={ () => setModal({ editAlert: "password" }) }
                        />
                    </div>
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        title={ t("account.admin") }
                        value={ account.admin ? t("account.admin_yes") : t("account.admin_no") }
                        onClick={ () => handleEditAlert("admin", "update", !account.admin) }
                    />
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        editable={ false }
                        title={ t("account.created_at") }
                        value={ account.createdAt }
                    />
                    <EditableText
                        style={{ margin: Definitions.DEFAULT_MARGIN }}
                        editable={ false }
                        title={ t("account.updated_at") }
                        value={ account.updatedAt }
                    />
                    <TextButton
                        title={ t("account.delete_account_button") }
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

                const createdAccount = await Account.create(authContext, { email: email, password: password, admin: admin });
                
                if(createdAccount) {
                    setModal({ successfulRegisterAlert: true });
                    setAccount(createdAccount);
                }
                else {
                    setModal({ unsuccessfulRegisterAlert: true });
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
                            title={ t("account.email").toUpperCase() }
                            type="email"
                            value={ email }
                            onChange={ (event) => setEmail(event.target.value) }
                        />
                        <Input
                            required
                            title={ t("account.password").toUpperCase() }
                            type="password"
                            value={ password }
                            onChange={ (event) => setPassword(event.target.value) }
                        />
                        <Checkbox
                            title={ t("account.admin").toUpperCase() }
                            onChange={ (event) => setAdmin(event.target.checked) }
                            checked={ admin }
                        />
                        <Button
                            title={ t("account.add_button").toUpperCase() }
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
            const newAccount = Object.create(account);
            newAccount[property] = input;
            
            setModal({ loading: true });
            const updatedAccount = await Account.update(authContext, account.id, newAccount);
            
            if(updatedAccount) {
                setModal({ successfulUpdateAlert: true });
                setAccount(updatedAccount);
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
            const result = await Account.destroy(authContext, account.id);
            if(result) {
                history.replace("/accounts");
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
                { modal?.unsuccessfulRegisterAlert && <Alert title={ t("account.error_title") } message={ t("account.unsuccessful_register") } buttons={ [{ title: t("account.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.successfulRegisterAlert && <Alert title={ t("account.info_title") } message={ t("account.successful_register") } buttons={ [{ title: t("account.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.editAlert && <Alert input inputType={ modal.editAlert === "password" ? "password" : "text" } title={ t("account.edit_title") } message={ t("account.edit_" + modal.editAlert) } buttons={ [{ id: "close", title: t("account.close_button") }, { id: "update", title: t("account.update_button") }] } onButtonClick={ (id, input) => handleEditAlert(modal.editAlert, id, input) }/> }
                { modal?.unsuccessfulUpdateAlert && <Alert title={ t("account.error_title") } message={ t("account.unsuccessful_update") } buttons={ [{ title: t("account.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.successfulUpdateAlert && <Alert title={ t("account.info_title") } message={ t("account.successful_update") } buttons={ [{ title: t("account.close_button") }] } onButtonClick={ () => setModal(null) }/> }
                { modal?.delete && <Alert title={ t("account.delete_title") } message={ t("account.delete_account_message") } buttons={ [{ id: "close", title: t("account.close_button") }, { id: "delete", title: t("account.delete_button") }] } onButtonClick={ handleDeleteAlert }/> }
                { modal?.unsuccessfulDeleteAlert && <Alert title={ t("account.error_title") } message={ t("account.unsuccessful_delete") } buttons={ [{ title: t("account.close_button") }] } onButtonClick={ () => setModal(null) }/> }
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
                        to="/accounts"
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
                        { account ? t("account.title") : t("account.add_title") } 
                    </span>
                </div>
                { renderPage() }
            </div>
        </div>
    );
}