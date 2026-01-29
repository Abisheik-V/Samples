import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import DarkVeil from './DarkVeil';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import '../assets/style/style.css';
import { Person, Envelope, Lock, ArrowRight, ArrowLeft } from 'react-bootstrap-icons';

const Login = () => {
    // 1 -> Sign In, -1 -> Sign Up
    // We use a number to track direction if needed, or just boolean
    const [isLogin, setIsLogin] = useState(true);
    const containerRef = useRef();
    const formContentRef = useRef(); // Ref for the changing content part
    const cardRef = useRef(); // Ref for the main card background

    // We can use a context-safe GSAP for clean up
    const { contextSafe } = useGSAP({ scope: containerRef });

    useGSAP(() => {
        // Initial Entry for the whole card
        gsap.from(cardRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.2
        });
    }, { scope: containerRef });

    // Handle the toggle with animation using contextSafe to trigger on click
    const handleToggle = contextSafe(() => {
        const tl = gsap.timeline();

        // 1. Fade OUT current content
        tl.to(".animated-field", {
            opacity: 0,
            y: -10,
            duration: 0.2,
            stagger: 0.05,
            ease: "power2.in"
        });

        // 2. Switch State (mid-animation)
        tl.call(() => setIsLogin((prev) => !prev));

        // 3. Resize Card Height (optional, but good for fit)
        // Since React renders fast, we wait a tick for the DOM to update with new fields
        // But for a smoother effect we often fix height. Let's rely on auto-height and GSAP smoothly animating it.
        // A simple trick is to animate 'from' height 'auto' which isn't always great.
        // Instead, let's just fade IN the new content.

        // 4. Fade IN new content
        tl.fromTo(".animated-field",
            { opacity: 0, y: 10 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: "back.out(1.7)", // Nice pop effect
                delay: 0.1 // Small pause for React re-render
            }
        );
    });

    return (
        <div className="login-page" ref={containerRef}>
            <DarkVeil />


            <div className="form-card" ref={cardRef}>
                <div className="form-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Enter your details to sign in' : 'Join us for an amazing experience'}</p>
                </div>

                <div className="form-content" ref={formContentRef}>
                    {!isLogin && (
                        <div className="input-group animated-field">
                            <Person className="input-icon" />
                            <input type="text" placeholder="Full Name" />
                        </div>
                    )}

                    <div className="input-group animated-field">
                        <Envelope className="input-icon" />
                        <input type="email" placeholder="Email Address" />
                    </div>

                    <div className="input-group animated-field">
                        <Lock className="input-icon" />
                        <input type="password" placeholder="Password" />
                    </div>

                    {!isLogin && (
                        <div className="input-group animated-field">
                            <Lock className="input-icon" />
                            <input type="password" placeholder="Confirm Password" />
                        </div>
                    )}

                    {isLogin && (
                        <div className="form-actions animated-field">
                            <label className="remember-me">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-pass">Forgot Password?</a>
                        </div>
                    )}

                    <button className="submit-btn animated-field">
                        {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight />
                    </button>
                </div>

                <div className="form-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button className="toggle-btn" onClick={handleToggle}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                    <Link to="/" className="back-home-btn">
                        <ArrowLeft /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
