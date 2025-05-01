import { Mail, Map, Phone, Share2 } from "lucide-react";
import { useState } from "react";
import { FaDirections } from "react-icons/fa";
import { Link } from "react-router";

import ContactUsForm from "./ContactForm";

const ContactPage = () => {
	return (
		<div className="font-roboto w-full">
			<FormSection />
			<LocationSection />
		</div>
	);
};

export default ContactPage;

const locations = [
	{
		name: "Adminstration Block 1",
		address: {
			district: "imphal west",
			state: "manipur",
			country: "india",
			zip: "795001",
			streetAddress: "Takyelpat",
			instituteName: "Manipur Institute of Technology",
		},
		embedUrl:
			"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.175688780775!2d-71.09674028772804!3d42.3600949349783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370aaf51a6a87%3A0xd0e08ea5b308203c!2sMassachusetts%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1745002207957!5m2!1sen!2sin",
	},
	{
		name: "Adminstration Block 2 (Manipur University)",
		address: {
			district: "imphal west",
			state: "manipur",
			country: "india",
			zip: "795001",
			streetAddress: "Canchipur",
			instituteName: "Manipur Institute of Technology",
		},
		embedUrl:
			"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2947.502498145307!2d-71.12082372329357!3d42.37444073419203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e377427d7f0199%3A0x5937c65cee2427f0!2sHarvard%20University!5e0!3m2!1sen!2sin!4v1745004331513!5m2!1sen!2sin",
	},
];

const LocationSection = () => {
	const [currLocIndx, setCurrLocIndx] = useState<number>(0);
	const [locs, setLocs] = useState<(typeof locations)[number][]>(locations);

	return (
		<section
			id="location"
			className="min-h-[100vh] items-center bg-slate-50 lg:p-4 font-roboto w-full p-4 px-0 md:p-0">
			<div className="grid grid-cols-12 items-center md:gap-x-4 lg:py-4 lg:px-1 max-w-7xl mx-auto w-full">
				<div className="lg:col-span-7 col-span-12 h-fit w-full order-1 lg:order-0 py-2 pb-4">
					<iframe
						src={locs[currLocIndx].embedUrl}
						width="600"
						height="450"
						className="border-none shadow-lg outline-none rounded-xl w-full h-[80vh] mx-auto"
						allowFullScreen={true}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"></iframe>
				</div>
				<div className="col-span-full lg:col-span-5 h-fit p-2">
					<h1 className="text-4xl font-thin text-slate-800 mb-4">
						Our Location
					</h1>
					<div className="flex flex-row flex-wrap w-full gap-2">
						{locs.map((loc, i) => (
							<div
								key={i}
								onClick={() => setCurrLocIndx(i)}
								className={`hover:cursor-pointer w-fit max-w-[20rem] border rounded-md hover:shadow-2xl transition ${
									i === currLocIndx
										? "shadow-xl border-slate-400 bg-white"
										: "shadow-md border-slate-300 bg-slate-200"
								} flex flex-row flex-nowrap gap-0 items-center`}>
								<div className="w-full p-2">
									<div className="text-lg font-semibold text-slate-600">
										{loc.name}
									</div>
									<div className="text-sm text-slate-600 capitalize">
										{loc.address.instituteName} <br />
										{loc.address.streetAddress},{" "}
										{loc.address.district} <br />
										{loc.address.state},{" "}
										{loc.address.country} <br />
										{loc.address.zip}
									</div>
								</div>
								<div className="w-[55%] h-full rounded-r-md">
									<img
										src="/image.png"
										alt=""
										className="h-full w-auto object-cover object-center rounded-r-md"
									/>
								</div>
							</div>
						))}
					</div>
					<div className="flex flex-row flex-wrap w-full gap-2 my-2 mt-4">
						<Link
							to="github.com"
							className="inline-flex rounded-md bg-blue-500 p-2 text-slate-50 items-center gap-1">
							<Map size={18} />
							<span>View in Google Map</span>
						</Link>
						<Link
							to="github.com"
							className="inline-flex rounded-md bg-blue-500 p-2 text-slate-50 items-center gap-1">
							<FaDirections size={18} />
							<span>Get Direction</span>
						</Link>
						<Link
							to="github.com"
							className="inline-flex rounded-md bg-blue-500 p-2 text-slate-50 items-center gap-1">
							<Share2 size={18} />
							<span>Share Location</span>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

const FormSection = () => {
	return (
		<section
			id="contact-us"
			className="bg-blue-50 w-full min-h-[80vh] relative pt-10">
			<div className="md:p-4 grid grid-cols-12 lg:gap-x-4 items-center  max-w-7xl mx-auto">
				<div className="lg:col-span-5 xl:col-span-7 col-span-12 flex flex-col justify-center h-full p-2 px-4 md:p-0">
					<ContactUsSection />
				</div>
				<div className="lg:col-span-7 xl:col-span-5 col-span-12">
					{/* Form */}
					<ContactUsForm />
				</div>
			</div>
		</section>
	);
};

export const ContactUsSection = () => {
	return (
		<div>
			<h1 className="text-5xl font-semibold font-roboto text-slate-700 my-2">
				Contact Us
			</h1>
			<div className="text-sm text-slate-600 text-justify my-2 max-w-[24rem]">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error
				sunt quis sed eius harum! Porro, eius ea quam tenetur eum nobis
				natus! Veniam eligendi omnis magni laudantium! Temporibus,
				officia officiis.
			</div>
			<div className="text-sm font-[600] text-slate-900 flex flex-col my-2 gap-y-1">
				<Link
					to={`mailto:dd.com`}
					className="inline-flex gap-x-2 items-center">
					<Mail size={18} />
					<span>iweorw@jioer.ret</span>
				</Link>
				<Link
					to={`tel:9802718902`}
					className="inline-flex gap-x-2 items-center">
					<Phone size={18} />
					<span>+91 9234781290 (9am - 4pm)</span>
				</Link>
			</div>
			<div className="flex flex-wrap w-full justify-start gap-2 my-2">
				<div className="rounded-md shadow-md p-2 border border-orange-300 bg-orange-50 w-[18rem] max-w-full">
					<div className="text-lg font-semibold text-slate-600">
						Feedback and Suggestion
					</div>
					<div className="text-sm text-slate-600">
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Quia perspiciatis consequatur, a facilis explicabo
						nostrum consequuntur
					</div>
				</div>
				<div className="rounded-md shadow-md p-2 border border-slate-300 bg-slate-50 w-[18rem] max-w-full">
					<div className="text-lg font-semibold text-slate-600">
						Feedback and Suggestion
					</div>
					<div className="text-sm text-slate-600">
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Quia perspiciatis consequatur, a facilis explicabo
						nostrum consequuntur
					</div>
				</div>
				<div className="rounded-md shadow-md p-2 border border-green-300 bg-green-50 w-[18rem] max-w-full">
					<div className="text-lg font-semibold text-slate-600">
						Media Enquiries
					</div>
					<div className="text-sm text-slate-600">
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Quia perspiciatis consequatur, a facilis explicabo
						nostrum consequuntur
					</div>
				</div>
			</div>
		</div>
	);
};
