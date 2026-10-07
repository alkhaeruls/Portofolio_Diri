document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. TEMA: MODE GELAP & MODE TERANG (PERSISTENT DENGAN LOCALSTORAGE)
    // =========================================================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon') : null;
    const themeLabel = themeToggleBtn ? themeToggleBtn.querySelector('.theme-label') : null;

    // Baca tema tersimpan atau default ke 'dark'
    let currentTheme = localStorage.getItem('alif_portfolio_theme') || 'dark';

    function applyTheme(theme) {
        currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('alif_portfolio_theme', theme);

        if (themeIcon && themeLabel) {
            if (theme === 'light') {
                themeIcon.textContent = '☀';
                themeLabel.textContent = 'TERANG';
                themeToggleBtn.setAttribute('title', 'Beralih ke Mode Gelap');
            } else {
                themeIcon.textContent = '☾';
                themeLabel.textContent = 'GELAP';
                themeToggleBtn.setAttribute('title', 'Beralih ke Mode Terang');
            }
        }
    }

    // Terapkan tema saat halaman pertama kali dimuat
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    // =========================================================================
    // 2. MENU MOBILE TOGGLE (RETRO BURGER)
    // =========================================================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('open');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('open');
            });
        });
    }

    // =========================================================================
    // 3. SCROLL REVEAL HALUS
    // =========================================================================
    const revealTargets = document.querySelectorAll('.retro-box-card, .skill-retro-card, .retro-project-showcase, .contact-card-retro');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealTargets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });

    // =========================================================================
    // 4. RETRO GOLD & CRIMSON PARTICLES (EMBER & STARDUST CANVAS)
    // =========================================================================
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000, radius: 120 };

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Palet Partikel Dinamis (Menyesuaikan Mode Gelap & Mode Terang)
    function getParticleColors() {
        if (currentTheme === 'light') {
            return [
                { r: 180, g: 83,  b: 9,   a: 0.75 }, // Antique Bronze
                { r: 217, g: 119, b: 6,   a: 0.8  }, // Warm Amber Gold
                { r: 185, g: 28,  b: 28,  a: 0.75 }, // Deep Crimson
                { r: 220, g: 38,  b: 38,  a: 0.65 }, // Ruby Spark
                { r: 120, g: 53,  b: 15,  a: 0.55 }  // Subtle Gold Earth
            ];
        }
        return [
            { r: 245, g: 158, b: 11,  a: 0.85 }, // Warm Amber Gold
            { r: 251, g: 191, b: 36,  a: 0.9  }, // Bright Gold
            { r: 254, g: 240, b: 138, a: 0.7  }, // Pale Starlight
            { r: 220, g: 38,  b: 38,  a: 0.8  }, // Crimson Ruby
            { r: 239, g: 68,  b: 68,  a: 0.75 }, // Radiant Red Spark
            { r: 255, g: 253, b: 249, a: 0.9  }  // Pure Warm Cream
        ];
    }

    class RetroEmber {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 10;
            this.size = Math.random() * 2.5 + 0.6;
            this.baseSize = this.size;
            
            // Gerakan melayang ke atas seperti bara api / debu kosmik hangat
            this.speedY = -(Math.random() * 0.45 + 0.15);
            this.speedX = (Math.random() - 0.5) * 0.35;
            
            // Efek kedip (twinkle)
            const colors = getParticleColors();
            this.colorData = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.7 + 0.2;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
            
            // Sudut osilasi lembut
            this.angle = Math.random() * Math.PI * 2;
            this.swingSpeed = Math.random() * 0.015 + 0.005;
        }

        update() {
            this.angle += this.swingSpeed;
            this.x += this.speedX + Math.sin(this.angle) * 0.25;
            this.y += this.speedY;

            // Reaksi halus terhadap kursor mouse
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 2;
                this.y += Math.sin(angle) * force * 2;
            }

            // Twinkle alpha
            this.alpha += this.twinkleSpeed * this.twinkleDir;
            if (this.alpha > 0.95) {
                this.alpha = 0.95;
                this.twinkleDir = -1;
            } else if (this.alpha < 0.15) {
                this.alpha = 0.15;
                this.twinkleDir = 1;
            }

            // Reset jika keluar layar
            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            // Warna partikel dengan glow hangat
            const { r, g, b } = this.colorData;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
            
            // Shadow Blur untuk kesan pijaran emas/merah
            ctx.shadowBlur = this.size * 5;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${this.alpha * 0.8})`;
            
            ctx.fill();
            ctx.restore();
        }
    }

    // Inisialisasi Jumlah Partikel Sesuai Perangkat
    const particleCount = window.innerWidth < 768 ? 45 : 95;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new RetroEmber());
    }

    // Garis konstelasi tipis jika partikel emas/merah berdekatan
    function renderConstellationLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 85) {
                    const lineAlpha = (1 - dist / 85) * (currentTheme === 'light' ? 0.08 : 0.12);
                    ctx.beginPath();
                    ctx.strokeStyle = currentTheme === 'light' 
                        ? `rgba(180, 83, 9, ${lineAlpha})` 
                        : `rgba(245, 158, 11, ${lineAlpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Loop Animasi
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        renderConstellationLines();

        requestAnimationFrame(animate);
    }

    animate();
});
