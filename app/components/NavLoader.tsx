import { useNavigation } from "react-router";

import "./shared/anim.css";

export default function NavLoader() {
	const nav = useNavigation();

	return nav.state !== "idle" ? (
		<>
			<div className="w-full h-0.5 bg-blue-100 relative overflow-clip">
				<div className="relative w-sm h-full bg-blue-400 animate-shrink-ltr"></div>
			</div>
			<div className="fixed w-screen h-screen bg-slate-500/50 z-50"></div>
		</>
	) : null;
}
