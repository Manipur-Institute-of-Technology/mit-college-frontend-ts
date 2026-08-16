import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { footerNavigationData } from "~/mock/footer_nav_data";
import { confirmExternalLink } from "~/utils/alert_utils";

const isExternalLink = (href: string) => {
	try {
		const url = new URL(href, window.location.origin);

		return url.origin !== window.location.origin;
	} catch {
		return false;
	}
};

export default function PublicFooter() {
	const handleNavClick = async (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
		target?: string,
	) => {
		// Let normal/internal links work normally
		if (!isExternalLink(href)) {
			return;
		}

		// Stop external navigation until the user confirms
		e.preventDefault();

		const confirmed = await confirmExternalLink();

		if (!confirmed) {
			return;
		}

		if (target === "_blank") {
			window.open(href, "_blank", "noopener,noreferrer");
		} else {
			window.location.href = href;
		}
	};

	return (
		<>
			<footer className="w-full bg-slate-900 text-slate-100">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
						{/* Institute Information */}
						<div className="relative w-full py-2 text-center md:w-auto md:text-left lg:border-r lg:border-r-slate-600 lg:pr-8">
							<div className="flex justify-center md:justify-start">
								<img
									src="/Manipur_University_Logo1.png"
									alt="Manipur University Logo"
									className="block"
									style={{
										width: 100,
										height: "auto",
									}}
								/>
							</div>

							<div className="py-2 text-sm">
								<div className="text-center text-lg font-bold text-slate-50 md:text-left">
									Manipur Institute of Technology
								</div>

								<div className="mt-1 text-center md:text-left">
									<p className="text-slate-100">
										(A Constitute College of Manipur University)
									</p>

									<p className="text-slate-300">
										Takyelpat, Imphal - 795001, Manipur, India
									</p>
								</div>
							</div>
						</div>

						{/* Footer Navigation */}
						<div className="grid w-full grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-2 md:text-left lg:grid-cols-4">
							{footerNavigationData.map((section) => (
								<div key={section.title} className="py-1">
									<div className="mb-2 text-lg font-semibold text-slate-50">
										{section.title}
									</div>

									<ul className="list-none space-y-1 text-sm">
										{section.links.map((link) => (
											<li key={link.name}>
												<a
													href={link.href}
													target={link.target}
													rel={
														link.target === "_blank"
															? "noopener noreferrer"
															: undefined
													}
													onClick={(e) =>
														handleNavClick(
															e,
															link.href,
															link.target,
														)
													}
													className="text-slate-300 transition-colors duration-200 hover:text-white hover:underline"
												>
													{link.name}
												</a>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>
			</footer>

			<BottomBar />

			<div className="h-2 w-full bg-yellow-200 bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500 animate-gradient-bg" />
		</>
	);
}

function BottomBar() {
	const handleSocialClick = async (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
		target?: string,
	) => {
		// Ignore placeholder links such as "#"
		if (!href || href === "#") {
			return;
		}

		if (!isExternalLink(href)) {
			return;
		}

		e.preventDefault();

		const confirmed = await confirmExternalLink();

		if (!confirmed) {
			return;
		}

		if (target === "_blank") {
			window.open(href, "_blank", "noopener,noreferrer");
		} else {
			window.location.href = href;
		}
	};

	return (
		<div className="w-full bg-slate-950">
			<div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-4 px-4 py-3 text-sm text-slate-300 sm:px-6 md:flex-row lg:px-8">
				{/* Copyright */}
				<div className="text-center md:text-left">
					Copyright &#169; {new Date().getFullYear()} @ Manipur Institute of
					Technology
					<br />
					All Rights Reserved
				</div>

				{/* Social Media */}
				<div className="space-y-1 text-center md:text-right">
					<div>Follow us on:</div>

					<div className="flex items-center justify-center space-x-3 py-1 md:justify-end">
						<a
							href="#"
							aria-label="Facebook"
							onClick={(e) => handleSocialClick(e, "#")}
							className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-800 hover:text-white"
						>
							<FaFacebook size={18} />
						</a>

						<a
							href="#"
							aria-label="Instagram"
							onClick={(e) => handleSocialClick(e, "#")}
							className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-800 hover:text-white"
						>
							<FaInstagram size={18} />
						</a>

						<a
							href="#"
							aria-label="LinkedIn"
							onClick={(e) => handleSocialClick(e, "#")}
							className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-800 hover:text-white"
						>
							<FaLinkedin size={18} />
						</a>

						<a
							href="#"
							aria-label="LinkedIn"
							onClick={(e) => handleSocialClick(e, "#")}
							className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-800 hover:text-white"
						>
							<FaLinkedin size={18} />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}