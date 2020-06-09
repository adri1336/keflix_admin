import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import IconButton from "components/IconButton";
import { MdFolder, MdDelete } from "react-icons/md";

export default ({ title, inputProps, onChange }) => {
    const
        [file, setFile] = React.useState(null),
        [inputId] = React.useState(Date.now());

    const renderFile = () => {
        if(file.type.includes("image")) {
            return (
                <img
                    alt="fileSelector"
                    src={ URL.createObjectURL(file) }
                    style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain"
                    }}
                />
            );
        }
        else if(file.type.includes("video")) {
            return (
                <video
                    src={ URL.createObjectURL(file) }
                    controls={ true }
                    autoPlay={ false }
                    style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover"
                    }}
                />
            );
        }
        else {
            return <div/>;
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                flexDirection: "column"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    height: "100%",
                    backgroundColor: Definitions.COMPONENT_BG_COLOR,
                    borderRadius: Definitions.DEFAULT_BORDER_RADIUS,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {
                    file ?
                        renderFile()
                    :
                        <span
                            style={{
                                color: Definitions.TEXT_COLOR,
                                fontSize: DEFAULT_SIZES.NORMAL_SIZE
                            }}
                        >
                            { title.toUpperCase() } 
                        </span>
                }
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: Definitions.DEFAULT_PADDING / 2
                }}
            >
                <label
                    htmlFor={ inputId }
                    style={{ display: "flex" }}
                >
                    <IconButton
                        icon={{ class: MdFolder }}
                        style={{ marginRight: Definitions.DEFAULT_PADDING / 2 }}
                    />
                </label>
                <input
                    id={ inputId }
                    style={{ display: "none" }}
                    type="file"
                    onChange={
                        event => {
                            const newFile = event.target.files[0];
                            setFile(newFile);
                            if(onChange) {
                                onChange(newFile);
                            }
                        }
                    }
                    { ...inputProps }
                />
                <IconButton
                    icon={{ class: MdDelete }}
                    onClick={
                        () => {
                            setFile(null);
                            if(onChange) {
                                onChange(null);
                            }
                        }
                    }
                />
            </div>
        </div>
    );
};  