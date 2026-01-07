        document.addEventListener('DOMContentLoaded', function() {
            const loadingPage = document.getElementById('loadingPage');
            const continueBtn = document.getElementById('continueBtn');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mainNav = document.getElementById('mainNav');
            const backToTopBtn = document.getElementById('backToTop');
            const body = document.body;
            
            // Variables for scroll detection
            let lastScrollTop = 0;
            let scrollThreshold = 100; // Show button after 100px scroll
            let isButtonVisible = false;
            
            // Flag to track if loading page has been hidden
            let loadingPageHidden = false;
            
            // Function to hide loading page
            function hideLoadingPage() {
                if (loadingPageHidden) return;
                
                loadingPageHidden = true;
                // Add fade-out class to trigger CSS transition
                loadingPage.classList.add('fade-out');
                
                // Restore body scrolling after fade out
                setTimeout(() => {
                    loadingPage.style.display = 'none';
                    body.style.overflow = 'auto';
                }, 1000);
            }
            
            // Prevent scrolling when loading page is visible initially
            body.style.overflow = 'hidden';
            
            // Continue button - hide loading page with fade out
            continueBtn.addEventListener('click', function() {
                hideLoadingPage();
            });
            
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
                // Skip for links in loading page
                if (anchor.closest('.loading-page')) return;
                
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
            
            // Active navigation highlighting - keeps active style
            window.addEventListener('scroll', function() {
                const homeSection = document.getElementById('home');
                const aboutSection = document.getElementById('about');
                const contactSection = document.getElementById('contact');
                const navLinks = document.querySelectorAll('nav a');
                const homeLink = document.querySelector('nav a[href="https://baituljenazah.github.io/"]');
                
                const scrollPosition = window.scrollY;
                const aboutTop = aboutSection.offsetTop;
                
                // Remove active class from all nav links initially
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Keep home link active when in home section
                // When scrolling to about section through footer, home link remains active
                if (scrollPosition < aboutTop - 100) {
                    // We're in the home section
                    if (homeLink) homeLink.classList.add('active');
                } else {
                    // We're in about section or footer - still keep home active
                    if (homeLink) homeLink.classList.add('active');
                }
            });
            
            // Auto-hide loading page after 10 seconds
            setTimeout(function() {
                hideLoadingPage();
            }, 10000);
            
            // Initialize active state for home page
            const homeLink = document.querySelector('nav a[href="https://baituljenazah.github.io/"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
            
            // Trigger scroll event on load to set initial active state
            setTimeout(function() {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        });
