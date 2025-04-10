import React from "react";

export default React.memo(() => {
	return (
		<div className="w-full bg-slate-800 text-slate-200 text-center text-sm py-2 relative border-t border-t-slate-600">
			Built with <span className="text-rose-600">&#9829;</span> by MIT
		</div>
	);
});
