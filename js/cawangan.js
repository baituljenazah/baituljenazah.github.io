        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mainNav = document.getElementById('mainNav');
            const backToTopBtn = document.getElementById('backToTop');
            
            let lastScrollTop = 0;
            let scrollThreshold = 100;
            let isButtonVisible = false;
            
            // Back to top button
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            window.addEventListener('scroll', function() {
                const currentScroll = window.scrollY;
                
                if (currentScroll > scrollThreshold && !isButtonVisible) {
                    isButtonVisible = true;
                    backToTopBtn.classList.add('visible');
                } 
                else if (currentScroll <= scrollThreshold && isButtonVisible) {
                    isButtonVisible = false;
                    backToTopBtn.classList.remove('visible');
                }
                
                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }, false);
            
            // Mobile menu toggle
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                mainNav.classList.toggle('active');
                mobileMenuOverlay.classList.toggle('active');
                mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            mobileMenuOverlay.addEventListener('click', function() {
                mainNav.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
            
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
                    if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                        mainNav.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            });
            
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mainNav.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
            
            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if(targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if(targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });
