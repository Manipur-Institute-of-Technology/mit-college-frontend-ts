import { useEffect } from "react";
import useCustomRoute from "~/context/CustomRoutesContext";
import type { Route } from "./+types/page";
import { useLocation } from "react-router";

export default ({ matches }: Route.ComponentProps) => {
  const r = useCustomRoute();
  const loc = useLocation();
  console.log(matches);

  useEffect(() => {
    if (r.data && r.state === "idle" && !r.error && r.isRouteDataLoaded) {
      console.log(r.data);
      console.log(r.getContentId(loc.pathname));
    } else console.log("no data");
  }, [r.data]);

  return <div>This is a test page</div>;
};
