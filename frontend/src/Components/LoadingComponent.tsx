import React, { FC } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const Loading: FC = () => {
	return (
		<div id="loadingcontainer">
			<PulseLoader size={"50px"} color={"white"} />
		</div>
	);
};

export default Loading;