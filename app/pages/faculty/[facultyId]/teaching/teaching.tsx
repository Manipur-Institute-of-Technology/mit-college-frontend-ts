import React from "react";
import Section from "~/components/Section";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import { CourseCard } from "./CourseCard";

const Teaching: React.FC<Pick<FacultyDetailProfile, "teachings">> = ({
	teachings,
}) => {
	return (
		<div className="relative w-full font-roboto">
			<Section header="teaching interests">
				<div className="flex flex-row flex-wrap gap-2">
					{teachings.teachingInterests}
				</div>
			</Section>

			<Section header="taught courses">
				<div className="flex flex-row flex-wrap gap-2 justify-center">
					{teachings.taughtCourses.map((course, idx) => (
						<CourseCard key={idx} {...course} />
					))}
				</div>
			</Section>
		</div>
	);
};

export default Teaching;
