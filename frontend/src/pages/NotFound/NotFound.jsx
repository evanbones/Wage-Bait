import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import WaveBackground from '../Home/WaveBackground';
import otterImg from '../../assets/images/logo2.png';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center relative overflow-hidden px-4">
            <style>
                {`
                @keyframes gentle-float {
                    0%, 100% { transform: translateY(0) rotate(-2deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                .animate-float-otter {
                    animation: gentle-float 7s ease-in-out infinite;
                }
                `}
            </style>

            <WaveBackground progress={0.5}>
                {/* Floating Otter */}
                <div className="absolute top-[105px] right-[10%] hidden lg:block">
                    <img 
                        src={otterImg} 
                        alt="Floating Otter" 
                        className="w-32 h-32 object-contain animate-float-otter opacity-80"
                    />
                </div>
            </WaveBackground>
            
            <div className="relative z-10 text-center max-w-2xl animate-in fade-in zoom-in duration-500">
                <div className="bg-brand-surface p-12 rounded-[3rem] border border-brand-secondary/10 shadow-2xl shadow-brand-primary/5 backdrop-blur-sm bg-brand-surface/90">
                    <div className="w-24 h-24 bg-brand-accent-light rounded-full flex items-center justify-center mx-auto mb-8">
                        <Compass className="w-12 h-12 text-brand-primary" />
                    </div>
                    
                    <h1 className="text-8xl font-serif font-bold text-brand-primary mb-4">404</h1>
                    <h2 className="text-3xl font-serif font-bold text-brand-primary mb-6">Oops!</h2>
                    
                    <p className="text-brand-secondary text-lg mb-10 leading-relaxed">
                        "Hmm it sure seems like the page you're trying to navigate to doesn't exist. It would be funny if you entered an incorrect URL just to see this page."
                    </p>
                    
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-3 bg-brand-primary text-brand-surface px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-secondary transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-brand-primary/20"
                    >
                        <Home className="w-5 h-5" />
                        Go Back Home
                    </Link>
                </div>
                
                <p className="mt-8 text-brand-secondary/40 font-medium tracking-widest uppercase text-xs">
                    super cool bonus easter egg down here
                </p>
            </div>
        </div>
    );
};

export default NotFound;
