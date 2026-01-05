        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mainNav = document.getElementById('mainNav');
            const languageToggleBtn = document.getElementById('languageToggleBtn');
            const orgImageBM = document.getElementById('orgImageBM');
            const orgImageEN = document.getElementById('orgImageEN');
            const imageCaption = document.getElementById('imageCaption');
            const imageModal = document.getElementById('imageModal');
            const closeModal = document.getElementById('closeModal');
            const modalImage = document.getElementById('modalImage');
            const backToTopBtn = document.getElementById('backToTop');
            
            // Variables for scroll detection - SAME AS HOMEPAGE
            let lastScrollTop = 0;
            let scrollThreshold = 100; // Show button after 100px scroll
            let isButtonVisible = false;
            
            // State
            let isEnglish = false;
            
            // Back to top button functionality - SAME AS HOMEPAGE
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Smooth scroll detection with immediate response - SAME AS HOMEPAGE
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
            
            // Mobile menu toggle - UPDATED SAMA DENGAN HOMEPAGE
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                mainNav.classList.toggle('active');
                mobileMenuOverlay.classList.toggle('active');
                mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Close mobile menu when clicking on overlay - UPDATED SAMA DENGAN HOMEPAGE
            mobileMenuOverlay.addEventListener('click', function() {
                mainNav.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
            
            // Close mobile menu when clicking outside on mobile - UPDATED SAMA DENGAN HOMEPAGE
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
            
            // Active navigation highlighting - SIMPLIFIED VERSION
            window.addEventListener('scroll', function() {
                const navLinks = document.querySelectorAll('nav a');
                
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Set directory nav as active (since we're on the directory page)
                document.querySelector('nav a[href*="direktori.html"]').classList.add('active');
            });
            
            // Set directory nav as active on page load
            document.querySelector('nav a[href*="direktori.html"]').classList.add('active');
            
            // Toggle language for org structure image
            languageToggleBtn.addEventListener('click', function() {
                if (isEnglish) {
                    // Tukar ke Bahasa Melayu
                    orgImageBM.classList.remove('hidden');
                    orgImageBM.classList.add('active');
                    orgImageEN.classList.remove('active');
                    orgImageEN.classList.add('hidden');
                    imageCaption.textContent = 'Struktur organisasi BaitulJenazah (Versi Bahasa Melayu)';
                    languageToggleBtn.innerHTML = '<i class="fas fa-language"></i> English';
                } else {
                    // Tukar ke English
                    orgImageEN.classList.remove('hidden');
                    orgImageEN.classList.add('active');
                    orgImageBM.classList.remove('active');
                    orgImageBM.classList.add('hidden');
                    imageCaption.textContent = 'BaitulJenazah Organizational Structure (English Version)';
                    languageToggleBtn.innerHTML = '<i class="fas fa-language"></i> Bahasa Melayu';
                }
                isEnglish = !isEnglish;
            });
            
            // Click to open image in modal
            function openImageModal(imageSrc, imageAlt) {
                modalImage.src = imageSrc;
                modalImage.alt = imageAlt;
                imageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            orgImageBM.addEventListener('click', function() {
                openImageModal(this.src, this.alt);
            });
            
            orgImageEN.addEventListener('click', function() {
                openImageModal(this.src, this.alt);
            });
            
            // Also make the image wrapper clickable
            document.querySelector('.org-image-wrapper').addEventListener('click', function(e) {
                if (e.target !== languageToggleBtn) {
                    const activeImage = document.querySelector('.org-image.active');
                    openImageModal(activeImage.src, activeImage.alt);
                }
            });
            
            // Close modal
            closeModal.addEventListener('click', function() {
                imageModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
            
            // Close modal when clicking outside the image
            imageModal.addEventListener('click', function(e) {
                if (e.target === imageModal) {
                    imageModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && imageModal.classList.contains('active')) {
                    imageModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Initialize animations on scroll
            const animatedElements = document.querySelectorAll('.directory-section, .section-title, .contact-card, .social-media-container, .directory-header h2, .directory-header p');
            
            function checkAnimation() {
                animatedElements.forEach((element, index) => {
                    const elementTop = element.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (elementTop < windowHeight - 100) {
                        // Add staggered animation delay
                        const delay = index * 0.1;
                        element.style.animationDelay = `${delay}s`;
                        element.style.animationPlayState = 'running';
                    }
                });
            }
            
            // Run check on load and scroll
            window.addEventListener('load', checkAnimation);
            window.addEventListener('scroll', checkAnimation);
            
            // Initial check
            checkAnimation();
            
            // Trigger scroll event to set initial active state and back to top button
            setTimeout(function() {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        });
