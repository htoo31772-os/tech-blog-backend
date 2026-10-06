import react, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
const NewLetter = ({ isLoggin }) => {
    const token = localStorage.getItem('token');
    const [email, setEmail] = useState("");
    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!isLoggin && !email) {
            toast.error("Email လိပ်စာထည့်ပေးပါ။", { duration: 4000 });
        }
        try {
            const res = await axios.post('/api/newLetter', { email: isLoggin ? null : email }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setEmail("");
            toast.success("Newsletter စာရင်းသွင်းပြီးပါပြီ။", { duration: 4000 })
        } catch (err) {
            console.error("newLetter error:", err);
            toast.error(err.response.data.message || "တစ်ခုခုမှားယွင်းနေပါသည်။", { duration: 4000 })
        }
    }
    return (
        <div className="card shadow-sm p-4 bg-primary text-white border-0 rounded-4">
            <h5 className="fw-bold mb-3">Stay Updated</h5>

            <div>
                <p className="small opacity-75">Get the latest articles delivered to your inbox.</p>
                <form onSubmit={handleSubscribe}>
                    {isLoggin ? (
                        // Login ဝင်ထားရင် စာသားပဲပြမယ်
                        <p className="small opacity-75">
                            သင်သည် Login ဝင်ထားသည့်အတွက် ခလုတ်နှိပ်ရုံဖြင့် စာရင်းသွင်းနိုင်ပါသည်။
                        </p>
                    ) : (
                        // Login မဝင်ထားရင် Input box ပြမယ်
                        <input
                            type="email"
                            className="form-control mb-2 border-0 shadow-none"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    )}

                    <button type="submit" className="btn btn-light w-100 fw-bold rounded-pill text-primary">
                        {isLoggin ? "Subscribe Now" : "Subscribe"}
                    </button>
                </form>
            </div>

        </div>
    )
}
export default NewLetter;
