import React, { Suspense } from "react";
import { Await } from "react-router";
import type { FacultyBasicProfile } from "~/types/api/faculty.type";
import { Outlet } from "react-router";
import { FacultyBasicProfileDataContext } from "~/context/FacultyBasicProfileDataContext";
import generateService from "~/service/Service";
import { NavTabs } from "./NavTabs";
import { ContactTabContainer } from "./ContactTabContainer";
import { FacultyProfileCard } from "./FacultyProfileCard";
import type { Route } from "./+types/FacultyLayout";

export const clientLoader = ({ params }: Route.ClientLoaderArgs) => {
	// TODO: Test with non existent or invalid ID
	// TODO: refactor, suspense, errBoundary components
	// Create a generic component that can handle suspense, err, and design in a way that we can inject
	// the template to be displayed in different scenarios (like invalid URL, not found Profile)
	//make the generic component have a default template also
	try {
		const { facultyId } = params;
		if (facultyId) {
			// TODO: Decode B66 encoded string here
			// const basicProfile = getFacultyBasicProfile(facultyId);
			const basicProfile =
				generateService().getFacultyBasicProfile(facultyId);
			return { data: basicProfile };
		}
		throw new Error(
			`faculty id in path is not defined: ${window.location.href}`,
		);
	} catch (err) {
		console.error(err);
		return { error: err };
	}
};

export default ({ loaderData }: Route.ComponentProps) => {
	const { data, error } = loaderData;

	if (error) {
		return <div className="text-black">An error occur</div>;
	}
	return (
		<div>
			<Suspense fallback={<>Loading...</>}>
				<Await resolve={data}>
					{(val) => val && <FacultyLayout {...val} />}
				</Await>
			</Suspense>
		</div>
	);
};

const FacultyLayout: React.FC<FacultyBasicProfile> = (props) => {
	return (
		<FacultyBasicProfileDataContext.Provider value={props}>
			<div className="w-full">
				<FacultyProfileCard {...props} />
				<ContactTabContainer {...props} />
				<NavTabs {...props} />
				<Outlet />
			</div>
		</FacultyBasicProfileDataContext.Provider>
	);
};
