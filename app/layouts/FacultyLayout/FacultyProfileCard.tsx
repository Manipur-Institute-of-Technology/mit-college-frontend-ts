import type { FacultyBasicProfile } from "~/types/api/faculty.type";
import { ModalContent } from "./ModalContent";
import { useModal } from "~/hooks/useModal";
import { DeskProfileCard } from "./DesktopProfileCard";
import { MobileProfileCard } from "./MobileProfileCard";
import moment from "moment";
import { Share2 } from "lucide-react";

export const FacultyProfileCard: React.FC<FacultyBasicProfile> = (props) => {
	const { setIsOpen, ModalComponent } = useModal();
	const Modal = (
		<ModalComponent>
			<ModalContent
				setIsOpen={setIsOpen}
				userProfileUrl={props.userProfileUrl}
			/>
		</ModalComponent>
	);

	return (
		<div className="p-2 w-full text-center font-roboto bg-slate-700 text-slate-200 relative rounded-t-lg">
			{/* Desk */}
			<div className="hidden md:block">
				<DeskProfileCard {...props} />
			</div>
			{/* Mobile */}
			<div className="md:hidden">
				<MobileProfileCard {...props} />
			</div>
			<div className="text-[12px] text-right text-slate-300">
				Last updates at{" "}
				{moment(props.updatedAt).format("D MMM YYYY, HH:mm")}
			</div>

			{/* Share Button */}
			<button
				className="absolute top-4 right-4 rounded-full border p-2 bg-slate-600 hover:cursor-pointer hover:bg-slate-800"
				onClick={async () => {
					try {
						await navigator.share({
							title: `${props.firstName} ${props.lastName}'s Profile`,
							url: props.userProfileUrl,
							text: `Faculty profile of ${props.firstName} ${props.lastName}`,
						});
					} catch (err) {
						console.error("sharing option not available", err);
						setIsOpen(true);
					}
				}}>
				<Share2 size={20} />
			</button>
			{Modal}
		</div>
	);
};
