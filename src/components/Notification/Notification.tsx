import React, { FC } from "react";
import "./Notification.scss";
import { ReactComponent as CheckError } from "./check-erorr.svg";
import { ReactComponent as Loader } from "./loader.svg";
import cn from "classnames";
import { net } from "../../api/consts";

interface SuccessToastProps {
	hash: string | null;
	type: "success" | "error";
	messageError?: string;
}

export const Notification: FC<SuccessToastProps> = ({ hash, type, messageError }) => {
	const network = net;

	const isSuccess = type === "success";
	const icon = isSuccess ? (
		<Loader className="notification-custom-animate" />
	) : (
		<CheckError stroke="#A6253C" />
	);

	const message = messageError ? messageError : isSuccess ? "Transaction started" : "An error has occurred!";

	return (
		<div
			className={cn("notification-custom-wrapper", {
				"notification-custom-error": type === "error",
			})}
		>
			<header className="notification-custom-header">
				{messageError && isSuccess ? <></> : icon}
				<h4>{message}</h4>
			</header>
			<p className="notification-custom-text">
				{hash && hash.length > 0 && (
					<React.Fragment>
						You can track your transaction here:
						<a
							href={`https://${network?.toLowerCase()}.etherscan.io/tx/${hash}`}
							className="notification-custom-link"
							target="_blank" rel="noreferrer"
						>
							https://{network?.toLowerCase()}.etherscan.io/tx/{hash}
						</a>
					</React.Fragment>
				)}

				{/* {!isSuccess && <span className="notification-custom-text-error">{messageError}</span>} */}
			</p>
		</div>
	);
};
