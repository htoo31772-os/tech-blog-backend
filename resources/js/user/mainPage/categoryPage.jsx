import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const CategoryPage = () => {
    const { slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryPosts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/techBlog/category/${slug}`);
                setPosts(res.data.posts);
                setCategoryName(res.data.category_name);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryPosts();
    }, [slug]);

    if (loading) return <div className="text-center py-5">Loading...</div>;

    return (
        <div className="container py-5">
            {/* Header Section */}
            <div className="mb-5 text-center">
                <nav aria-label="breadcrumb" className="d-flex justify-content-center">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
                        <li className="breadcrumb-item active">Category</li>
                    </ol>
                </nav>
                <h2 className="fw-bold display-5 text-primary text-capitalize">{categoryName}</h2>
                <p className="text-muted fs-5">{posts.length} articles found in this section</p>
                <hr className="w-25 mx-auto text-primary" style={{ height: '3px' }} />
            </div>

            <div className="row g-4">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div className="col-md-4" key={post.id}>
                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                <img src={post.image_url} className="card-img-top" alt="Post Image" />
                                <div className="card-body">
                                    <h5 className="fw-bold">{post.title}</h5>
                                    <p className="text-muted small">{post.body.substring(0, 100)}...</p>
                                    <div className="small">
                                        <Link to={`/techBlog/post/postDetail/${post.slug}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <h4>ဒီ Category မှာ ဆောင်းပါးမရှိသေးပါဘူး။</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
