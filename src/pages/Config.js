import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import EditableText from "components/EditableText";
import TextButton from "components/TextButton";
import { AuthContext } from "context/Auth";
import { useTranslation } from "react-i18next";

export default () => {
    const authContext = React.useContext(AuthContext);
    const { t } = useTranslation();
    const tmdb = authContext.state?.tmdb;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                position: "relative"
            }}
        >
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
                />
                <EditableText
                    style={{ marginBottom: Definitions.DEFAULT_PADDING }}
                    title={ t("config.tmdb_api_key") }
                    value={ tmdb?.api_key }
                />
                <EditableText
                    style={{ marginBottom: Definitions.DEFAULT_PADDING }}
                    title={ t("config.tmdb_lang") }
                    value={ tmdb?.lang }
                />
            </div>
        </div>
    );
}