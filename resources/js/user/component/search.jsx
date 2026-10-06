import react, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Search = () => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?search=${keyword}`)
        } else {
            navigate('/')
        }
    }
    return (
        <div className="card shadow-sm p-4 mb-4 border-0 rounded-4">
            <h5 className="fw-bold mb-3">Search</h5>
            <form onSubmit={handleSearchSubmit}>
                <div className="input-group">
                    <input type="text"
                        className="form-control rounded-start-pill border-light bg-light"
                        placeholder="Search articles..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    /><button type="submit" className="btn btn-primary rounded-end-pill px-3">Go</button>
                </div>
            </form>
        </div>
    )
}
export default Search;
