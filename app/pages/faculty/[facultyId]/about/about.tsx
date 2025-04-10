import Section from "~/components/Section";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import {
	AcademicDegreesSection,
	AcademicPositionsSection,
	NonAcademicPositionsSection,
} from "./Sections";

// export default ({ loaderData }: Pick<Route.ComponentProps, "loaderData">) => {
// 	return <></>;
// };

export default function About(props: FacultyDetailProfile) {
	return (
		<div className="relative w-full font-roboto">
			<Section header="BIO">
				<div
					className="text-slate-600 text-md"
					dangerouslySetInnerHTML={{ __html: props.bio }}
				/>
			</Section>

			<AcademicPositionsSection
				academicPositions={props.academicPositions}
			/>
			<NonAcademicPositionsSection
				nonAcademicPositions={props.nonAcademicPositions}
			/>

			<AcademicDegreesSection academicDegrees={props.academicDegrees} />
		</div>
	);
}
