import React, { useEffect, useRef, useState } from "react";
import "./captchaLoaderAnim.css";
import { sleep } from "~/utils/util";
import { Link } from "react-router";
import {
	Check,
	Dot,
	Headphones,
	Info,
	RefreshCcw,
	RefreshCcwIcon,
	Square,
	X,
} from "lucide-react";
import { useXFetcher } from "~/hooks/useXFetcher";

interface CaptchaProblem {
	hash: string;
	type: number;
	issueAt: string;
	expAt: string;
	problemStatement: string;
	imageB64: string; // captcha image as base 64
}

interface CaptchaSoln {
	type: number;
	hash: string;
	soln: string;
}

interface CaptchaSolnResponse {
	success: boolean;
	message: string;
	error: boolean;
	refetch: boolean;
}

const mockGetCaptchaPrblm = async (): Promise<CaptchaProblem> => {
	await sleep(2000); // simulate fetching problem from backend
	const rand = Math.random();
	const dur = 50 * 1000; // 5 seconds

	let imgB64: string;
	let hash: string;

	if (rand < 0.5) {
		const res = await fetch("/mock/captchaImgB64.txt");
		imgB64 = await res.text();
		hash = "uio324";
	} else {
		const res = await fetch("/mock/captchaImgB641.txt");
		imgB64 = await res.text();
		hash = "ejk12";
	}

	return {
		hash,
		problemStatement: "Enter the characters seen in the image below",
		type: 0,
		issueAt: new Date().toString(),
		expAt: new Date(Date.now() + dur).toString(),
		imageB64: imgB64,
	};
};

const mockCheckCaptchaSoln = async (
	soln: CaptchaSoln,
): Promise<CaptchaSolnResponse> => {
	// TODO: Take care for the case: if its a network problem, do not try refetching problem when there is error
	// If no network error is present, refetch another new soln by return refetch: true

	await sleep(4000);
	if (soln.hash === "uio324" && soln.soln === "12") {
		return {
			success: true,
			message: "Challenge Successfully solved",
			refetch: false,
			error: false,
		};
	} else if (soln.hash === "ejk12" && soln.soln === "12") {
		return {
			success: true,
			message: "Challenge Successfully solved",
			refetch: false,
			error: false,
		};
	} else {
		return {
			success: false,
			message: "Wrong Solution provided, fetching another solution",
			refetch: true,
			error: true,
		};
	}
};

const CaptchaLoaderIcon: React.FC<{ size: number; className?: string }> = ({
	size,
	className = "",
}) => {
	return (
		<div
			className={
				`rounded-full relative border-4 border-r-transparent! captchaLoaderColorAnim ` +
				className
			}
			style={{ width: size, height: size }}
		/>
	);
};

