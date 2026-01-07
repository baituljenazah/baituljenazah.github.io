        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mainNav = document.getElementById('mainNav');
            const backToTopBtn = document.getElementById('backToTop');
            const faqQuestions = document.querySelectorAll('.faq-question');
            
            // Variables for scroll detection
            let lastScrollTop = 0;
            let scrollThreshold = 100;
            let isButtonVisible = false;
            
            // Back to top button functionality
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Smooth scroll detection with immediate response
            window.addEventListener('scroll', function() {
                const currentScroll = window.scrollY;
                
                // Show button immediately when user starts scrolling down
                if (currentScroll > scrollThreshold && !isButtonVisible) {
                    isButtonVisible = true;
                    backToTopBtn.classList.add('visible');
                } 
                // Hide button when at the top
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
            
            // Close mobile menu when clicking on overlay
            mobileMenuOverlay.addEventListener('click', function() {
                mainNav.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
            
            // Close mobile menu when clicking outside on mobile
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
                    // If click is not on nav or menu button
                    if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                        mainNav.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mainNav.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
            
            // Smooth scrolling for anchor links
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
            
            // FAQ Accordion Functionality
            faqQuestions.forEach(question => {
                question.addEventListener('click', function() {
                    const answer = this.nextElementSibling;
                    const icon = this.querySelector('.faq-icon i');
                    
                    // Toggle active class on answer
                    answer.classList.toggle('active');
                    
                    // Rotate icon
                    if (answer.classList.contains('active')) {
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        icon.style.transform = 'rotate(0deg)';
                    }
                });
            });
            
            // Initialize active state for current page
            const currentPageLink = document.querySelector('nav a[href="https://baituljenazah.github.io/soalanlazim.html"]');
            if (currentPageLink) {
                currentPageLink.classList.add('active');
            }
            
            // Trigger scroll event on load to set initial active state
            setTimeout(function() {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        });
