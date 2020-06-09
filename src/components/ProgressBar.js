import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import { MdCheck } from "react-icons/md";

export default (props) => {
    const
        height = props.height || 10;

    const [progress, setProgress] = React.useState(props.value || 0);

    React.useEffect(() => {
        setProgress(props.value);
    }, [props.value]);

    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                height: height,
                maxHeight: height
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    backgroundColor: Definitions.PLACEHOLDER_COLOR,
                    marginRight: Definitions.DEFAULT_PADDING / 2,
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: progress + "%",
                        height: "100%",
                        backgroundColor: Definitions.SECONDARY_COLOR
                    }}
                />
            </div>
            {
                progress >= 100 ?
                    <MdCheck
                        color={ Definitions.TEXT_COLOR }
                        size={ DEFAULT_SIZES.NORMAL_SIZE }
                    />
                :
                    <span
                        style={{
                            color: Definitions.TEXT_COLOR,
                            fontSize: DEFAULT_SIZES.MEDIUM_SIZE
                        }}
                    >
                        { progress + "%" }
                    </span>  
            }
        </div>
    );
};