export const CaptchaButton: React.FC<{}> = () => {
	// const [cptPrblm, setCptPrblm] = useState<CaptchaProblem | null>(null);
	// const [captchaState, setCaptchaState] = useState<"loading" | "idle">("idle");
	const [isSolve, setIsSolve] = useState(false);
	const [cptModalViz, setCptModalViz] = useState(false);
	const [displyTxt, setDisplyTxt] = useState<string>("I'm not a robot");

	const {
		data: cPData,
		state: cPState,
		error: cPError,
		xFetch: xFetchCP,
	} = useXFetcher<CaptchaProblem>();
	const {
		data: cSData,
		state: cSState,
		error: cSError,
		xFetch: xFetchCS,
		reset,
	} = useXFetcher<CaptchaSolnResponse>();

	const fetchCaptchaProblem = async () => {
		// setCaptchaState("loading");
		setDisplyTxt("Fetching problem");
		try {
			xFetchCP(mockGetCaptchaPrblm);
			// const cPrblm = await mockGetCaptchaPrblm();
			// setCptPrblm(cPrblm);
			setCptModalViz(true);
		} catch (err) {
			console.error("captcha problem fetch error", err);
		} finally {
			// setCaptchaState("idle");
			setDisplyTxt("I'm not a robot");
		}
	};

	const submitSoln = async (soln: CaptchaSoln) => {
		setDisplyTxt("Analysing Solution");
		// reset();
		try {
			xFetchCS(async () => await mockCheckCaptchaSoln(soln));
		} catch (err) {
			console.error("Error checking captcha soln: ", err);
		} finally {
			setDisplyTxt("I'm not a robot");
		}
	};

	useEffect(() => {
		if (cSData && cSData.success) {
			setIsSolve(true);
		}
	}, [cSData]);

	return (
		<div className="border border-slate-300 rounded-md w-fit text-center p-2 flex items-center gap-2 shadow-sm bg-linear-30 relative transition">
			{cPState === "loading" || cSState === "loading" ? (
				<div className="animate-spin w-fit">
					<CaptchaLoaderIcon size={20} />
				</div>
			) : !isSolve ? (
				<Square
					size={20}
					onClick={fetchCaptchaProblem}
					className="hover:cursor-pointer"
				/>
			) : (
				<Check size={20} className="stroke-blue-500 stroke-2" />
			)}

			{/* <div className="text-md font-roboto">I'm not a robot</div> */}
			<div className="text-md font-roboto">{displyTxt}</div>

			<div className="text-sm text-blue-400 font-semibold flex flex-col">
				<div className="text-sm text-blue-400 font-semibold">
					Captcha
				</div>

				<div className="inline-flex items-center text-[8px] text-slate-400 gap-0 font-thin">
					<Link to={"/privacy"}>Privacy</Link>
					<Dot size={12} className="p-0 m-0" />
					<Link to={"policy"}>Terms</Link>
				</div>
			</div>
			{cptModalViz && cPData && (
				<CaptchaModal
					modalViz={cptModalViz}
					setModalViz={setCptModalViz}
					submitSoln={submitSoln}
					// setCptPrblm={setCptPrblm}
					cptPrblm={cPData}
					cptSolRes={cSData}
					loadPrblm={fetchCaptchaProblem}
					isCptProblmLoading={cPState === "loading"}
					isCptSolnLoading={cSState === "loading"}
				/>
			)}
		</div>
	);
};

