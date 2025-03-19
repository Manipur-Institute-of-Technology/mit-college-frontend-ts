import React, { useState, useEffect } from "react";

const Portfolio = () => {
	const [activeSection, setActiveSection] = useState("home");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	useEffect(() => {
		console.log(activeSection);
	}, [activeSection]);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const projects = [
		{
			id: 1,
			title: "Machine Learning Research Assistant",
			description:
				"Developed a novel approach to neural network optimization that improved training efficiency by 23% on benchmark datasets.",
			technologies: ["Python", "TensorFlow", "PyTorch", "Research Methods"],
			image: "/api/placeholder/600/400",
		},
		{
			id: 2,
			title: "Distributed Systems Project",
			description:
				"Implemented a fault-tolerant distributed database system capable of handling 10,000+ transactions per second.",
			technologies: ["Java", "Kafka", "Docker", "Redis"],
			image: "/api/placeholder/600/400",
		},
		{
			id: 3,
			title: "Full-Stack Web Application",
			description:
				"Built an end-to-end web application for academic resource sharing with authentication, real-time updates, and cloud storage.",
			technologies: ["React", "Node.js", "MongoDB", "AWS"],
			image: "/api/placeholder/600/400",
		},
	];

	const skills = [
		{
			category: "Programming Languages",
			items: ["Python", "Java", "JavaScript", "C++", "Go"],
		},
		{
			category: "Web Development",
			items: ["React", "Node.js", "HTML/CSS", "GraphQL", "RESTful APIs"],
		},
		{
			category: "Data Science & ML",
			items: [
				"TensorFlow",
				"PyTorch",
				"Scikit-learn",
				"Pandas",
				"Data Visualization",
			],
		},
		{
			category: "Cloud & DevOps",
			items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
		},
		{
			category: "Tools & Frameworks",
			items: ["Git", "Linux", "Jupyter", "VS Code", "MongoDB"],
		},
	];

	const experiences = [
		{
			title: "Research Assistant",
			company: "University AI Lab",
			period: "Jan 2024 - Present",
			description:
				"Conducting research on reinforcement learning algorithms for autonomous systems. Published 2 conference papers.",
		},
		{
			title: "Software Engineering Intern",
			company: "Tech Solutions Inc.",
			period: "May 2023 - Aug 2023",
			description:
				"Worked on back-end development for a high-traffic web application. Improved API response times by 40%.",
		},
		{
			title: "Teaching Assistant",
			company: "Computer Science Department",
			period: "Sep 2022 - Dec 2023",
			description:
				"Led lab sessions for Data Structures and Algorithms course. Mentored 60+ undergraduate students.",
		},
	];

	const publications = [
		{
			title: "Efficient Neural Network Training Through Dynamic Pruning",
			conference: "International Conference on Machine Learning (ICML)",
			year: "2024",
			link: "#",
		},
		{
			title:
				"A Novel Approach to Distributed Computing in Resource-Constrained Environments",
			conference: "IEEE Symposium on Reliable Distributed Systems",
			year: "2023",
			link: "#",
		},
	];

	const renderSection = () => {
		switch (activeSection) {
			case "home":
				return (
					<div className="flex flex-col md:flex-row items-center justify-between py-16 px-4 md:px-0">
						<div className="md:w-1/2 mb-8 md:mb-0">
							<h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
								Alex Johnson
							</h1>
							<h2 className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-medium mb-6">
								Computer Science Graduate Student
							</h2>
							<p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
								I'm specializing in Machine Learning and Distributed Systems at
								Stanford University. My research focuses on optimizing neural
								networks for edge computing applications.
							</p>
							<div className="flex flex-wrap gap-4">
								<button
									onClick={() => setActiveSection("projects")}
									className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all">
									View Projects
								</button>
								<a
									href="#contact"
									onClick={(e) => {
										e.preventDefault();
										setActiveSection("contact");
									}}
									className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-6 rounded-lg transition-all">
									Contact Me
								</a>
							</div>
						</div>
						<div className="md:w-1/2 flex justify-center">
							<div className="w-64 h-64 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
								<img
									src="/api/placeholder/300/300"
									alt="Alex Johnson"
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					</div>
				);
			case "about":
				return (
					<div className="py-16">
						<h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
							About Me
						</h2>
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
							<p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
								I'm a graduate student in Computer Science at Stanford
								University, specializing in Machine Learning and Distributed
								Systems. My academic journey began with a Bachelor's degree in
								Computer Engineering, where I discovered my passion for solving
								complex computational problems.
							</p>
							<p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
								Currently, I'm researching efficient neural network
								architectures for resource-constrained environments under the
								guidance of Prof. Sarah Chen. My work aims to make advanced AI
								capabilities accessible on edge devices, with applications in
								healthcare and environmental monitoring.
							</p>
							<p className="text-lg text-gray-700 dark:text-gray-300">
								Outside of academics, I'm an active contributor to open-source
								projects and enjoy participating in programming competitions.
								I'm passionate about mentoring junior developers and have
								organized several workshops on machine learning fundamentals.
							</p>
						</div>

						<h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
							Experience
						</h3>
						<div className="space-y-6 mb-10">
							{experiences.map((exp, index) => (
								<div
									key={index}
									className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
									<h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
										{exp.title}
									</h4>
									<div className="flex justify-between items-center mb-2">
										<p className="text-blue-600 dark:text-blue-400 font-medium">
											{exp.company}
										</p>
										<p className="text-gray-500 dark:text-gray-400">
											{exp.period}
										</p>
									</div>
									<p className="text-gray-600 dark:text-gray-300">
										{exp.description}
									</p>
								</div>
							))}
						</div>

						<h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
							Education
						</h3>
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-10">
							<h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
								M.S. in Computer Science
							</h4>
							<div className="flex justify-between items-center mb-2">
								<p className="text-blue-600 dark:text-blue-400 font-medium">
									Stanford University
								</p>
								<p className="text-gray-500 dark:text-gray-400">
									2023 - Present
								</p>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4">
								Specializing in Machine Learning and Distributed Systems. GPA:
								3.9/4.0
							</p>

							<h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6">
								B.S. in Computer Engineering
							</h4>
							<div className="flex justify-between items-center mb-2">
								<p className="text-blue-600 dark:text-blue-400 font-medium">
									University of Washington
								</p>
								<p className="text-gray-500 dark:text-gray-400">2019 - 2023</p>
							</div>
							<p className="text-gray-600 dark:text-gray-300">
								Graduated Summa Cum Laude. Minor in Mathematics. GPA: 3.95/4.0
							</p>
						</div>

						<h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
							Publications
						</h3>
						<div className="space-y-4">
							{publications.map((pub, index) => (
								<div
									key={index}
									className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
									<h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
										{pub.title}
									</h4>
									<p className="text-blue-600 dark:text-blue-400 font-medium">
										{pub.conference}
									</p>
									<p className="text-gray-500 dark:text-gray-400 mb-2">
										{pub.year}
									</p>
									<a
										href={pub.link}
										className="text-blue-600 dark:text-blue-400 hover:underline">
										View Publication
									</a>
								</div>
							))}
						</div>
					</div>
				);
			case "projects":
				return (
					<div className="py-16">
						<h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
							Projects
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{projects.map((project) => (
								<div
									key={project.id}
									className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
									<img
										src={project.image}
										alt={project.title}
										className="w-full h-48 object-cover"
									/>
									<div className="p-6">
										<h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
											{project.title}
										</h3>
										<p className="text-gray-600 dark:text-gray-300 mb-4">
											{project.description}
										</p>
										<div className="flex flex-wrap gap-2 mb-4">
											{project.technologies.map((tech, index) => (
												<span
													key={index}
													className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full">
													{tech}
												</span>
											))}
										</div>
										<button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
											View Details
										</button>
									</div>
								</div>
							))}
						</div>
						<div className="text-center mt-10">
							<a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
								<span className="mr-2">View more projects on GitHub</span>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
						</div>
					</div>
				);
			case "skills":
				return (
					<div className="py-16">
						<h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
							Skills & Expertise
						</h2>
						<div className="space-y-8">
							{skills.map((skillCategory, index) => (
								<div
									key={index}
									className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
									<h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
										{skillCategory.category}
									</h3>
									<div className="flex flex-wrap gap-3">
										{skillCategory.items.map((skill, idx) => (
											<div
												key={idx}
												className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-200">
												{skill}
											</div>
										))}
									</div>
								</div>
							))}
						</div>

						<div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
							<h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
								Certifications
							</h3>
							<ul className="space-y-4">
								<li className="flex items-start">
									<div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-4">
										<svg fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div>
										<p className="font-medium text-gray-800 dark:text-gray-100">
											AWS Certified Solutions Architect
										</p>
										<p className="text-gray-500 dark:text-gray-400">
											Amazon Web Services, 2023
										</p>
									</div>
								</li>
								<li className="flex items-start">
									<div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-4">
										<svg fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div>
										<p className="font-medium text-gray-800 dark:text-gray-100">
											TensorFlow Developer Certificate
										</p>
										<p className="text-gray-500 dark:text-gray-400">
											Google, 2022
										</p>
									</div>
								</li>
								<li className="flex items-start">
									<div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-4">
										<svg fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div>
										<p className="font-medium text-gray-800 dark:text-gray-100">
											Full Stack Web Development
										</p>
										<p className="text-gray-500 dark:text-gray-400">
											Coursera, 2021
										</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
				);
			case "contact":
				return (
					<div className="py-16">
						<h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
							Get In Touch
						</h2>
						<div className="max-w-3xl mx-auto">
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
									<div>
										<h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
											Contact Information
										</h3>
										<div className="space-y-4">
											<div className="flex items-start">
												<div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3">
													<svg
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
														/>
													</svg>
												</div>
												<div>
													<p className="font-medium text-gray-800 dark:text-gray-100">
														Email
													</p>
													<a
														href="mailto:alex.johnson@example.com"
														className="text-blue-600 dark:text-blue-400 hover:underline">
														alex.johnson@example.com
													</a>
												</div>
											</div>
											<div className="flex items-start">
												<div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3">
													<svg
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
														/>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
														/>
													</svg>
												</div>
												<div>
													<p className="font-medium text-gray-800 dark:text-gray-100">
														Location
													</p>
													<p className="text-gray-600 dark:text-gray-300">
														Palo Alto, California
													</p>
												</div>
											</div>
											<div className="flex items-start">
												<div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3">
													<svg
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
														/>
													</svg>
												</div>
												<div>
													<p className="font-medium text-gray-800 dark:text-gray-100">
														LinkedIn
													</p>
													<a
														href="https://linkedin.com"
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 dark:text-blue-400 hover:underline">
														linkedin.com/in/alexjohnson
													</a>
												</div>
											</div>
											<div className="flex items-start">
												<div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3">
													<svg
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
														/>
													</svg>
												</div>
												<div>
													<p className="font-medium text-gray-800 dark:text-gray-100">
														GitHub
													</p>
													<a
														href="https://github.com"
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 dark:text-blue-400 hover:underline">
														github.com/alexjohnson
													</a>
												</div>
											</div>
										</div>
									</div>
									<div>
										<h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
											Send a Message
										</h3>
										<form className="space-y-4">
											<div>
												<label
													htmlFor="name"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
													Name
												</label>
												<input
													type="text"
													id="name"
													className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
												/>
											</div>
											<div>
												<label
													htmlFor="email"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
													Email
												</label>
												<input
													type="email"
													id="email"
													className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
												/>
											</div>
											<div>
												<label
													htmlFor="message"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
													Message
												</label>
												<textarea
													id="message"
													rows={4}
													className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
											</div>
											<button
												type="submit"
												className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
												Send Message
											</button>
										</form>
									</div>
								</div>
							</div>

							<div className="text-center text-gray-600 dark:text-gray-400">
								<p>
									Feel free to reach out if you have any questions or
									opportunities for collaboration.
								</p>
								<p>
									I'm currently available for research collaborations and
									part-time development projects.
								</p>
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div
			className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
			{/* Header */}
			<header className="bg-white dark:bg-gray-800 shadow-md">
				<div className="container mx-auto px-4 py-4">
					<div className="flex justify-between items-center">
						<a href="#" className="text-2xl font-bold text-blue-600">
							Alex Johnson
						</a>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex space-x-8">
							<a
								href="#home"
								onClick={(e) => {
									e.preventDefault();
									setActiveSection("home");
								}}
								className={`font-medium transition-colors ${
									activeSection === "home"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
								}`}>
								Home
							</a>
							<a
								href="#about"
								onClick={(e) => {
									e.preventDefault();
									setActiveSection("about");
								}}
								className={`font-medium transition-colors ${
									activeSection === "about"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
								}`}>
								About
							</a>
							<a
								href="#projects"
								onClick={(e) => {
									e.preventDefault();
									setActiveSection("projects");
								}}
								className={`font-medium transition-colors ${
									activeSection === "projects"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
								}`}>
								Projects
							</a>
							<a
								href="#skills"
								onClick={(e) => {
									e.preventDefault();
									setActiveSection("skills");
								}}
								className={`font-medium transition-colors ${
									activeSection === "skills"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
								}`}>
								Skills
							</a>
							<a
								href="#contact"
								onClick={(e) => {
									e.preventDefault();
									setActiveSection("contact");
								}}
								className={`font-medium transition-colors ${
									activeSection === "contact"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
								}`}>
								Contact
							</a>
						</nav>

						<div className="flex items-center space-x-4">
							{/* Dark mode toggle */}
							<button
								onClick={toggleDarkMode}
								className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none">
								{darkMode ? (
									<svg
										className="w-5 h-5 text-yellow-500"
										fill="currentColor"
										viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										className="w-5 h-5 text-gray-700"
										fill="currentColor"
										viewBox="0 0 20 20">
										<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
									</svg>
								)}
							</button>

							{/* Mobile menu button*/}
						</div>
					</div>
				</div>
			</header>
			{/* BODY */}
			{renderSection()}
		</div>
	);
};

export default Portfolio;
