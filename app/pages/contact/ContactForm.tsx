import { Mail, Phone, Tags, University } from "lucide-react";
import InputGrp from "~/components/InputGrp";
import { CaptchaButton } from "./Captcha";
import { Link } from "react-router";
import type React from "react";
import { useState } from "react";

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (
	props,
) => {
	return (
		<div className="relative">
			<textarea {...props} />
			{props.maxLength && (
				<div className="absolute bottom-4 right-2 w-fit text-sm text-slate-500 bg-slate-50/50 backdrop-blur-md px-1 rounded-md">
					{props.value?.toString().length ?? 0}/{props.maxLength}
				</div>
			)}
		</div>
	);
};

export default function ContactUsForm() {
	const [formData, setFormData] = useState({
		firstName: "",
		surName: "",
		email: "",
		phone: "",
		uniRelation: "",
		enquiryType: "",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
	return (
		<div className="bg-white p-2 py-4 md:p-4 rounded-xl shadow-lg border border-slate-300 relative">
			<h1 className="text-3xl text-slate-600 font-semibold">
				Get in Touch
			</h1>
			<div className="text-sm text-slate-600">
				You can reach us anytime
			</div>

			<div className="mt-4 my-1 text-md text-slate-600">
				<div className="flex flex-row flex-nowrap gap-x-1 my-1">
					<input
						name="firstName"
						value={formData.firstName}
						onChange={handleChange}
						type="text"
						placeholder="First name"
						className="border border-slate-300 rounded-full px-4 py-2 w-full focus:outline-slate-400"
					/>
					<input
						name="surName"
						value={formData.surName}
						onChange={handleChange}
						type="text"
						placeholder="Sur name"
						className="border border-slate-300 rounded-full px-4 py-2 w-full focus:outline-slate-400"
					/>
				</div>
				<div>
					<InputGrp className="my-1 border border-slate-300! rounded-full! gap-x-2 py-2 px-3 text-slate-600 w-full group-focus:outline-slate-400!">
						<>
							<Mail size={18} />
							<input
								name="email"
								value={formData.email}
								onChange={handleChange}
								type="text"
								placeholder="Your email"
								className="w-full outline-none group-focus"
							/>
						</>
					</InputGrp>
				</div>
				<div>
					<InputGrp className="my-1 border border-slate-300! rounded-full! gap-x-2 py-2 px-3 text-slate-600 w-full group-focus:border-amber-500!">
						<>
							<Phone size={18} />
							<input
								name="phone"
								onChange={handleChange}
								value={formData.phone}
								type="text"
								placeholder="Phone number"
								className="w-full outline-none group"
							/>
						</>
					</InputGrp>
				</div>
				<div className="flex flex-row flex-wrap items-center w-full my-2 gap-x-2 text-slate-600">
					<University size={18} />
					<label htmlFor="relation-type" className="text-sm">
						Relation to University:{" "}
					</label>
					<select
						id="relation-type"
						name="uniRelation"
						onChange={handleChange}
						value={formData.uniRelation}
						className="border border-slate-300 rounded-lg px-2 py-2 text-sm">
						<option value="" selected disabled>
							Relation Type
						</option>
						{[
							"Student (Current Student)",
							"student (alumni)",
							"student (other universities)",
							"student (prospective)",
							"parent (current student)",
							"parent (other)",
							"other",
						].map((d, i) => (
							<option value={d} className="capitalize" key={i}>
								{d}
							</option>
						))}
					</select>
				</div>
				<div className="flex flex-row flex-wrap items-center w-full my-2 gap-x-2 text-slate-600">
					<Tags size={18} />
					<label htmlFor="enquiry-type" className="text-sm">
						Nature of Enquiry:{" "}
					</label>
					<select
						id="enquiry-type"
						className="border border-slate-300 rounded-lg px-2 py-2 text-sm"
						name="enquiryType"
						onChange={handleChange}
						value={formData.enquiryType}>
						<option value="" selected disabled>
							Enquiry Type
						</option>
						{[
							"technical",
							"feedback",
							"accessibility",
							"media",
							"information",
							"other",
						].map((d, i) => (
							<option value={d} className="capitalize" key={i}>
								{d}
							</option>
						))}
					</select>
				</div>

				<TextArea
					name="message"
					placeholder="How can we help?"
					value={formData.message}
					onChange={handleChange}
					className="relative resize-none w-full h-[8rem] border border-slate-300 rounded-xl px-4 py-2 focus:outline-slate-400 my-1"
					maxLength={256}
				/>
				{/* <div className="absolute w-full h-full bg-blue-400 top-0 left-0 rounded-xl flex justify-center items-center text-slate-50 ">
            Submited !
            </div> */}
				<div className="w-full mb-2 flex justify-center">
					<CaptchaButton />
				</div>

				<button className="text-slate-50 bg-blue-500 w-full rounded-full text-md py-2 font-roboto hover:cursor-pointer hover:bg-blue-600">
					Submit
				</button>

				<div className="text-[14px] text-slate-400 text-center my-2 max-w-[18rem] mx-auto">
					By contacting us, you agree to our{" "}
					<Link
						to={"github.com"}
						className="hover:underline font-semibold text-slate-500">
						Terms of service{" "}
					</Link>
					and{" "}
					<Link
						to="github.com"
						className="hover:underline font-semibold text-slate-500">
						{" "}
						Privacy policy
					</Link>
				</div>
			</div>
		</div>
	);
}
