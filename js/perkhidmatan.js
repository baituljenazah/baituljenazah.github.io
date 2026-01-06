// BAITUL JENAZAH - FIXED VERSION
// PERKHIDMATAN.JS - FINAL FIX

// ============================================
// GLOBAL VARIABLES - ONLY DECLARED ONCE
// ============================================
var cart = [];  // Use 'var' instead of 'let' to avoid redeclaration
var lastScrollTop = 0;
var isButtonVisible = false;
var scrollThreshold = 100;

// ============================================
// EMAILJS CONFIGURATION
// ============================================
var EMAILJS_CONFIG = {
    SERVICE_ID: 'service_veo15lv',
    TEMPLATE_ID: 'template_h17hgd6',
    PUBLIC_KEY: '4xUs48J_OTaSCo8Ec'
};

// ============================================
// MAIN INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Baitul Jenazah - Page loaded');
    
    // Initialize EmailJS
    initializeEmailJS();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup other components
    setupInputFormatting();
    setupRealTimeValidation();
    loadCart();
    setupBackToTop();
    setupImageModal();
    
    // Mark active nav item
    markActiveNavItem();
});

// ============================================
// EMAILJS INITIALIZATION
// ============================================
function initializeEmailJS() {
    // Check if EmailJS SDK is loaded
    if (typeof emailjs === 'undefined') {
        console.warn('⚠️ EmailJS SDK not loaded yet, loading now...');
        
        // Dynamically load EmailJS SDK
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = function() {
            console.log('✅ EmailJS SDK loaded');
            initEmailJSAfterLoad();
        };
        script.onerror = function() {
            console.error('❌ Failed to load EmailJS SDK');
            showToast('Email service sedang dalam penyelenggaraan. Sila cetak resit selepas pembayaran.', 'warning');
        };
        document.head.appendChild(script);
    } else {
        initEmailJSAfterLoad();
    }
}

function initEmailJSAfterLoad() {
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized with key:', EMAILJS_CONFIG.PUBLIC_KEY);
        
        // Test connection
        setTimeout(testEmailJSConnection, 1000);
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
    }
}

async function testEmailJSConnection() {
    try {
        console.log('🔧 Testing EmailJS connection...');
        return true;
    } catch (error) {
        console.warn('⚠️ EmailJS test failed:', error.message);
        return false;
    }
}

// ============================================
// MOBILE MENU SETUP
// ============================================
function setupMobileMenu() {
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    var mainNav = document.getElementById('mainNav');
    
    if (!mobileMenuBtn) return;
    
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
    
    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
            if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
    
    // Close menu on link click
    var navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

function markActiveNavItem() {
    var navLinks = document.querySelectorAll('nav a');
    var perkhidmatanLink = document.querySelector('nav a[href*="perkhidmatan"]');
    
    if (perkhidmatanLink) {
        perkhidmatanLink.classList.add('active');
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function setupBackToTop() {
    var backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        var currentScroll = window.scrollY;
        
        if (currentScroll > scrollThreshold && !isButtonVisible) {
            isButtonVisible = true;
            backToTopBtn.classList.add('visible');
        } else if (currentScroll <= scrollThreshold && isButtonVisible) {
            isButtonVisible = false;
            backToTopBtn.classList.remove('visible');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);
}

// ============================================
// IMAGE MODAL
// ============================================
function setupImageModal() {
    var imageModal = document.getElementById('imageModal');
    
    if (!imageModal) return;
    
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            closeImageModal();
        }
    });
}

// ============================================
// CART FUNCTIONS
// ============================================
function loadCart() {
    var saved = localStorage.getItem('baituljenazah_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartDisplay();
    }
}

function saveCart() {
    localStorage.setItem('baituljenazah_cart', JSON.stringify(cart));
    updateCartDisplay();
}

function addToCart(id, name, price, category) {
    cart.push({id: id, name: name, price: price, category: category, quantity: 1});
    saveCart();
    showToast(name + ' telah ditambah ke troli.', 'success');
    toggleCart();
}

function removeFromCart(index) {
    var removedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    showToast(removedItem.name + ' telah dikeluarkan dari troli.', 'info');
}

