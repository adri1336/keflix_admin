import React from "react";
import { AuthContext } from "context/Auth";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import Table, { FILTER_DATA_TYPES } from "components/Table";
import * as Account from "api/Account";
import { useTranslation } from "react-i18next";
import { MdPersonAdd } from "react-icons/md";

export default () => {
    const authContext = React.useContext(AuthContext);
    const [data, setData] = React.useState(null);
    const { t } = useTranslation();

    React.useEffect(() => {
        if(!data) {
            (
                async () => {
                    const info = await Account.list(authContext);
                    if(info) {
                        setData(info);
                    }
                }
            )(); 
        }
    }, [data, authContext]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                position: "relative"
            }}
        >
            {
                !data &&
                <Modal
                    relative
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <Spinner/>
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
                <span
                    style={{
                        color: Definitions.TEXT_COLOR,
                        fontSize: DEFAULT_SIZES.TITLE_SIZE,
                        marginBottom: Definitions.DEFAULT_PADDING
                    }}
                >
                    { t("accounts.title") } 
                </span>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: Definitions.DEFAULT_PADDING
                    }}
                >
                    <span
                        style={{
                            flex: 1,
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.NORMAL_SIZE
                        }}
                    >
                        { t("accounts.total", { total: data?.length }) }
                    </span>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <MdPersonAdd
                            color={ Definitions.SECONDARY_TEXT_COLOR }
                            size={ DEFAULT_SIZES.BIG_SUBTITLE_SIZE }
                            style={{
                                marginRight: Definitions.DEFAULT_PADDING
                            }}
                        />
                        <span
                            style={{
                                color: Definitions.TEXT_COLOR,
                                fontSize: DEFAULT_SIZES.NORMAL_SIZE
                            }}
                        >
                            { t("accounts.add_button") }
                        </span>
                    </div>
                </div>
                <Table
                    data={ data }                   
                    headers={[
                        {
                            id: "id",
                            name: t("accounts.id_header"),
                            orderable: true,
                            filterType: FILTER_DATA_TYPES.NUMBER
                        },
                        {
                            id: "email",
                            name: t("accounts.email_header"),
                            orderable: true,
                            filterType: FILTER_DATA_TYPES.TEXT
                        },
                        {
                            id: "profiles",
                            name: t("accounts.profiles_header"),
                            orderable: true,
                            filterType: FILTER_DATA_TYPES.NUMBER
                        }
                    ]}
                    onRenderCell={
                        (headerId, index) => {
                            switch(headerId) {
                                case "profiles": {
                                    return (
                                        <span
                                            style={{
                                                color: Definitions.DARK_TEXT_COLOR,
                                                fontSize: DEFAULT_SIZES.NORMAL_SIZE
                                            }}
                                        >
                                            { data[index].profiles.length }
                                        </span>
                                    );
                                    break;
                                }
                                default: {
                                    return (
                                        <span
                                            style={{
                                                color: Definitions.DARK_TEXT_COLOR,
                                                fontSize: DEFAULT_SIZES.NORMAL_SIZE
                                            }}
                                        >
                                            { data[index][headerId] }
                                        </span>
                                    );
                                }
                            }
                        }
                    }
                    onRowClick={
                        index => {
                            console.log("row clicked: ", index);
                        }
                    }
                />
            </div>
        </div>
    );
}