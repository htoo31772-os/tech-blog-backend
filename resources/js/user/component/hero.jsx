import React from "react";


const Hero = () => {
    return (
        <div className="hero-wrapper shadow-lg mb-5">
            {/* Background Layer */}
            <div className="hero-bg"></div>

            {/* Content Layer */}
            <div className="container hero-content text-center">
                <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold">
                    Welcome to Myanmar Tech Hub
                </span>

                <h1 className="hero-title">
                    ခေတ်သစ်နည်းပညာနဲ့ ဗဟုသုတများ
                </h1>

                <p className="hero-description mb-4">
                    Latest Web Technologies, Business, Design, Lifestyle နဲ့ အခြားဗဟုသုတ များကို
                    တစ်နေရာတည်းမှာ အလွယ်တကူ လေ့လာဖတ်ရှုနိုင်ပါတယ်။
                </p>

                <button
                    onClick={() => window.scrollTo({ top: 750, behavior: 'smooth' })}
                    className="btn btn-light rounded-pill hero-btn"
                >
                    ဆောင်းပါးများ ဖတ်ရန်
                </button>
            </div>
        </div>
    );
};

export default Hero;
