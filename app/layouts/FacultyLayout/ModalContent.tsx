import { DialogTitle } from "@headlessui/react";
import { Copy } from "lucide-react";

export const ModalContent: React.FC<{
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	userProfileUrl: string;
}> = ({ setIsOpen, userProfileUrl }) => {
	return (
		<>
			<DialogTitle
				as="h3"
				className="text-lg font-medium leading-6 text-gray-900">
				Share Link
			</DialogTitle>
			<div className="mt-2">
				<div className="text-sm text-gray-500">
					<div>
						Sorry, native sharing is not available on your browser.
					</div>
					<div className="flex flex-col gap-2 mt-2">
						<div className="flex items-center gap-2">
							<input
								type="text"
								readOnly
								value={window.location.origin + userProfileUrl}
								className="w-full p-2 border rounded bg-gray-50"
							/>
							<button
								onClick={() =>
									navigator.clipboard.writeText(
										userProfileUrl,
									)
								}
								className="p-2 rounded bg-blue-100 hover:bg-blue-200">
								<Copy size={16} />
							</button>
						</div>
					</div>
					<div>Instead, used this link to share it.</div>
				</div>
			</div>

			<div className="mt-4">
				<button
					type="button"
					className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-sate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
					onClick={() => setIsOpen(false)}>
					Close
				</button>
			</div>
		</>
	);
};
