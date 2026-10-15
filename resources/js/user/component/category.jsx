import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Category = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get('/api/techBlog/category/getCategory');
                if (!Array.isArray(response.data)) {
                    throw new Error("Invalid category data");
                }
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Category များကို ရယူ၍မရပါ။");
            } finally {
                setIsLoading(false)
            }

        }
        fetchCategory();
    }, []);
    return (
        <div className="card sidebar-card shadow-sm p-4 mb-4 border-0 rounded-4">
            <h5 className="fw-bold mb-4 border-bottom pb-2" style={{ color: '#2c3e50' }}>Categories</h5>
            <ul className="list-unstyled mb-0">
                {isLoading ? (
                    <li className="text-center mb-3">
                        Loading categories...
                    </li>
                ) : error ? (
                    <li className="text-center mb-3 text-danger">
                        {error}
                    </li>
                ) : categories.length > 0 ? (
                    categories?.map(category => (
                        <li key={category.id} className="mb-3 transition-all">
                            <Link to={`/techBlog/category/${category.slug}`}
                                className="text-decoration-none d-flex justify-content-between align-items-center group"
                                style={{ color: '#555', transition: '0.3s' }}
                            >
                                <span className="category-name">
                                    <span className="text-primary me-1 fw-bold">#</span>
                                    {category.name}
                                </span>
                                <span className="badge bg-success text-light border rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                    {category.post_count ?? 0}
                                </span>
                            </Link>
                        </li>
                    ))
                ) : (
                    <li className="mb-3 transition-all text-center">Category Data များမရှိသေးပါ။</li>
                )}
            </ul>
        </div>
    );
}
export default Category;
