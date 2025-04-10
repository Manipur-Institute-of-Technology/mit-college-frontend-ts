import { ChevronDown } from "lucide-react";
import { Link } from "react-router";

export default function CMSHome() {
	// TODO: Check user is login and redirect to the dashboard
	return (
		<>
			<div className="font-semibold text-4xl my-2 text-slate-700 font-poppins text-center w-full">
				MIT Content Management System
			</div>
			<div className="w-full min-h-[80vh] flex flex-col justify-center items-center">
				<div className="w-full md:flex md:flex-row md:flex-nowrap justify-around items-center my-4">
					<div className="relative w-fit md:m-0 m-auto md:w-max">
						<img
							src="/Manipur_University_Logo1.png"
							alt="Manipur Manipur University logo"
							className="w-[18rem] max-w-[100vw] contrast-75"
						/>
					</div>
					<div className="font-poppins p-1 text-center text-slate-700 md:max-w-[24rem] md:w-fit w-full">
						{/* <div className="font-semibold text-2xl my-2">
						MIT Content Management System
					</div> */}
						<div className="font-poppins text-slate-500 text-md">
							An open-source content management system for Manipur
							Institute of Technology
						</div>
						<div className="flex flex-col items-center w-full px-2 gap-y-4 py-2 my-2">
							<Link to="/cms/signin">
								<button className="block border border-blue-500 bg-blue-500 hover:bg-blue-600 text-slate-50 text-lg text-semibold p-2 rounded-lg w-[14rem] transition-all">
									Sign In
								</button>
							</Link>
							<Link to="/cms/signup">
								<button className="block border border-blue-500  text-blue-500 hover:text-slate-50 hover:bg-blue-500 text-lg text-semibold p-2 rounded-lg w-[14rem] transition-all">
									Sign Up
								</button>
							</Link>
						</div>
						<Link to="/cms/forgotpass">
							<div className="my-2 text-sm text-blue-400 underline">
								Forgot Password?
							</div>
						</Link>
					</div>
				</div>
				<div className="relative w-full text-center my-8 hover:cursor-pointer">
					<div className="relative inline-block l-[50%] px-4 py-2 font-poppins rounded-lg font-light bg-gray-200 text-black w-fit">
						About MIT CMS{" "}
						<ChevronDown
							size={18}
							className="inline-block animate-bounce"
						/>
					</div>
				</div>
			</div>
			<hr className="border border-slate-300 w-8/12 mx-auto" />
		</>
	);
}
