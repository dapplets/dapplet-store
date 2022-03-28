import toast from "react-hot-toast";
import { Notification } from "./Notification";

export const customPromiseToast = async (
	promise: Promise<unknown>,
	hash: string | null,
	messageError?: string,
) => {
	await toast.promise(promise, {
		loading: <Notification hash={hash} type="loading" />,
		success: <Notification hash={hash} type="success" />,
		error: <Notification hash={null} type="error" messageError={messageError} />,
	});
};

export const customErrorToast = (messageError?: string) => {
	toast.error(<Notification hash={null} type="error" messageError={messageError} />, {
		duration: 500000,
	});
};

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