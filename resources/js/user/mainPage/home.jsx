import { useEffect, useState } from "react";
import LatestStories from "./latestStories";
import Sidebar from "./sidebar";
import Hero from "../component/hero";
import Header from "./header";
import Footer from "./footer";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Home = ({ setIsLoggin, isLoggin, user, setUser }) => {
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState(null);
    const { search } = useLocation();
    const fetchSearch = async (url = null) => {
        try {
            const finalUrl = url ? url : `/api/techBlog/post${search}`;
            const res = await axios.get(finalUrl);
            setPosts(res.data.data)
            setMeta(res.data);
        } catch (error) {
            console.error("Search error:", error);
        }
    }
    useEffect(() => {
        fetchSearch();
    }, [search])
    return (
        <main>
            <Header setIsLoggin={setIsLoggin} user={user} setUser={setUser} />
            <div className="container my-5">
                <div className="row">
                    <Hero />
                    <LatestStories posts={posts} meta={meta} fetchSearch={fetchSearch} />
                    <Sidebar isLoggin={isLoggin} />
                </div>
            </div>
            <Footer />
        </main>

    )
}
export default Home;
