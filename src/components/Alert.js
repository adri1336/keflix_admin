import React from "react";
import Definitions, { DEFAULT_SIZES } from "utils/Definitions";
import Button from "components/Button";

export default (props) => {
    const
        bgColor = props.bgColor || Definitions.PRIMARY_COLOR,
        textColor = props.textColor || Definitions.TEXT_COLOR,
        buttons = props.buttons;

    return (
        <div
            style={{
                minWidth: 300,
                maxWidth: 400,
                minHeight: 100,
                maxHeight: 200,
                borderRadius: 1,
                backgroundColor: bgColor,
                padding: Definitions.DEFAULT_MARGIN
            }}
        >
            <span
                style={{
                    color: textColor,
                    fontSize: DEFAULT_SIZES.NORMAL_SIZE,
                    fontWeight: "bold"
                }}
            >
                Error
            </span>
            <p
                style={{
                    color: textColor,
                    fontSize: DEFAULT_SIZES.NORMAL_SIZE
                }}
            >
                No se ha podido conectar, comprueba que el servidor y las credenciales son correctas.
            </p>
            <Button
                title="Cerrar"
                style={{
                    justifyContent: "flex-end"
                }}
            />
        </div>
    );
}