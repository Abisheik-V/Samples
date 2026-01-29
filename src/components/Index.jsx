import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import '../assets/style/style.css';
import logo from '../assets/logo.png';
import { X, ArrowUpRight, List, Person } from 'react-bootstrap-icons';
import DarkVeil from './DarkVeil';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import MagicBento from './MagicBento';
import ContactForm from './ContactForm';


const Index = () => {
    const containerRef = useRef();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleNavbar = () => {
        if (isAnimating) return;
        setIsExpanded(!isExpanded);
    };

    useGSAP(() => {
        // Center the navbar on X axis to work with absolute/fixed positioning
        gsap.set(".navbar-card", { xPercent: -50 });

        // Initial entry animation (only on first mount)
        gsap.from(".navbar-card", {
            y: -100,
            opacity: 0,
            duration: 1.5,
            ease: "elastic.out(1,0.8)"
        });
    }, { scope: containerRef });

    useGSAP(() => {
        if (isExpanded) {
            setIsAnimating(true);
            gsap.to(".navbar-content", {
                height: "auto",
                marginTop: 12,
                opacity: 1,
                duration: 0.8,
                ease: "elastic.out(1,0.75)",
                onComplete: () => setIsAnimating(false)
            });

            gsap.to(".navbar-card", {
                width: Math.min(1000, window.innerWidth * 0.95), // Expanded width: max 1000px or 95% of viewport
                duration: 0.8,
                ease: "elastic.out(1,0.75)"
            });

            gsap.fromTo(".nav-item",
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: "back.out(1.7)"
                }
            );
        } else {
            setIsAnimating(true);
            gsap.to(".navbar-content", {
                height: 0,
                marginTop: 0,
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut"
            });

            gsap.to(".navbar-card", {
                width: Math.min(600, window.innerWidth * 0.9), // Collapsed width: max 600px or 90% of viewport
                duration: 0.8,
                ease: "elastic.out(1,0.8)",
                onComplete: () => setIsAnimating(false)
            });
        }
    }, {
        dependencies: [isExpanded],
        scope: containerRef
    });

    return (
        <div ref={containerRef} className="main-container">
            <DarkVeil />

            <div className="navbar-card">
                {/* Header Section */}
                <div className="navbar-header">
                    <button className="icon-btn" onClick={toggleNavbar}>
                        {isExpanded ? <X size={24} /> : <List size={24} />}
                    </button>
                    <div className="brand-logo">
                        <img src={logo} alt="Artly Logo" className="logo-img" />
                        <span>Artlysoft pvt ltd</span>
                    </div>
                    <div className="nav-actions">
                        <Link to="/login" className="login-link">
                            <Person size={22} />
                        </Link>
                        <Link to="#" className="cta-btn">Get Started</Link>
                    </div>
                </div>

                {/* Content/Menu Section */}
                <div className="navbar-content" style={{ height: 0, opacity: 0, overflow: 'hidden' }}>
                    {/* About Card */}
                    <div className="nav-item card-1">
                        <h3>About</h3>
                        <div className="links">
                            <Link to="#"> <ArrowUpRight /> Company</Link>
                            <Link to="#"> <ArrowUpRight /> Careers</Link>
                        </div>
                    </div>

                    {/* Projects Card */}
                    <div className="nav-item card-2">
                        <h3>Projects</h3>
                        <div className="links">
                            <Link to="#"> <ArrowUpRight /> Featured</Link>
                            <Link to="#"> <ArrowUpRight /> Case Studies</Link>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="nav-item card-3">
                        <h3>Contact</h3>
                        <div className="links">
                            <Link to="#"> <ArrowUpRight /> Email</Link>
                            <Link to="#"> <ArrowUpRight /> Twitter</Link>
                            <Link to="#"> <ArrowUpRight /> LinkedIn</Link>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollStack
                useWindowScroll={true}
                itemStackDistance={50}
                itemScale={0.05}
                baseScale={0.88}
                scaleEndPosition="50%"
            >
                <ScrollStackItem itemClassName="card-demo-1">
                    <h2>About Artlysoft</h2>
                    <p>We are a premier software development company transforming ideas into innovative digital solutions. Partner with us for high-quality, scalable, and user-centric software.</p>
                </ScrollStackItem>
                <ScrollStackItem itemClassName="card-demo-2">
                    <h2>Our Services</h2>
                    <p>We specialize in Web Development, Mobile App Creation, UI/UX Design, and Custom Software Solutions tailored to meet your unique business needs.</p>
                </ScrollStackItem>
                <ScrollStackItem itemClassName="card-demo-3">
                    <h2>Our Mission</h2>
                    <p>To empower businesses through digital excellence. We prioritize robust testing, high coding standards, and long-term client partnerships to drive your success.</p>
                </ScrollStackItem>
            </ScrollStack>

            <MagicBento
                textAutoHide={true}
                enableStars
                enableSpotlight
                enableBorderGlow={true}
                enableTilt={false}
                enableMagnetism={false}
                clickEffect
                spotlightRadius={400}
                particleCount={12}
                glowColor="132, 0, 255"
                disableAnimations={false}
            />

            <ContactForm />

        </div>
    );
};

export default Index;