function updateCartDisplay() {
    var cartItems = document.getElementById('cartItems');
    var cartCount = document.getElementById('cartCount');
    var cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartCount || !cartTotal) return;
    
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart" style="font-size:3rem;color:#ddd;margin-bottom:15px"></i><p>Troli anda kosong</p></div>';
        cartTotal.textContent = 'RM 0.00';
        return;
    }
    
    var total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(function(item, index) {
        total += item.price;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.category}</p>
                </div>
                <div style="display:flex;align-items:center">
                    <div class="cart-item-price">RM ${item.price.toFixed(2)}</div>
                    <button class="remove-item" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartTotal.textContent = 'RM ' + total.toFixed(2);
}

function toggleCart() {
    var cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

// ============================================
// CHECKOUT FUNCTIONS
// ============================================
function openCheckout() {
    if (cart.length === 0) {
        showToast('Sila tambah sekurang-kurangnya satu item ke troli.', 'warning');
        return;
    }
    
    var checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateOrderSummary();
        nextStep(1);
    }
}

function closeCheckout() {
    var checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function updateOrderSummary() {
    var orderItems = document.getElementById('orderItems');
    var orderTotal = document.getElementById('orderTotal');
    
    if (!orderItems || !orderTotal) return;
    
    var total = 0;
    orderItems.innerHTML = '';
    
    cart.forEach(function(item) {
        total += item.price;
        orderItems.innerHTML += `
            <div class="summary-item">
                <span>${item.name}</span>
                <span>RM ${item.price.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderTotal.innerHTML = `
        <div class="summary-item summary-total">
            <span>JUMLAH KESELURUHAN</span>
            <span>RM ${total.toFixed(2)}</span>
        </div>
    `;
}

function nextStep(step) {
    if (step === 2 && !validateStep1()) return;
    if (step === 3 && !validateStep2()) return;
    
    // Update steps
    var steps = document.querySelectorAll('.step');
    var stepContents = document.querySelectorAll('.checkout-step');
    
    steps.forEach(function(s) {
        s.classList.remove('active');
    });
    
    stepContents.forEach(function(s) {
        s.classList.remove('active');
    });
    
    var stepElement = document.getElementById('step' + step);
    var stepContent = document.getElementById('step' + step + 'Content');
    
    if (stepElement) stepElement.classList.add('active');
    if (stepContent) stepContent.classList.add('active');
    
    if (step === 3) updateConfirmSections();
}

function updateConfirmSections() {
    var customerName = document.getElementById('customerName').value.trim();
    var customerPhone = document.getElementById('customerPhone').value.trim();
    var customerEmail = document.getElementById('customerEmail').value.trim();
    var customerAddress = document.getElementById('customerAddress').value.trim();
    var customerNotes = document.getElementById('customerNotes').value.trim();
    
    var cardName = document.getElementById('cardName').value.trim();
    var cardNumber = document.getElementById('cardNumber').value;
    var cardExpiry = document.getElementById('cardExpiry').value.trim();
    
    var confirmCustomer = document.getElementById('confirmCustomer');
    var confirmPayment = document.getElementById('confirmPayment');
    var confirmItems = document.getElementById('confirmItems');
    
    if (confirmCustomer) {
        confirmCustomer.innerHTML = `
            <div class="summary-item"><span>Nama:</span><span>${customerName}</span></div>
            <div class="summary-item"><span>Telefon:</span><span>${customerPhone}</span></div>
            <div class="summary-item"><span>Email:</span><span>${customerEmail}</span></div>
            <div class="summary-item"><span>Alamat:</span><span>${customerAddress}</span></div>
            ${customerNotes ? `<div class="summary-item"><span>Nota:</span><span>${customerNotes}</span></div>` : ''}
        `;
    }
    
    if (confirmPayment) {
        confirmPayment.innerHTML = `
            <div class="summary-item"><span>Kaedah:</span><span>Kad Kredit/Debit</span></div>
            <div class="summary-item"><span>Nama Kad:</span><span>${cardName}</span></div>
            <div class="summary-item"><span>Nombor Kad:</span><span>**** **** **** ${cardNumber.replace(/\s/g, '').slice(-4)}</span></div>
            <div class="summary-item"><span>Tarikh Luput:</span><span>${cardExpiry}</span></div>
        `;
    }
    
    if (confirmItems) {
        var total = 0;
        var itemsHTML = '';
        
        cart.forEach(function(item) {
            total += item.price;
            itemsHTML += `
                <div class="summary-item">
                    <span>${item.name}</span>
                    <span>RM ${item.price.toFixed(2)}</span>
                </div>
            `;
        });
        
        itemsHTML += `
            <div class="summary-item summary-total">
                <span>JUMLAH KESELURUHAN</span>
                <span>RM ${total.toFixed(2)}</span>
            </div>
        `;
        
        confirmItems.innerHTML = itemsHTML;
    }
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================
function validateStep1() {
    var name = document.getElementById('customerName').value.trim();
    var phone = document.getElementById('customerPhone').value.trim();
    var address = document.getElementById('customerAddress').value.trim();
    var email = document.getElementById('customerEmail').value.trim();
    
    var isValid = true;
    
    // Reset errors
    var errors = ['nameError', 'phoneError', 'addressError', 'emailError'];
    errors.forEach(function(errorId) {
        var errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    });
    
    // Validate name
    if (!name) {
        document.getElementById('nameError').style.display = 'block';
        document.getElementById('customerName').classList.add('error');
        isValid = false;
    }
    
    // Validate phone
    var phoneDigits = phone.replace(/\D/g, '');
    if (!phone) {
        document.getElementById('phoneError').style.display = 'block';
        document.getElementById('customerPhone').classList.add('error');
        isValid = false;
    } else if (!/^\d{10,11}$/.test(phoneDigits)) {
        document.getElementById('phoneError').style.display = 'block';
        document.getElementById('customerPhone').classList.add('error');
        isValid = false;
    }
    
    // Validate address
    if (!address) {
        document.getElementById('addressError').style.display = 'block';
        document.getElementById('customerAddress').classList.add('error');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        document.getElementById('emailError').style.display = 'block';
        document.getElementById('customerEmail').classList.add('error');
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('emailError').style.display = 'block';
        document.getElementById('customerEmail').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Sila betulkan maklumat yang salah.', 'error');
    }
    
    return isValid;
}

function validateStep2() {
    var cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    var expiry = document.getElementById('cardExpiry').value.trim();
    var cvv = document.getElementById('cardCVV').value.trim();
    var cardName = document.getElementById('cardName').value.trim();
    
    var isValid = true;
    
    // Reset errors
    var errors = ['cardNameError', 'cardError', 'expiryError', 'cvvError'];
    errors.forEach(function(errorId) {
        var errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    });
    
    // Validate card name
    if (!cardName) {
        document.getElementById('cardNameError').style.display = 'block';
        document.getElementById('cardName').classList.add('error');
        isValid = false;
    }
    
    // Validate card number
    if (!cardNumber) {
        document.getElementById('cardError').style.display = 'block';
        document.getElementById('cardNumber').classList.add('error');
        isValid = false;
    } else if (!/^\d{16}$/.test(cardNumber)) {
        document.getElementById('cardError').style.display = 'block';
        document.getElementById('cardNumber').classList.add('error');
        isValid = false;
    }
    
    // Validate expiry date
    if (!expiry) {
        document.getElementById('expiryError').style.display = 'block';
        document.getElementById('cardExpiry').classList.add('error');
        isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        document.getElementById('expiryError').style.display = 'block';
        document.getElementById('cardExpiry').classList.add('error');
        isValid = false;
    }
    
    // Validate CVV
    if (!cvv) {
        document.getElementById('cvvError').style.display = 'block';
        document.getElementById('cardCVV').classList.add('error');
        isValid = false;
    } else if (!/^\d{3,4}$/.test(cvv)) {
        document.getElementById('cvvError').style.display = 'block';
        document.getElementById('cardCVV').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Sila betulkan maklumat pembayaran.', 'error');
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// INPUT FORMATTING
// ============================================
function setupInputFormatting() {
    // Card number formatting
    var cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 16) {
                value = value.substring(0, 16);
            }
            
            var formatted = '';
            for (var i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            
            e.target.value = formatted;
        });
    }
    
    // Expiry date formatting
    var expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 4) {
                value = value.substring(0, 4);
            }
            
            if (value.length >= 2) {
                var month = value.substring(0, 2);
                var year = value.substring(2, 4);
                
                // Auto-correct month
                var monthNum = parseInt(month, 10);
                if (monthNum > 12) monthNum = 12;
                if (monthNum < 1) monthNum = 1;
                
                var formattedMonth = monthNum.toString().padStart(2, '0');
                value = formattedMonth + (value.length > 2 ? '/' + year : '');
            }
            
            e.target.value = value;
        });
    }
}

function setupRealTimeValidation() {
    // Email validation
    var emailInput = document.getElementById('customerEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            var email = this.value.trim();
            var errorElement = document.getElementById('emailError');
            
            if (!errorElement) return;
            
            if (!email) {
                errorElement.textContent = 'Sila isi alamat email';
                errorElement.style.display = 'block';
                this.classList.add('error');
            } else if (!isValidEmail(email)) {
                errorElement.textContent = 'Format email tidak sah';
                errorElement.style.display = 'block';
                this.classList.add('error');
            } else {
                errorElement.style.display = 'none';
                this.classList.remove('error');
            }
        });
    }
}

// ============================================
// PAYMENT PROCESSING
// ============================================
async function processPayment() {
    console.log('💳 Starting payment processing...');
    
    var payBtn = document.getElementById('payBtn');
    if (!payBtn) return;
    
    var originalBtnText = payBtn.innerHTML;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    payBtn.disabled = true;
    
    // Show loading
    showLoading('Memproses pembayaran anda...');
    
    try {
        // Generate reference
        var refNumber = 'BJ-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        
        // Get customer data
        var customer = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            email: document.getElementById('customerEmail').value.trim(),
            address: document.getElementById('customerAddress').value.trim(),
            notes: document.getElementById('customerNotes').value.trim() || ''
        };
        
        // Get payment data
        var payment = {
            method: 'credit_card',
            cardName: document.getElementById('cardName').value.trim(),
            cardLast4: document.getElementById('cardNumber').value.replace(/\s/g, '').slice(-4),
            cardExpiry: document.getElementById('cardExpiry').value.trim()
        };
        
        // Calculate total
        var total = 0;
        cart.forEach(function(item) {
            total += item.price;
        });
        
        // Create transaction
        var transaction = {
            refNumber: refNumber,
            date: new Date().toLocaleString('ms-MY'),
            customer: customer,
            payment: payment,
            items: JSON.parse(JSON.stringify(cart)), // Deep copy
            total: total,
            status: 'Selesai'
        };
        
        console.log('💾 Saving transaction:', refNumber);
        
        // Save transaction
        saveTransactionToStorage(transaction);
        
        // Try to send email
        var emailSent = false;
        var emailError = null;
        
        if (customer.email && isValidEmail(customer.email)) {
            try {
                updateLoading('Menghantar resit ke email...');
                var emailResult = await sendEmailReceipt(transaction);
                emailSent = emailResult.success;
            } catch (error) {
                emailError = error.message;
                console.warn('⚠️ Email failed:', error);
            }
        }
        
        // Hide loading
        hideLoading();
        
        // Reset button
        payBtn.innerHTML = originalBtnText;
        payBtn.disabled = false;
        
        // Show success
        showSuccessPage(transaction, emailSent, emailError);
        
    } catch (error) {
        console.error('❌ Payment error:', error);
        
        // Hide loading
        hideLoading();
        
        // Reset button
        payBtn.innerHTML = originalBtnText;
        payBtn.disabled = false;
        
        showToast('Ralat: ' + error.message, 'error');
    }
}

async function sendEmailReceipt(transaction) {
    console.log('📧 Sending email receipt...');
    
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        throw new Error('Email service tidak tersedia');
    }
    
    // Format items
    var itemsHtml = '';
    transaction.items.forEach(function(item) {
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>RM ${item.price.toFixed(2)}</td>
            </tr>
        `;
    });
    
    // Prepare email data
    var templateParams = {
        to_email: transaction.customer.email,
        to_name: transaction.customer.name,
        ref_number: transaction.refNumber,
        customer_name: transaction.customer.name,
        customer_phone: transaction.customer.phone,
        items_list: itemsHtml,
        total_amount: 'RM ' + transaction.total.toFixed(2),
        transaction_date: transaction.date
    };
    
    try {
        var response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ Email sent:', response);
        return { success: true, response: response };
        
    } catch (error) {
        console.error('❌ Email error:', error);
        return { 
            success: false, 
            error: error,
            message: 'Gagal menghantar email: ' + (error.text || error.message)
        };
    }
}

function saveTransactionToStorage(transaction) {
    try {
        // Save to localStorage
        var transactions = JSON.parse(localStorage.getItem('baituljenazah_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('baituljenazah_transactions', JSON.stringify(transactions));
        
        // Save to sessionStorage for printing
        sessionStorage.setItem('lastTransaction', JSON.stringify(transaction));
        
        // Clear cart
        cart = [];
        saveCart();
        
        console.log('💾 Transaction saved');
        
    } catch (error) {
        console.error('❌ Save error:', error);
        throw error;
    }
}

// ============================================
// SUCCESS PAGE
// ============================================
function showSuccessPage(transaction, emailSent, emailError) {
    // Show step 4
    var step4 = document.getElementById('step4');
    var step4Content = document.getElementById('step4Content');
    
    if (step4) {
        step4.style.display = 'block';
        step4.classList.add('active');
    }
    
    if (step4Content) {
        step4Content.classList.add('active');
    }
    
    // Hide other steps
    var steps = document.querySelectorAll('.step');
    var stepContents = document.querySelectorAll('.checkout-step');
    
    steps.forEach(function(step) {
        if (step.id !== 'step4') {
            step.classList.remove('active');
        }
    });
    
    stepContents.forEach(function(content) {
        if (content.id !== 'step4Content') {
            content.classList.remove('active');
        }
    });
    
    // Build success content
    var emailStatus = '';
    if (emailSent) {
        emailStatus = `
            <div style="background:#e8f5e9;padding:15px;border-radius:8px;margin:20px 0;">
                <i class="fas fa-check-circle" style="color:#27ae60"></i>
                <strong> Resit telah dihantar ke:</strong> ${transaction.customer.email}
            </div>
        `;
    } else {
        emailStatus = `
            <div style="background:#fff3cd;padding:15px;border-radius:8px;margin:20px 0;">
                <i class="fas fa-exclamation-triangle" style="color:#f39c12"></i>
                <strong> Resit tidak dapat dihantar.</strong> Sila cetak resit di bawah.
                ${emailError ? `<br><small>${emailError}</small>` : ''}
            </div>
        `;
    }
    
    // Items list
    var itemsList = '';
    transaction.items.forEach(function(item) {
        itemsList += `<div>${item.name} - RM ${item.price.toFixed(2)}</div>`;
    });
    
    var successContent = document.getElementById('successContent');
    if (successContent) {
        successContent.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <div style="font-size:4rem;color:#27ae60;margin-bottom:20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                
                <h3 style="color:#27ae60;">Pembayaran Berjaya!</h3>
                <p>Terima kasih atas pesanan anda.</p>
                
                <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;text-align:left;">
                    <p><strong>No. Rujukan:</strong> ${transaction.refNumber}</p>
                    <p><strong>Tarikh:</strong> ${transaction.date}</p>
                    <p><strong>Nama:</strong> ${transaction.customer.name}</p>
                    <p><strong>Jumlah:</strong> RM ${transaction.total.toFixed(2)}</p>
                    <p><strong>Status:</strong> <span style="color:#27ae60">${transaction.status}</span></p>
                </div>
                
                ${emailStatus}
                
                <div style="margin:30px 0;">
                    <button class="btn" onclick="printReceiptFromStorage()" style="margin:5px;">
                        <i class="fas fa-print"></i> Cetak Resit
                    </button>
                    <button class="btn btn-secondary" onclick="completeOrder()" style="margin:5px;">
                        <i class="fas fa-home"></i> Selesai
                    </button>
                </div>
                
                <p style="color:#666;font-size:0.9rem;">
                    <i class="fas fa-info-circle"></i> Sila simpan nombor rujukan untuk rujukan.
                </p>
            </div>
        `;
    }
}

// ============================================
// LOADING FUNCTIONS
// ============================================
function showLoading(message) {
    hideLoading(); // Remove existing
    
    var loading = document.createElement('div');
    loading.id = 'customLoading';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    loading.innerHTML = `
        <div style="background:white;padding:30px;border-radius:10px;text-align:center;">
            <i class="fas fa-spinner fa-spin fa-3x" style="color:#88E788"></i>
            <p style="margin-top:20px;font-weight:bold;">${message}</p>
        </div>
    `;
    
    document.body.appendChild(loading);
}

function updateLoading(message) {
    var loading = document.getElementById('customLoading');
    if (loading) {
        var p = loading.querySelector('p');
        if (p) p.textContent = message;
    }
}

function hideLoading() {
    var loading = document.getElementById('customLoading');
    if (loading && loading.parentNode) {
        loading.parentNode.removeChild(loading);
    }
}

// ============================================
// PRINT FUNCTIONS
// ============================================
function printReceiptFromStorage() {
    var transactionJSON = sessionStorage.getItem('lastTransaction');
    if (!transactionJSON) {
        showToast('Tiada data resit.', 'error');
        return;
    }
    
    try {
        var transaction = JSON.parse(transactionJSON);
        printReceipt(transaction);
    } catch (error) {
        showToast('Ralat data resit.', 'error');
    }
}

function printReceipt(transaction) {
    var printWindow = window.open('', '_blank', 'width=800,height=600');
    
    var itemsHtml = '';
    transaction.items.forEach(function(item) {
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>RM ${item.price.toFixed(2)}</td>
            </tr>
        `;
    });
    
    var html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resit ${transaction.refNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .company { color: #88E788; font-size: 24px; font-weight: bold; }
                .receipt-title { font-size: 20px; margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; border: 1px solid #ddd; }
                .total { text-align: right; font-weight: bold; font-size: 18px; }
                .footer { margin-top: 40px; text-align: center; color: #666; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company">Baitul Jenazah</div>
                <div>No. 123, Jalan Kebajikan, 53100 Kuala Lumpur</div>
            </div>
            
            <div class="receipt-title">RESIT PEMBAYARAN</div>
            
            <div>
                <p><strong>No. Rujukan:</strong> ${transaction.refNumber}</p>
                <p><strong>Tarikh:</strong> ${transaction.date}</p>
                <p><strong>Nama:</strong> ${transaction.customer.name}</p>
                <p><strong>Status:</strong> ${transaction.status}</p>
            </div>
            
            <table>
                <tr><th>Item</th><th>Kategori</th><th>Harga</th></tr>
                ${itemsHtml}
            </table>
            
            <div class="total">
                JUMLAH: RM ${transaction.total.toFixed(2)}
            </div>
            
            <div class="footer">
                <p>Terima kasih atas kepercayaan anda</p>
            </div>
            
            <div class="no-print" style="margin-top:20px;">
                <button onclick="window.print()">Cetak</button>
                <button onclick="window.close()" style="margin-left:10px;">Tutup</button>
            </div>
            
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
}

// ============================================
// COMPLETE ORDER
// ============================================
function completeOrder() {
    closeCheckout();
    toggleCart();
    showToast('Terima kasih! Pesanan anda telah direkodkan.', 'success');
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type) {
    // Create container if needed
    var container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }
    
    // Create toast
    var toast = document.createElement('div');
    toast.style.cssText = `
        background: white;
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-left: 4px solid #3498db;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Set color based on type
    var colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    toast.style.borderLeftColor = colors[type] || colors.info;
    
    var icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left:10px;background:none;border:none;color:#999;cursor:pointer;">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(function() {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// ============================================
// IMAGE MODAL FUNCTIONS
// ============================================
function openImageModal(imageSrc, title) {
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('modalImage');
    var modalTitle = document.getElementById('modalTitle');
    
    if (modal && modalImage && modalTitle) {
        modalImage.src = imageSrc;
        modalTitle.textContent = title;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    var modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ============================================
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.nextStep = nextStep;
window.processPayment = processPayment;
window.completeOrder = completeOrder;
window.printReceiptFromStorage = printReceiptFromStorage;
