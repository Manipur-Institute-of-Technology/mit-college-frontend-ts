import { Link } from "react-router";
import Error from "./error";

const NotFound = () => {
	const MainMssg = <>Hmmm… we can't find that page.</>;
	const SubMssg = (
		<>
			It may have moved or may no longer exist. If you reached this error
			from a link on our site, please leave us{" "}
			<Link to={"github.com"}> feedback</Link>, so we can fix the problem.
			Regardless, let's help you get where you want to go.
		</>
	);

	return (
		<Error errorCode={404} mainMessage={MainMssg} subMessage={SubMssg} />
	);
};

export default NotFound;
