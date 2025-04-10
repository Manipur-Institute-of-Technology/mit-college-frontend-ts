import { FaOrcid } from "react-icons/fa";
import { socialIconMap } from "~/constants/socialIconMap";
import type { FacultyBasicProfile } from "~/types/api/faculty.type";
import { capitalizeString, capitalizeWords } from "~/utils/format";

export const MobileProfileCard: React.FC<FacultyBasicProfile> = (props) => {
	return (
		<>
			<div className="rounded-full size-[10rem] mx-auto my-1 border border-slate-500">
				{props.avatarUrl ? (
					<img
						src={props.avatarUrl}
						alt={`Profile photo of ${props.firstName} ${props.lastName}`}
						className="rounded-full size-[10rem]"
					/>
				) : (
					// TODO: instead of initial, used a generic profile image
					<div className="rounded-full size-[10rem] border text-4xl relative border-amber-500">
						<div className="translate-[-50%] top-[50%] left-[50%] border border-green-500 w-fit relative">
							MK
						</div>
					</div>
				)}
			</div>
			<div>
				<div className="text-2xl text-slate-50 font-bold">
					{capitalizeString(props.initial)} {props.firstName}{" "}
					{props.lastName}
				</div>
				<div>
					{/* TODO: Add nonacademic position on mobile card also */}
					{props.positions.academic.map((d, i) => (
						<div key={i}>
							<span className="text-xl font-semibold text-slate-100">
								{capitalizeWords(d.position)}
							</span>
							<br />
							{d.department && (
								<>
									<span className="text-[1.1rem] font-semibold text-slate-200">
										Department of {d.department}
									</span>
									<br />
								</>
							)}
							<span className="text-md font-semibold text-slate-200">
								{d.institution.organisation}
							</span>
							<br />
							<span className="text-md text-slate-300">
								{d.institution.city}, {d.institution.state},{" "}
								{d.institution.country}
							</span>
						</div>
					))}
				</div>
			</div>
			{props.orchidId && (
				<div className="inline-flex w-full justify-center gap-x-2 my-2 border-t border-b py-2 border-dashed">
					<FaOrcid size={24} />{" "}
					<div className="text-md">{props.orchidId}</div>
				</div>
			)}
		</>
	);
};
