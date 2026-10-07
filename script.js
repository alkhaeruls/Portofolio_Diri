document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Logika Menu Navigasi Mobile ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');

    mobileToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
        });
    });

    // --- 2. Animasi Scroll (Reveal) ---
    const sections = document.querySelectorAll('.section');
    
    const revealSection = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if(sectionTop < windowHeight - revealPoint) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
    });

    window.addEventListener('scroll', revealSection);
    revealSection(); 

    // --- 3. Partikel Cahaya (Canvas) ---
    const canvas = document.getElementById('particleCanvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        // Inisialisasi Canvas
        function init() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            
            // Jumlah partikel disesuaikan dengan lebar layar
            const particleCount = window.innerWidth < 768 ? 40 : 100; 
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        // Blueprint Partikel
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 2 + 0.5; // Ukuran bervariasi
                this.vx = (Math.random() - 0.5) * 0.5; // Kecepatan X lambat
                this.vy = (Math.random() - 0.5) * 0.5; // Kecepatan Y lambat
                
                // Pilihan warna: Putih, Neon Blue, Purple
                const colors = ['rgba(255, 255, 255, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
                this.glow = Math.random() * 10 + 5; // Intensitas cahaya
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Jika partikel keluar layar, munculkan lagi dari sisi berlawanan
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                
                // Efek Glow
                ctx.shadowBlur = this.glow;
                ctx.shadowColor = this.color;
                
                ctx.fill();
                
                // Reset shadow untuk elemen lain
                ctx.shadowBlur = 0; 
            }
        }

        // Loop Animasi
        function animate() {
            // Bersihkan frame sebelumnya
            ctx.clearRect(0, 0, width, height);
            
            // Update dan gambar semua partikel
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // (Opsional) Menggambar garis penghubung tipis antar partikel yang berdekatan
            connectParticles();

            requestAnimationFrame(animate);
        }

        // Menggambar garis tipis (Constellation Effect)
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) { // Jika jarak < 120px, buat garis
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance/1200})`; // Semakin jauh semakin pudar
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Tangani perubahan ukuran layar
        window.addEventListener('resize', () => {
            init();
        });

        // Jalankan!
        init();
        animate();
    }
});
