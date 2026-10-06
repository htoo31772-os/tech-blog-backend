import react from "react";
import Search from "../component/search";
import Category from "../component/category";
import NewLetter from "../component/newLetter";
const Sidebar = ({ isLoggin }) => {
    return (
        <div className="col-lg-4 mt-5 mt-lg-0">
            <Search />
            <Category />
            <NewLetter isLoggin={isLoggin} />
        </div>
    )
}
export default Sidebar;
