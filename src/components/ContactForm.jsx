import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'react-bootstrap-icons';
import './ContactForm.css';

gsap.registerPlugin(ScrollTrigger);

const ContactForm = () => {
    const sectionRef = useRef(null);
    const formCardRef = useRef(null);
    const titleRef = useRef(null);
    const particlesRef = useRef(null);

    // Form state
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });

    // VFX: Particle Background
    useEffect(() => {
        const canvas = particlesRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Pixel {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(${Math.random() > 0.5 ? '132, 0, 255' : '0, 221, 255'}, ${Math.random() * 0.5})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = Array.from({ length: 50 }, () => new Pixel());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            // Draw connections
            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach(b => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(132, 0, 255, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // 3D Tilt Effect
    useEffect(() => {
        const card = formCardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Entrance Animation
    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
            }
        });

        tl.to(titleRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power4.out' })
            .to('.contact-subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
            .to('.contact-stats', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
            .to(formCardRef.current, { opacity: 1, x: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.8');

    }, []);

    return (
        <section className="contact-section" ref={sectionRef}>
            <canvas ref={particlesRef} className="contact-bg-particles" />

            <div className="contact-container">
                <div className="contact-info-wrapper">
                    <h2 className="contact-title" ref={titleRef}>Let's Build the Future</h2>
                    <p className="contact-subtitle">
                        Ready to transform your digital presence? Reach out to our team of experts and let's create something extraordinary together.
                    </p>

                    <div className="contact-stats">
                        <div className="stat-item">
                            <h3>24/7</h3>
                            <p>Support</p>
                        </div>
                        <div className="stat-item">
                            <h3>100+</h3>
                            <p>Projects</p>
                        </div>
                        <div className="stat-item">
                            <h3>98%</h3>
                            <p>Retention</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form-card" ref={formCardRef}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder=" "
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            />
                            <label className="form-label">Name</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                className="form-input"
                                placeholder=" "
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            />
                            <label className="form-label">Email</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder=" "
                                style={{ height: 'auto' }}
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            />
                            <label className="form-label">Message</label>
                        </div>

                        <button className="submit-btn">
                            Send Message <ArrowRight className="ms-2" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
