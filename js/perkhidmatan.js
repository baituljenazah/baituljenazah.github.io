        // Initialize variables
        let cart = [];
        let lastScrollTop = 0;
        let isButtonVisible = false;
        const scrollThreshold = 100;
        
        // EmailJS configuration
        const EMAILJS_CONFIG = {
            serviceId: 'service_veo15lv',
            templateId: 'template_h17hgd6',
            publicKey: '4xUs48J_OTaSCo8Ec',
            privateKey: 'W90p9mMe7SqfTf5U4F1xF'
        };

        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mainNav = document.getElementById('mainNav');
            const backToTopBtn = document.getElementById('backToTop');
            const imageModal = document.getElementById('imageModal');
            
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
            
            // Set active state for current page
            const currentPage = window.location.pathname;
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
            
            // Highlight perkhidmatan page by default
            const perkhidmatanLink = document.querySelector('nav a[href*="perkhidmatan"]');
            if (perkhidmatanLink) {
                perkhidmatanLink.classList.add('active');
            }
            
            // Setup input formatting and validation
            setupInputFormatting();
            setupRealTimeValidation();
            loadCart();
            
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
            
            // Close image modal when clicking anywhere
            imageModal.addEventListener('click', function(e) {
                // Only close if clicking on the modal background, not the image or close button
                if (e.target === imageModal) {
                    closeImageModal();
                }
            });
            
            // Close image modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && imageModal.classList.contains('active')) {
                    closeImageModal();
                }
            });
            
            // Touch device detection and optimization
            detectTouchDevice();
        });

        // Image Modal Functions
        function openImageModal(imageSrc, title) {
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            const modalTitle = document.getElementById('modalTitle');
            
            modalImage.src = imageSrc;
            modalImage.alt = title;
            modalTitle.textContent = title;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeImageModal() {
            const modal = document.getElementById('imageModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        function detectTouchDevice() {
            if ('ontouchstart' in window || navigator.maxTouchPoints) {
                document.body.classList.add('touch-device');
                
                // Add touch-specific optimizations
                const serviceCards = document.querySelectorAll('.service-card');
                serviceCards.forEach(card => {
                    card.style.cursor = 'pointer';
                });
            }
        }

        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            toast.classList.remove('hide');
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hide');
            }, duration);
        }

        function loadCart() {
            const saved = localStorage.getItem('baituljenazah_cart');
            if (saved) {
                try {
                    cart = JSON.parse(saved);
                    updateCartDisplay();
                } catch (e) {
                    console.error('Error loading cart:', e);
                    cart = [];
                }
            }
        }

        function saveCart() {
            localStorage.setItem('baituljenazah_cart', JSON.stringify(cart));
            updateCartDisplay();
        }

        function addToCart(id, name, price, category) {
            cart.push({id, name, price, category, quantity: 1});
            saveCart();
            
            // Show toast notification
            showToast(name + ' ditambah ke troli', 2000);
            
            // Animate cart icon
            const cartCount = document.getElementById('cartCount');
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
            
            // Auto open cart on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => toggleCart(), 300);
            }
        }

        function removeFromCart(index) {
            // Animate removal
            const cartItem = document.querySelectorAll('.cart-item')[index];
            if (cartItem) {
                cartItem.style.transform = 'translateX(100%)';
                cartItem.style.opacity = '0';
                setTimeout(() => {
                    cart.splice(index, 1);
                    saveCart();
                }, 300);
            } else {
                cart.splice(index, 1);
                saveCart();
            }
        }

        function updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            const cartCount = document.getElementById('cartCount');
            const cartTotal = document.getElementById('cartTotal');
            
            cartCount.textContent = cart.length;
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart" style="font-size:3rem;color:#ddd;margin-bottom:15px"></i><p>Troli anda kosong</p></div>';
                cartTotal.textContent = 'RM 0.00';
                return;
            }
            
            let total = 0;
            cartItems.innerHTML = '';
            
            cart.forEach((item, index) => {
                total += item.price;
                cartItems.innerHTML += `
                    <div class="cart-item" style="animation-delay: ${index * 0.05}s">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.category}</p>
                        </div>
                        <div style="display:flex;align-items:center">
                            <div class="cart-item-price">RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})}</div>
                            <button class="remove-item" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });
            
            cartTotal.textContent = 'RM ' + total.toLocaleString('en-MY', {minimumFractionDigits: 2});
        }

        function toggleCart() {
            const sidebar = document.getElementById('cartSidebar');
            sidebar.classList.toggle('active');
        }

        function openCheckout() {
            if (cart.length === 0) {
                showToast('Sila tambah item ke troli dahulu', 2000);
                return;
            }
            const modal = document.getElementById('checkoutModal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateOrderSummary();
            nextStep(1);
        }

        function closeCheckout() {
            const modal = document.getElementById('checkoutModal');
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = 'auto';
            }, 300);
        }

        function updateOrderSummary() {
            const orderItems = document.getElementById('orderItems');
            const orderTotal = document.getElementById('orderTotal');
            
            let total = 0;
            orderItems.innerHTML = '';
            
            cart.forEach((item, index) => {
                total += item.price;
                orderItems.innerHTML += `
                    <div class="summary-item" style="animation-delay: ${index * 0.05}s">
                        <span>${item.name}</span>
                        <span>RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})}</span>
                    </div>
                `;
            });
            
            orderTotal.innerHTML = `
                <div class="summary-item summary-total" style="animation-delay: ${cart.length * 0.05}s">
                    <span>JUMLAH KESELURUHAN</span>
                    <span>RM ${total.toLocaleString('en-MY', {minimumFractionDigits: 2})}</span>
                </div>
            `;
        }

        function nextStep(step) {
            // Animate step transitions
            const steps = document.querySelectorAll('.step');
            const currentActive = document.querySelector('.step.active');
            
            // Mark previous step as completed
            if (currentActive && step > parseInt(currentActive.id.replace('step', ''))) {
                currentActive.classList.remove('active');
                currentActive.classList.add('completed');
            } else if (currentActive) {
                currentActive.classList.remove('active');
                currentActive.classList.remove('completed');
            }
            
            if (step === 2 && !validateStep1()) return;
            if (step === 3 && !validateStep2()) return;
            
            document.querySelectorAll('.checkout-step').forEach(s => {
                s.classList.remove('active');
            });
            
            // Animate step indicator
            const targetStep = document.getElementById('step' + step);
            if (targetStep) {
                setTimeout(() => {
                    targetStep.classList.add('active');
                }, 150);
            }
            
            // Animate content transition
            const targetContent = document.getElementById('step' + step + 'Content');
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 200);
            }
            
            if (step === 3) updateConfirmSections();
        }

        function updateConfirmSections() {
            const customerName = document.getElementById('customerName').value.trim();
            const customerPhone = document.getElementById('customerPhone').value.trim();
            const customerEmail = document.getElementById('customerEmail').value.trim();
            const customerAddress = document.getElementById('customerAddress').value.trim();
            const customerNotes = document.getElementById('customerNotes').value.trim();
            
            const cardName = document.getElementById('cardName').value.trim();
            const cardNumber = document.getElementById('cardNumber').value;
            const cardExpiry = document.getElementById('cardExpiry').value.trim();
            
            document.getElementById('confirmCustomer').innerHTML = `
                <div class="summary-item" style="animation-delay: 0s"><span>Nama:</span><span>${customerName}</span></div>
                <div class="summary-item" style="animation-delay: 0.05s"><span>Telefon:</span><span>${customerPhone}</span></div>
                <div class="summary-item" style="animation-delay: 0.1s"><span>Email:</span><span>${customerEmail}</span></div>
                <div class="summary-item" style="animation-delay: 0.15s"><span>Alamat:</span><span>${customerAddress}</span></div>
                ${customerNotes ? `<div class="summary-item" style="animation-delay: 0.2s"><span>Nota:</span><span>${customerNotes}</span></div>` : ''}
            `;
            
            document.getElementById('confirmPayment').innerHTML = `
                <div class="summary-item" style="animation-delay: 0.25s"><span>Kaedah:</span><span>Kad Kredit/Debit</span></div>
                <div class="summary-item" style="animation-delay: 0.3s"><span>Nama Kad:</span><span>${cardName}</span></div>
                <div class="summary-item" style="animation-delay: 0.35s"><span>Nombor Kad:</span><span>**** **** **** ${cardNumber.replace(/\s/g, '').slice(-4)}</span></div>
                <div class="summary-item" style="animation-delay: 0.4s"><span>Tarikh Luput:</span><span>${cardExpiry}</span></div>
            `;
            
            let total = 0;
            let itemsHTML = '';
            cart.forEach((item, index) => {
                total += item.price;
                itemsHTML += `
                    <div class="summary-item" style="animation-delay: ${0.45 + index * 0.05}s">
                        <span>${item.name}</span>
                        <span>RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})}</span>
                    </div>
                `;
            });
            
            itemsHTML += `
                <div class="summary-item summary-total" style="animation-delay: ${0.45 + cart.length * 0.05}s">
                    <span>JUMLAH KESELURUHAN</span>
                    <span>RM ${total.toLocaleString('en-MY', {minimumFractionDigits: 2})}</span>
                </div>
            `;
            
            document.getElementById('confirmItems').innerHTML = itemsHTML;
        }

        function validateStep1() {
            const name = document.getElementById('customerName').value.trim();
            const phone = document.getElementById('customerPhone').value.trim();
            const address = document.getElementById('customerAddress').value.trim();
            const email = document.getElementById('customerEmail').value.trim();
            
            let isValid = true;
            
            // Validate required fields
            if (!name) {
                document.getElementById('nameError').style.display = 'block';
                document.getElementById('customerName').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('nameError').style.display = 'none';
                document.getElementById('customerName').classList.remove('error');
            }
            
            // Validate phone number
            const phoneDigits = phone.replace(/\D/g, '');
            if (!phone || !/^\d{10,11}$/.test(phoneDigits)) {
                document.getElementById('phoneError').style.display = 'block';
                document.getElementById('customerPhone').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('phoneError').style.display = 'none';
                document.getElementById('customerPhone').classList.remove('error');
            }
            
            // Validate email format
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('emailError').style.display = 'block';
                document.getElementById('emailError').textContent = 'Sila isi email yang sah (contoh: nama@email.com)';
                document.getElementById('customerEmail').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('emailError').style.display = 'none';
                document.getElementById('customerEmail').classList.remove('error');
            }
            
            // Validate address
            if (!address) {
                document.getElementById('addressError').style.display = 'block';
                document.getElementById('customerAddress').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('addressError').style.display = 'none';
                document.getElementById('customerAddress').classList.remove('error');
            }
            
            if (!isValid) {
                // Scroll to first error
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return false;
            }
            
            return true;
        }

        function validateStep2() {
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiry = document.getElementById('cardExpiry').value.trim();
            const cvv = document.getElementById('cardCVV').value.trim();
            const cardName = document.getElementById('cardName').value.trim();
            
            let isValid = true;
            
            // Validate all required fields
            if (!cardName) {
                document.getElementById('cardNameError').style.display = 'block';
                document.getElementById('cardName').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('cardNameError').style.display = 'none';
                document.getElementById('cardName').classList.remove('error');
            }
            
            // Validate card number
            if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
                document.getElementById('cardError').style.display = 'block';
                document.getElementById('cardError').textContent = 'Nombor kad perlu 16 digit';
                document.getElementById('cardNumber').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('cardError').style.display = 'none';
                document.getElementById('cardNumber').classList.remove('error');
            }
            
            // Validate CVV - only 3 digits
            if (!cvv || !/^\d{3}$/.test(cvv)) {
                document.getElementById('cvvError').style.display = 'block';
                document.getElementById('cvvError').textContent = 'CVV perlu 3 digit';
                document.getElementById('cardCVV').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('cvvError').style.display = 'none';
                document.getElementById('cardCVV').classList.remove('error');
            }
            
            // Validate expiry date
            if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
                document.getElementById('expiryError').style.display = 'block';
                document.getElementById('expiryError').textContent = 'Format tidak sah (MM/YY)';
                document.getElementById('cardExpiry').classList.add('error');
                isValid = false;
            } else {
                const [monthStr, yearStr] = expiry.split('/');
                const month = parseInt(monthStr, 10);
                const year = parseInt(yearStr, 10);
                
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear() % 100;
                const currentMonth = currentDate.getMonth() + 1;
                
                if (month < 1 || month > 12) {
                    document.getElementById('expiryError').style.display = 'block';
                    document.getElementById('expiryError').textContent = 'Bulan mesti 01-12';
                    document.getElementById('cardExpiry').classList.add('error');
                    isValid = false;
                } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    document.getElementById('expiryError').style.display = 'block';
                    document.getElementById('expiryError').textContent = 'Kad telah tamat tempoh';
                    document.getElementById('cardExpiry').classList.add('error');
                    isValid = false;
                } else {
                    document.getElementById('expiryError').style.display = 'none';
                    document.getElementById('cardExpiry').classList.remove('error');
                }
            }
            
            if (!isValid) {
                // Scroll to first error
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return false;
            }
            
            return true;
        }

        function setupInputFormatting() {
            // Format card number input (4-4-4-4)
            const cardNumberInput = document.getElementById('cardNumber');
            if (cardNumberInput) {
                cardNumberInput.addEventListener('input', function(e) {
                    // Remove all non-digits
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Limit to 16 digits
                    if (value.length > 16) {
                        value = value.substring(0, 16);
                    }
                    
                    // Format as 4-4-4-4
                    let formatted = '';
                    for (let i = 0; i < value.length; i++) {
                        if (i > 0 && i % 4 === 0) {
                            formatted += ' ';
                        }
                        formatted += value[i];
                    }
                    
                    e.target.value = formatted;
                    
                    // Show error if not enough digits
                    const errorElement = document.getElementById('cardError');
                    if (value.length < 16 && value.length > 0) {
                        errorElement.textContent = 'Nombor kad perlu 16 digit (masih kurang ' + (16 - value.length) + ' digit)';
                        errorElement.style.display = 'block';
                    } else {
                        errorElement.style.display = 'none';
                    }
                });
            }
            
            // Format expiry date input (MM/YY) - AUTO FORMAT
            const expiryInput = document.getElementById('cardExpiry');
            if (expiryInput) {
                expiryInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Limit to 4 digits
                    if (value.length > 4) {
                        value = value.substring(0, 4);
                    }
                    
                    // Auto-add slash after 2 digits
                    if (value.length >= 2) {
                        const month = value.substring(0, 2);
                        let year = value.substring(2, 4);
                        
                        // Auto-correct month if invalid
                        let monthNum = parseInt(month, 10);
                        if (monthNum > 12) {
                            monthNum = 12;
                        }
                        if (monthNum < 1) {
                            monthNum = 1;
                        }
                        
                        // Format with leading zero
                        const formattedMonth = monthNum.toString().padStart(2, '0');
                        
                        // Auto-add slash
                        value = formattedMonth + (value.length > 2 ? '/' + year : '');
                    }
                    
                    e.target.value = value;
                    
                    // Auto-focus to CVV if expiry is complete
                    if (value.length === 5) {
                        setTimeout(() => {
                            document.getElementById('cardCVV').focus();
                        }, 100);
                    }
                });
            }
            
            // Format CVV input - only 3 digits
            const cvvInput = document.getElementById('cardCVV');
            if (cvvInput) {
                cvvInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Limit to 3 digits
                    if (value.length > 3) {
                        value = value.substring(0, 3);
                    }
                    
                    e.target.value = value;
                });
            }
        }

        function setupRealTimeValidation() {
            // Real-time email validation
            const emailInput = document.getElementById('customerEmail');
            if (emailInput) {
                emailInput.addEventListener('blur', function() {
                    const email = this.value.trim();
                    const errorElement = document.getElementById('emailError');
                    
                    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        errorElement.textContent = 'Format email tidak sah (contoh: nama@email.com)';
                        errorElement.style.display = 'block';
                        this.classList.add('error');
                    } else {
                        errorElement.style.display = 'none';
                        this.classList.remove('error');
                    }
                });
            }
            
            // Real-time phone validation
            const phoneInput = document.getElementById('customerPhone');
            if (phoneInput) {
                phoneInput.addEventListener('blur', function() {
                    const phone = this.value.trim();
                    const phoneDigits = phone.replace(/\D/g, '');
                    const errorElement = document.getElementById('phoneError');
                    
                    if (!phone || !/^\d{10,11}$/.test(phoneDigits)) {
                        errorElement.textContent = 'Sila isi nombor telefon yang sah (10-11 digit)';
                        errorElement.style.display = 'block';
                        this.classList.add('error');
                    } else {
                        errorElement.style.display = 'none';
                        this.classList.remove('error');
                    }
                });
            }
        }

        function createConfetti() {
            const colors = ['#88E788', '#78d178', '#68c168', '#98f798'];
            const confettiCount = 50;
            
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = Math.random() * 10 + 5 + 'px';
                confetti.style.opacity = Math.random() + 0.5;
                
                document.body.appendChild(confetti);
                
                // Animate
                const animation = confetti.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: Math.random() * 1000 + 1000,
                    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
                });
                
                animation.onfinish = () => confetti.remove();
            }
        }

        function processPayment() {
            const payBtn = document.getElementById('payBtn');
            const originalText = payBtn.innerHTML;
            
            // Show processing state
            payBtn.classList.add('btn-processing');
            payBtn.disabled = true;

            // Show loading overlay with smooth animation
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <div style="margin-bottom: 20px;">
                        <i class="fas fa-spinner fa-spin fa-3x" style="color: var(--primary);"></i>
                    </div>
                    <h3 style="margin-bottom: 10px;">Memproses Pembayaran</h3>
                    <p>Sila tunggu sebentar...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);

            // Simulate payment processing with progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 20;
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Remove loading overlay
                    loadingOverlay.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        if (loadingOverlay.parentNode) {
                            loadingOverlay.parentNode.removeChild(loadingOverlay);
                        }
                    }, 300);
                    
                    // Process payment
                    completePayment();
                    
                    // Reset button
                    setTimeout(() => {
                        payBtn.classList.remove('btn-processing');
                        payBtn.disabled = false;
                        payBtn.innerHTML = originalText;
                    }, 500);
                }
            }, 200);
        }

function completePayment() {
    const refNumber = 'BJ-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    const customer = {
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        // Make sure email is captured from the form
        email: document.getElementById('customerEmail').value.trim(),
        address: document.getElementById('customerAddress').value.trim(),
        notes: document.getElementById('customerNotes').value.trim() || ''
    };
    
    const payment = {
        method: 'credit_card',
        cardName: document.getElementById('cardName').value.trim(),
        cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
        cardLast4: document.getElementById('cardNumber').value.replace(/\s/g, '').slice(-4),
        cardExpiry: document.getElementById('cardExpiry').value.trim()
    };
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    const transaction = {
        orderId: refNumber,
        transactionId: 'TXN-' + Date.now(),
        customer: customer, // This now includes the 'email' property
        payment: payment,
        items: [...cart],
        total: total,
        status: 'Selesai',
        date: new Date().toLocaleDateString('ms-MY'),
        time: new Date().toLocaleTimeString('ms-MY')
    };
    
    saveTransaction(transaction);
    createConfetti();
    showSuccess(transaction);
    sendOrderConfirmationEmail(transaction); // This function can now access the email
}
        
function saveTransaction(transaction) {
    try {
        const transactions = JSON.parse(localStorage.getItem('baituljenazah_transactions') || '[]');
        
        // Reformat transaction untuk keserasian dengan admin page
        const formattedTransaction = {
            // Gunakan kedua-dua ID untuk keserasian
            refNumber: transaction.orderId,
            orderId: transaction.orderId,
            transactionId: transaction.transactionId,
            
            // Tambah timestamp untuk sorting
            timestamp: new Date().toISOString(),
            date: transaction.date,
            time: transaction.time,
            
            // Customer info
            customer: {
                name: transaction.customer.name,
                phone: transaction.customer.phone,
                email: transaction.customer.email,
                address: transaction.customer.address,
                notes: transaction.customer.notes || ''
            },
            
            // Payment info
            payment: {
                method: 'credit_card',
                cardName: transaction.payment.cardName,
                cardNumber: transaction.payment.cardNumber,
                cardLast4: transaction.payment.cardLast4 || transaction.payment.cardNumber.slice(-4),
                cardExpiry: transaction.payment.cardExpiry
            },
            
            // Items
            items: [...transaction.items],
            
            // Totals
            total: transaction.total,
            status: 'Selesai'  // Tambah status
        };
        
        transactions.push(formattedTransaction);
        localStorage.setItem('baituljenazah_transactions', JSON.stringify(transactions));
        console.log('Transaction saved:', formattedTransaction);
        
        // Clear cart
        cart = [];
        saveCart();
    } catch (error) {
        console.error('Error saving transaction:', error);
    }
}
    
function sendOrderConfirmationEmail(transaction) {
    const emailStatus = document.getElementById('emailStatus');
    emailStatus.style.display = 'block';
    emailStatus.className = 'email-status';
    emailStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghantar email pengesahan...';
    
    try {
        // Format items list for email
        const itemsList = transaction.items.map(item => 
            `• ${item.name} - RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})} (${item.category})`
        ).join('\n');
        
        // Prepare email template parameters
        // IMPORTANT: Add 'to_email' parameter which contains the recipient's email address
        const templateParams = {
            to_name: transaction.customer.name,
            to_email: transaction.customer.email,  // <-- ADD THIS LINE
            order_id: transaction.orderId,
            transaction_id: transaction.transactionId,
            order_date: transaction.date,
            order_time: transaction.time,
            customer_name: transaction.customer.name,
            customer_phone: transaction.customer.phone,
            customer_address: transaction.customer.address,
            customer_notes: transaction.customer.notes || 'Tiada nota',
            items_list: itemsList,
            total_amount: 'RM ' + transaction.total.toLocaleString('en-MY', {minimumFractionDigits: 2}),
            payment_method: 'Kad Kredit/Debit',
            reply_to: transaction.customer.email  // Optional: For reply-to address
        };
        
        // Debug log
        console.log('Sending email to:', transaction.customer.email);
        console.log('EmailJS template params:', templateParams);
        
        // Send email using EmailJS
        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            EMAILJS_CONFIG.publicKey
        )
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            emailStatus.className = 'email-status success';
            emailStatus.innerHTML = '<i class="fas fa-check-circle"></i> Email pengesahan pesanan telah dihantar ke ' + transaction.customer.email;
        })
        .catch(function(error) {
            console.error('Failed to send email:', error);
            emailStatus.className = 'email-status error';
            emailStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Email tidak dapat dihantar. Sila simpan resit untuk rujukan. Error: ' + error.text;
        });
    } catch (error) {
        console.error('Error preparing email:', error);
        emailStatus.className = 'email-status error';
        emailStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ralat menghantar email. Sila hubungi kami untuk pengesahan.';
    }
}

        function showSuccess(transaction) {
            // Mark step 3 as completed
            document.getElementById('step3').classList.remove('active');
            document.getElementById('step3').classList.add('completed');
            
            // Show step 4
            document.getElementById('step4').style.display = 'block';
            setTimeout(() => {
                document.getElementById('step4').classList.add('active');
            }, 200);
            
            // Hide step 3 content
            document.getElementById('step3Content').classList.remove('active');
            
            // Show step 4 content
            setTimeout(() => {
                document.getElementById('step4Content').classList.add('active');
            }, 400);
            
            // Store transaction for printing
            window.currentTransaction = transaction;
            
            // Update success content with animations
            document.getElementById('successContent').innerHTML = `
                <div class="success-message">
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Pembayaran Berjaya!</h3>
                    <p style="animation-delay: 0.1s">Terima kasih atas pesanan anda. Transaksi telah berjaya diproses.</p>
                    
                    <div class="transaction-details">
                        <p><strong>No. Rujukan:</strong> ${transaction.orderId}</p>
                        <p><strong>No. Transaksi:</strong> ${transaction.transactionId}</p>
                        <p><strong>Tarikh:</strong> ${transaction.date}</p>
                        <p><strong>Masa:</strong> ${transaction.time}</p>
                        <p><strong>Nama:</strong> ${transaction.customer.name}</p>
                        <p><strong>Email:</strong> ${transaction.customer.email}</p>
                        <p><strong>Telefon:</strong> ${transaction.customer.phone}</p>
                        <p><strong>Jumlah Bayaran:</strong> RM ${transaction.total.toLocaleString('en-MY', {minimumFractionDigits: 2})}</p>
                        <p><strong>Status:</strong> <span style="color:#27ae60">${transaction.status}</span></p>
                    </div>
                    
                    <p style="margin-top:20px;font-size:0.9rem;color:#666; animation-delay: 0.4s">
                        Email pengesahan akan dihantar ke ${transaction.customer.email} dalam beberapa minit.
                    </p>
                    
                    <div style="margin-top:30px; animation-delay: 0.5s">
                        <button class="btn" onclick="printReceipt()" style="width:auto;padding:12px 30px">
                            <i class="fas fa-print"></i> Cetak Resit
                        </button>
                        <button class="btn btn-secondary" onclick="completeOrder()" style="width:auto;padding:12px 30px;margin-left:10px">
                            <i class="fas fa-home"></i> Selesai
                        </button>
                    </div>
                </div>
            `;
            
            // Scroll to top of modal
            document.querySelector('.modal-body').scrollTop = 0;
        }

        function printReceipt() {
            const transaction = window.currentTransaction;
            if (!transaction) {
                showToast('Tiada transaksi untuk dicetak', 2000);
                return;
            }
            
            // Format items list
            const itemsList = transaction.items.map(item => 
                `• ${item.name} - RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})} (${item.category})`
            ).join('\n');
            
            // Create printable receipt
            const printContent = `
                <div id="printContent">
                    <div style="max-width:210mm; margin:0 auto; padding:20mm; font-family:'Inter', sans-serif; font-size:11pt; color:#333;">
                        <!-- Header -->
                        <div style="text-align:center; padding-bottom:20px; margin-bottom:30px; border-bottom:3px solid #88E788;">
                            <div style="font-family:'Lora', serif; font-size:28px; font-weight:700; color:#88E788; margin-bottom:10px;">
                                Baitul<span style="color:#333;">Jenazah</span>
                            </div>
                            <div style="font-size:22px; font-weight:700; margin:15px 0; color:#333; text-transform:uppercase;">
                                Resit Pembayaran
                            </div>
                            <div style="display:flex; justify-content:space-between; margin:20px 0; font-size:10pt; color:#666;">
                                <div>
                                    <strong>No. Rujukan:</strong> ${transaction.orderId}<br>
                                    <strong>Tarikh:</strong> ${transaction.date}<br>
                                    <strong>Masa:</strong> ${transaction.time}
                                </div>
                                <div style="text-align:right;">
                                    No. 123, Jalan Kebajikan<br>
                                    53100 Kuala Lumpur<br>
                                    03-1234 5678
                                </div>
                            </div>
                        </div>
                        
                        <!-- Body -->
                        <div style="margin-bottom:40px;">
                            <!-- Customer Information -->
                            <div style="margin-bottom:30px;">
                                <div style="font-size:13pt; font-weight:600; color:#333; margin-bottom:15px; padding-bottom:8px; border-bottom:2px solid #88E788;">
                                    MAKLUMAT PELANGGAN
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; font-size:10pt;">
                                    <div>
                                        <div style="margin-bottom:10px;">
                                            <strong>Nama:</strong> ${transaction.customer.name}
                                        </div>
                                        <div style="margin-bottom:10px;">
                                            <strong>Telefon:</strong> ${transaction.customer.phone}
                                        </div>
                                        <div style="margin-bottom:10px;">
                                            <strong>Email:</strong> ${transaction.customer.email}
                                        </div>
                                    </div>
                                    <div>
                                        <div style="margin-bottom:10px;">
                                            <strong>Alamat:</strong> ${transaction.customer.address}
                                        </div>
                                        ${transaction.customer.notes ? `
                                        <div style="margin-bottom:10px;">
                                            <strong>Nota:</strong> ${transaction.customer.notes}
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Items List -->
                            <div style="margin-bottom:30px;">
                                <div style="font-size:13pt; font-weight:600; color:#333; margin-bottom:15px; padding-bottom:8px; border-bottom:2px solid #88E788;">
                                    BUTIRAN PESANAN
                                </div>
                                <pre style="background:#f9f9f9; padding:15px; border-radius:6px; font-family:monospace; white-space:pre-line; line-height:1.8; border:1px solid #eee;">${itemsList}</pre>
                            </div>
                            
                            <!-- Payment Information -->
                            <div style="margin-bottom:30px;">
                                <div style="font-size:13pt; font-weight:600; color:#333; margin-bottom:15px; padding-bottom:8px; border-bottom:2px solid #88E788;">
                                    MAKLUMAT PEMBAYARAN
                                </div>
                                <div style="background:#f0fff0; border:2px solid #88E788; padding:25px; text-align:center; border-radius:8px;">
                                    <div>Jumlah Keseluruhan</div>
                                    <div style="font-size:32px; font-weight:bold; color:#2C3E50; margin-top:10px;">
                                        RM ${transaction.total.toLocaleString('en-MY', {minimumFractionDigits: 2})}
                                    </div>
                                    <div style="margin-top:10px; font-size:14px; color:#666;">
                                        Kaedah Pembayaran: Kad Kredit/Debit
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="text-align:center; padding-top:20px; border-top:1px solid #ddd; font-size:9pt; color:#666; line-height:1.5;">
                            <div style="font-size:12pt; color:#88E788; font-weight:600; margin-bottom:15px;">
                                TERIMA KASIH ATAS PEMBELIAN ANDA
                            </div>
                            <p>Resit ini adalah bukti pembayaran sah. Sila simpan untuk rujukan.</p>
                            <p>Perkhidmatan mengikut syariat Islam.</p>
                            <p style="margin-top:15px; font-size:10px; color:#999;">
                                www.baituljenazah.github.io | Dicetak pada: ${new Date().toLocaleString('ms-MY')}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            
            // Open print window
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Resit Baitul Jenazah - ${transaction.orderId}</title>
                    <meta charset="UTF-8">
                    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
                    <style>
                        @page {
                            margin: 15mm;
                            size: A4 portrait;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Inter', sans-serif;
                            background: white;
                            color: black;
                            font-size: 12pt;
                        }
                        @media print {
                            body {
                                margin: 0;
                                padding: 0;
                                width: 210mm;
                                height: 297mm;
                            }
                            .no-print {
                                display: none !important;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        window.onload = function() {
                            // Auto print
                            setTimeout(function() {
                                window.print();
                            }, 500);
                            
                            // Auto close after print
                            window.onafterprint = function() {
                                setTimeout(function() {
                                    window.close();
                                }, 500);
                            };
                        }
                    <\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }

        function completeOrder() {
            // Close checkout modal
            closeCheckout();
            
            // Close cart sidebar
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
            }
            
            // Show success toast
            showToast('Terima kasih! Pesanan anda telah direkodkan.', 3000);
        }

        // Initialize EmailJS
        (function() {
            emailjs.init(EMAILJS_CONFIG.publicKey);
        })();
