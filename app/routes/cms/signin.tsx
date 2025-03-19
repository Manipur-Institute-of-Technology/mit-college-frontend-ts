import { useState } from "react";
import { Link } from "react-router";

export default () => {
	const [userType, setUserType] = useState<"faculty" | "admin">("faculty");
	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Manipur Institute of Technology"
						src="/Manipur_University_Logo1.png"
						className="mx-auto h-[14rem] w-auto contrast-75"
					/>
					<h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
						Sign in to your account
					</h2>
				</div>

				<div className="text-center my-2">
					<div className="w-fit mx-auto rounded-md border border-blue-400 bg-blue-50">
						<button
							onClick={() => setUserType("faculty")}
							className={`p-2 font-bold rounded-l-md w-[8rem] hover:cursor-pointer border-r-0 ${
								userType === "faculty" ? "bg-blue-400 text-white" : "text-black"
							}`}>
							Faculty
						</button>
						<button
							onClick={() => setUserType("admin")}
							className={`p-2 font-bold rounded-r-md w-[8rem] hover:cursor-pointer  border-l-0 ${
								userType === "admin" ? "bg-blue-400 text-white" : "text-black"
							}`}>
							Admin
						</button>
					</div>
				</div>

				<div className="text-center mt-4">
					You are logging in as{" "}
					<span className="font-bold text-blue-500">
						{userType.toLocaleUpperCase()}
					</span>
				</div>

				<div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
					<form action="#" method="POST" className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm/6 font-medium text-gray-900">
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm/6 font-medium text-gray-900">
									Password
								</label>
								<div className="text-sm">
									<Link
										to="/cms/forgotpass"
										className="font-semibold text-blue-600 hover:text-blue-500">
										Forgot password?
									</Link>
								</div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
								Sign in
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Don't have an account?{" "}
						<Link
							to="/cms/signup"
							className="font-semibold text-blue-600 hover:text-blue-500">
							Create one
						</Link>
					</p>
				</div>
			</div>
		</>
	);
};
