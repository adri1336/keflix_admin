import React from "react";
import Definitions from "./utils/Definitions";
import Input from "components/Input";
import Checkbox from "components/Checkbox";
import Button from "components/Button";

function App() {
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
			<img
				src={ require("./assets/logo.png") }
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
			>
				<Input
					title="Servidor"
					style={{ width: "100%" }}
				/>
				<Input
					title="Correo electrónico"
					style={{ width: "100%" }}
				/>
				<Input
					title="Contraseña"
					style={{ width: "100%" }}
				/>
				<Checkbox
					title="Recordar credenciales"
					style={{ width: "100%" }}
				/>
				<Button
					title="Iniciar sesión"
					style={{ width: "100%" }}
				/>
			</form>
		</div>
	);
}

export default App;
