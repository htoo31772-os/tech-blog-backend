import { useEffect, useState } from "react";
import LatestStories from "./latestStories";
import Sidebar from "./sidebar";
import Hero from "../component/hero";
import Header from "./header";
import Footer from "./footer";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { search } = useLocation();
    const fetchSearch = async (url = null) => {
        try {
            setLoading(true)
            const finalUrl = url ? url : `/api/techBlog/post${search}`;
            const res = await axios.get(finalUrl);
            setPosts(res.data.data)
            setMeta(res.data);
        } catch (error) {
            console.error("Search error:", error);
            setError("Posts များကို ရယူ၍မရပါ။ ပြန်လည်ကြိုးစားကြည့်ပါ။");
            setPosts([]);
            setMeta(null);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchSearch();
    }, [search])
    return (
        <main>
            <Header />
            <div className="container my-5">
                <div className="row">
                    <Hero />
                    <LatestStories posts={posts} meta={meta} fetchSearch={fetchSearch} loading={loading} error={error} />
                    <Sidebar />
                </div>
            </div>
            <Footer />
        </main>

    )
}
export default Home;
