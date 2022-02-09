import toast from "react-hot-toast";
import { Notification } from "./Notification";

export const customToast = (
	hash: string | null,
	type: "success" | "error" = "success",
	messageError?: string,
) => {
	toast(<Notification hash={hash} type={type} messageError={messageError} />, {
		duration: 5000,
		style: {
			maxWidth: 540,
			padding: 0,
			background: "transparent",
			boxShadow: "none",
		},
	});
};