const CaptchaModal: React.FC<{
	modalViz: boolean;
	setModalViz: React.Dispatch<React.SetStateAction<boolean>>;
	cptPrblm: CaptchaProblem;
	cptSolRes: CaptchaSolnResponse | undefined;
	// setCptPrblm: React.Dispatch<React.SetStateAction<CaptchaProblem | null>>;
	submitSoln: (soln: CaptchaSoln) => void;
	loadPrblm: () => void;
	isCptProblmLoading: boolean;
	isCptSolnLoading: boolean;
}> = ({
	modalViz,
	setModalViz,
	loadPrblm,
	cptPrblm,
	cptSolRes,
	submitSoln,
	isCptSolnLoading,
	isCptProblmLoading,
}) => {
	const [disabledAllBtn, setDisabledAllBtn] = useState<boolean>(false);
	const [solnInp, setSolnInp] = useState<string>("");
	const [isExp, setIsExp] = useState<boolean>(
		new Date(cptPrblm.expAt).getTime() < Date.now(),
	);
	const [solnRes, setSolnRes] = useState<CaptchaSolnResponse>();
	const intvIdRef = useRef<number | null>(null);

	if (!modalViz) return null;

	useEffect(() => {
		setIsExp(false);
		intvIdRef.current = window.setInterval(() => {
			setIsExp(new Date(cptPrblm.expAt).getTime() < Date.now());
		}, 1000);
		return () => {
			intvIdRef.current && window.clearInterval(intvIdRef.current);
		};
	}, [cptPrblm]);

	useEffect(() => {
		const expDate = new Date(cptPrblm.expAt);
		// check current problem is expired
		if (new Date().getTime() > expDate.getTime()) {
			loadPrblm(); // load new problem
		}
	}, []);

	useEffect(() => {
		console.log("sol: ", cptSolRes);
		if (cptSolRes) {
			// refetch another problem if there is error
			if (!cptSolRes.success && cptSolRes.refetch) {
				console.log("refetching another problem");
				loadPrblm();
			} else if (cptSolRes.success) {
				setDisabledAllBtn(true);
				// Hide the captcha modal after 1 second
				setTimeout(() => {
					setModalViz(false);
					setDisabledAllBtn(false);
				}, 1000);
			}
		}
	}, [cptSolRes]);

	const submitHandler = () => {
		// Stop SetInterval
		intvIdRef.current && window.clearInterval(intvIdRef.current);
		submitSoln({
			type: cptPrblm.type,
			hash: cptPrblm.hash,
			soln: solnInp,
		});
	};

	return (
		<>
			<div
				className="fixed z-0 w-screen h-screen top-0 left-0 bg-slate-50/50 backdrop-blur-sm"
				onClick={() => {
					console.log("lll");
				}}></div>
			<div className="absolute z-2 top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] w-[18rem] h-[10rem] max-w-screen max-h-screen rounded-md shadow-md bottom-full">
				<div className="relative bg-slate-100 border border-slate-300 rounded-md">
					<div className="bg-blue-500 text-sm text-slate-50 text-left rounded-t-md w-full grid grid-cols-12">
						<div className="col-span-11 p-4 pr-0">
							{cptPrblm.problemStatement}
						</div>
						<button
							className="col-span-1 relative hover:cursor-pointer"
							onClick={() => setModalViz(false)}>
							<X
								size={24}
								className="absolute top-[50%] -translate-y-[70%] right-1"
							/>
						</button>
					</div>

					<div className="py-2">
						{isCptProblmLoading && (
							<div className="bg-blue-50 text-blue-500 text-[12px]">
								Loading, new Captcha Problem
							</div>
						)}
						{isCptSolnLoading && (
							<div className="bg-blue-50 text-blue-500 text-[12px]">
								Analysing Captcha solution
							</div>
						)}

						{cptSolRes &&
							(!cptSolRes.success ? (
								<div className="w-full text-rose-600 bg-rose-50 text-[12px] pb-1">
									Wrong solution provided!{" "}
									{cptSolRes.refetch &&
										isCptProblmLoading &&
										"Refetching new problem"}
								</div>
							) : (
								<div className="w-full text-blue-500 bg-blue-50 text-[12px] pb-1">
									{cptSolRes.message}
								</div>
							))}

						{isExp && (
							<div className="w-full text-rose-600 bg-rose-50 text-[12px] pb-1">
								Problem expired, please refetch it
							</div>
						)}
						<div
							className={`rounded-md w-full bg-slate-50 ${isExp && "border border-rose-400"}`}>
							<img
								src={cptPrblm.imageB64}
								alt="mock captcha"
								className="rounded-md mx-auto w-full max-h-[10rem]"
							/>
						</div>
					</div>

					<div className="w-full px-1">
						<input
							value={solnInp}
							onChange={(e) => setSolnInp(e.target.value)}
							type="text"
							placeholder="Enter text"
							className={`w-full rounded-md text-md border  p-1 bg-white focus:outline-slate-400 font-roboto text-slate-700 ${isExp ? "border-rose-400" : "border-slate-300"}`}
						/>
					</div>
					<div className="inline-flex justify-between items-center w-full px-2 my-2">
						<div className="inline-flex gap-1">
							<button
								disabled={disabledAllBtn || isCptProblmLoading}
								onClick={loadPrblm}
								className={`border border-slate-300 rounded-md p-1 hover:border-slate-400 hover:cursor-pointer ${isExp && "bg-green-200"} disabled:cursor-not-allowed`}>
								<RefreshCcwIcon
									size={18}
									className={`${isCptProblmLoading && "[animation:spin_1s_linear_infinite_reverse]"}`}
								/>
							</button>
							<button
								className="border border-slate-300 rounded-md p-1 hover:border-slate-400 hover:cursor-pointer disabled:cursor-not-allowed"
								disabled={disabledAllBtn}>
								<Headphones size={18} />
							</button>
							<button
								className="border border-slate-300 rounded-md p-1 hover:border-slate-400 hover:cursor-pointer disabled:cursor-not-allowed"
								disabled={disabledAllBtn}>
								<Info size={18} />
							</button>
						</div>
						<button
							onClick={submitHandler}
							className={`border py-1 px-2 rounded-sm text-slate-50 bg-blue-500 uppercase text-sm hover:cursor-pointer hover:bg-blue-600 disabled:cursor-not-allowed`}
							disabled={
								isExp ||
								solnInp.length === 0 ||
								isCptProblmLoading ||
								isCptSolnLoading ||
								disabledAllBtn
							}>
							Submit
						</button>
					</div>
					<div className="text-[10px] inline-flex justify-between w-full px-1 font-roboto">
						<div>
							Exp: {new Date(cptPrblm.expAt).toLocaleString()}
						</div>
						<div>
							Problem Hash:
							<span className="font-mono">{cptPrblm.hash}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
