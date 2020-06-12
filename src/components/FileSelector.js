import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import IconButton from "components/IconButton";
import { MdFileDownload, MdFolder, MdDelete } from "react-icons/md";

const { ipcRenderer } = window.require("electron");

export default ({ inputId, title, file, initial, inputProps, onChange }) => {
    const
        [selectedFile, setSelectedFile] = React.useState(file || null),
        [initialInfo, setInitialInfo] = React.useState(initial || null);

    if(initialInfo && initialInfo.hasOwnProperty("date")) {
        React.useEffect(() => {
            if(initial.hasOwnProperty("date") && initial.date !== initialInfo.date) {
                setInitialInfo(initial);
                setSelectedFile(null);
            }
        }, [initial, initialInfo.date]);
    }

    const renderFile = () => {
        if(!selectedFile && initialInfo) {
            const { url, type } = initialInfo;
            if(type.includes("image")) {
                return (
                    <img
                        alt="fileSelector"
                        src={ url }
                        style={{
                            width: "100%",
                            height: "100%",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain"
                        }}
                        tabIndex={ -1 }
                    />
                );
            }
            else if(type.includes("video")) {
                return (
                    <video
                        src={ url }
                        controls={ true }
                        autoPlay={ false }
                        style={{
                            width: "100%",
                            height: "100%",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "cover"
                        }}
                        tabIndex={ -1 }
                        type="video/mp4"
                    />
                );
            }
            else {
                return <div/>;
            }
        }

        if(selectedFile.type.includes("image")) {
            return (
                <img
                    alt="fileSelector"
                    src={ URL.createObjectURL(selectedFile) }
                    style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain"
                    }}
                    tabIndex={ -1 }
                />
            );
        }
        else if(selectedFile.type.includes("video")) {
            return (
                <video
                    src={ URL.createObjectURL(selectedFile) }
                    controls={ true }
                    autoPlay={ false }
                    style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover"
                    }}
                    tabIndex={ -1 }
                    type="video/mp4"
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
                    (selectedFile || (initialInfo && initialInfo.url)) ?
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
                {
                    (!selectedFile && initialInfo && initialInfo.url) &&
                    <IconButton
                        icon={{ class: MdFileDownload }}
                        style={{ marginRight: Definitions.DEFAULT_PADDING / 2 }}
                        onClick={
                            () => {
                                ipcRenderer.send("download-file", {
                                    url: initialInfo.url
                                });                    
                            }
                        }
                    />
                }
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
                            setSelectedFile(newFile);
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
                            if(initialInfo && initialInfo.url !== null) {
                                setInitialInfo({ ...initialInfo, url: null });
                                if(onChange) {
                                    onChange(null);
                                }
                            }
                            else if(selectedFile !== null) {
                                setSelectedFile(null);
                                if(onChange) {
                                    onChange(null);
                                }
                            }
                        }
                    }
                />
            </div>
        </div>
    );
};  