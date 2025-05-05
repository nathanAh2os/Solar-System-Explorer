//Other imports
import React from "react";

//Component import
import Search from "./search";

//CSS import
import "../css/menu.css";

const Filter = () => {
	const handleChange = () => {};
	return (
		<div className="filter">
			<Search />
			<div className="flexbox-center">
				<input type="checkbox" name="dwarf-planets" onChange={() => handleChange()} checked />
				<label htmlFor="dwarf-planets"> &nbsp; Dwarf Planets </label>
			</div>
			<div className="flexbox-center">
				<input type="checkbox" name="moons" onChange={() => handleChange()} checked />
				<label htmlFor="moons"> &nbsp; Moons</label>
			</div>
			<div className="flexbox-center">
				<input type="checkbox" name="comets" onChange={() => handleChange()} />
				<label htmlFor="moons"> &nbsp; Comets</label>
			</div>
		</div>
	);
};

export default Filter;
