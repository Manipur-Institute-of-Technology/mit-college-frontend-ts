const http = require("http");

const mockRoutes = [
	{ routes: "/dept/cse", contentId: "rand_cse_dep" },
	{ routes: "admin/principal", contentId: "rand_principal_dep" },
	{ routes: "admin/exam", contentId: "rand_exam_dep" },
];

const server = http.createServer((req, res) => {
	// Enable CORS
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.url === "/api/routes" && req.method === "GET") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(mockRoutes));
	} else {
		res.writeHead(404);
		res.end("Not Found");
	}
});

const port = 3001;
server.listen(port, () => {
	console.log(`Mock server running at http://localhost:${port}`);
});
