//React import
import { useState } from "react";

const Search = () => {
	let [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (value) => {
		console.log("handleSearch()");
		setSearchTerm(value);
	};

	const selectSearch = () => {
		console.log("selectSearch()");
	};

	return (
		<div className="flexbox-center">
			<input type="text" placeholder="Search Solar System" onChange={(e) => handleSearch(e.target.value)}></input>
		</div>
	);
};

export default Search;
