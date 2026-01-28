import React, { useEffect, useRef } from 'react';
import bgLogo from '../assets/bg-logo.png';

const PixelBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Configuration
        const gridSize = 20; // Size of each pixel square
        const gridGap = 2;   // Gap between squares
        const speed = 0.05;  // Fade speed

        let grid = [];

        // Initialize grid
        const initGrid = () => {
            grid = [];
            const cols = Math.ceil(canvas.width / gridSize);
            const rows = Math.ceil(canvas.height / gridSize);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    grid.push({
                        x: i * gridSize,
                        y: j * gridSize,
                        alpha: 0,
                        targetAlpha: 0
                    });
                }
            }
        };

        // Handle Mouse Move
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const col = Math.floor(mouseX / gridSize);
            const row = Math.floor(mouseY / gridSize);

            grid.forEach(pixel => {
                // Check if pixel is close to mouse
                const pixelCol = Math.floor(pixel.x / gridSize);
                const pixelRow = Math.floor(pixel.y / gridSize);

                const dist = Math.sqrt((pixelCol - col) ** 2 + (pixelRow - row) ** 2);

                if (dist < 4) { // Blast radius
                    pixel.targetAlpha = 1 - (dist / 4);
                    pixel.alpha = 1; // Instant light up
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        initGrid();

        // Animation Loop
        const animate = () => {
            // Clear canvas to show background image
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            grid.forEach(pixel => {
                // Decay alpha
                if (pixel.alpha > 0) {
                    pixel.alpha -= speed * 0.5;
                }
                if (pixel.alpha < 0) pixel.alpha = 0;

                // Random glimmer
                if (Math.random() < 0.001) {
                    pixel.alpha = Math.random() * 0.5;
                }

                if (pixel.alpha > 0.01) {
                    ctx.fillStyle = `rgba(0, 85, 180, ${pixel.alpha})`; // Brand Blue
                    ctx.fillRect(pixel.x + gridGap / 2, pixel.y + gridGap / 2, gridSize - gridGap, gridSize - gridGap);
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            backgroundColor: '#050505', // Dark background
            overflow: 'hidden'
        }}>
            {/* Background Logo */}
            <img
                src={bgLogo}
                alt="Background Watermark"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px', // Adjust size as needed
                    opacity: 0.1,   // Faint visibility
                    pointerEvents: 'none'
                }}
            />

            <canvas
                ref={canvasRef}
                className="pixel-bg"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none' // Let clicks pass through
                }}
            />
        </div>
    );
};

export default PixelBackground;
