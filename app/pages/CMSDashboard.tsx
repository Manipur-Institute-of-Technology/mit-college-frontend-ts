// import userRoutes from "../mock/userRoute.json";
// import delayFetcher from "../utils/delayFetcher";

export default function CMSDashboard() {
  // const f = async () => {
  // const d = () => userRoutes;
  // const d = () => fetch("/manifest.json");
  // const res = await delayFetcher(d, 3000);
  // console.log(await res);
  // };
  return (
    <div>
      <header className="bg-white shadow w-full">
        <div className="p-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="w-full p-4">
          <h1>This is dashboard</h1>
        </div>
      </main>
    </div>
  );
}
