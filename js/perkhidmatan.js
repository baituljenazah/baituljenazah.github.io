// Initialize variables
let cart = [];
let lastScrollTop = 0;
let isButtonVisible = false;
const scrollThreshold = 100;

// EmailJS Configuration - VERIFY THESE ARE CORRECT
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_veo15lv',
    TEMPLATE_ID: 'template_h17hgd6',
    PUBLIC_KEY: '4xUs48J_OTaSCo8Ec',
    USER_ID: '4xUs48J_OTaSCo8Ec' // Same as PUBLIC_KEY for EmailJS v3
};

// Initialize EmailJS when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mainNav = document.getElementById('mainNav');
    const backToTopBtn = document.getElementById('backToTop');
    const imageModal = document.getElementById('imageModal');
    
    // Initialize EmailJS - FIXED VERSION
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
            console.log('✅ EmailJS initialized with key:', EMAILJS_CONFIG.PUBLIC_KEY);
            
            // Test EmailJS connection
            testEmailJSConnection();
        } catch (error) {
            console.error('❌ EmailJS initialization failed:', error);
            showToast('Email service sedang dalam penyelenggaraan. Sila cetak resit selepas pembayaran.', 'warning');
        }
    } else {
        console.error('❌ EmailJS SDK not loaded. Check script tag.');
        showToast('Email service tidak tersedia. Sila hubungi kami untuk resit.', 'warning');
    }
    
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
});

// ============================================
// EMAILJS FUNCTIONS - FIXED VERSION
// ============================================

async function testEmailJSConnection() {
    try {
        console.log('🔧 Testing EmailJS connection...');
        // Simple test to see if EmailJS is working
        const test = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            {
                to_email: "test@example.com",
                to_name: "Test User",
                ref_number: "TEST-CONNECTION",
                customer_name: "Connection Test",
                message: "This is a connection test"
            }
        );
        console.log('✅ EmailJS connection test passed');
        return true;
    } catch (error) {
        console.warn('⚠️ EmailJS connection test failed (this is OK for now):', error.message);
        return false;
    }
}

async function sendTransactionEmail(transaction) {
    console.log('📧 Starting email send for transaction:', transaction.refNumber);
    
    try {
        // Validate email
        if (!transaction.customer.email || !isValidEmail(transaction.customer.email)) {
            throw new Error('Email tidak sah: ' + transaction.customer.email);
        }
        
        // Format items as HTML table rows
        const itemsHtml = transaction.items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.category}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">RM ${item.price.toFixed(2)}</td>
            </tr>
        `).join('');
        
        // Calculate total
        const total = transaction.items.reduce((sum, item) => sum + item.price, 0);
        
        // Prepare email parameters - SIMPLE AND CLEAN
        const templateParams = {
            // Recipient
            to_email: transaction.customer.email,
            to_name: transaction.customer.name,
            
            // Transaction details
            ref_number: transaction.refNumber,
            transaction_date: transaction.date,
            
            // Customer info
            customer_name: transaction.customer.name,
            customer_phone: transaction.customer.phone,
            customer_email: transaction.customer.email,
            customer_address: transaction.customer.address,
            customer_notes: transaction.customer.notes || 'Tiada nota',
            
            // Order details
            items_list: itemsHtml,
            item_count: transaction.items.length,
            total_amount: `RM ${total.toFixed(2)}`,
            
            // Payment info
            payment_method: 'Kad Kredit/Debit',
            payment_last4: transaction.payment.cardLast4,
            
            // Company info
            company_name: 'Baitul Jenazah',
            company_phone: '03-1234 5678',
            company_email: 'info@baituljenazah.my'
        };
        
        console.log('📤 Sending email with params:', templateParams);
        
        // Send email using EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ Email sent successfully!', response);
        return {
            success: true,
            message: 'Email berjaya dihantar',
            response: response
        };
        
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Gagal menghantar email';
        if (error.status === 400) {
            errorMessage = 'Template email tidak dijumpai';
        } else if (error.status === 401) {
            errorMessage = 'Kunci EmailJS tidak sah';
        } else if (error.status === 402) {
            errorMessage = 'Kuota email habis';
        } else if (error.text) {
            errorMessage = error.text;
        }
        
        return {
            success: false,
            message: errorMessage,
            error: error
        };
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// PAYMENT PROCESSING - FIXED VERSION
// ============================================

async function processPayment() {
    console.log('💳 Starting payment processing...');
    
    const payBtn = document.getElementById('payBtn');
    const originalBtnText = payBtn.innerHTML;
    
    // Disable button and show loading
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    payBtn.disabled = true;
    
    // Show loading overlay
    showLoadingOverlay('Memproses pembayaran anda...');
    
    try {
        // Generate reference number
        const refNumber = 'BJ-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        
        // Collect customer data
        const customer = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            email: document.getElementById('customerEmail').value.trim(),
            address: document.getElementById('customerAddress').value.trim(),
            notes: document.getElementById('customerNotes').value.trim() || ''
        };
        
        // Collect payment data
        const payment = {
            method: 'credit_card',
            cardName: document.getElementById('cardName').value.trim(),
            cardLast4: document.getElementById('cardNumber').value.replace(/\s/g, '').slice(-4),
            cardExpiry: document.getElementById('cardExpiry').value.trim()
        };
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        // Create transaction object
        const transaction = {
            refNumber: refNumber,
            date: new Date().toLocaleString('ms-MY', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: new Date().toISOString(),
            customer: customer,
            payment: payment,
            items: [...cart], // Copy cart items
            total: total,
            status: 'Selesai'
        };
        
        console.log('💾 Saving transaction:', transaction.refNumber);
        
        // 1. Save transaction to storage FIRST
        saveTransaction(transaction);
        
        // 2. Try to send email
        let emailResult = null;
        let emailSent = false;
        
        if (customer.email && isValidEmail(customer.email)) {
            console.log('📧 Attempting to send email receipt...');
            updateLoadingMessage('Menghantar resit ke email anda...');
            
            try {
                emailResult = await sendTransactionEmail(transaction);
                emailSent = emailResult.success;
                
                if (emailSent) {
                    console.log('✅ Email sent successfully');
                } else {
                    console.warn('⚠️ Email sending failed:', emailResult.message);
                }
            } catch (emailError) {
                console.error('❌ Email sending error:', emailError);
                emailResult = {
                    success: false,
                    message: 'Ralat menghantar email: ' + emailError.message
                };
            }
        } else {
            console.warn('⚠️ No valid email provided, skipping email sending');
            emailResult = {
                success: false,
                message: 'Emel tidak sah, resit tidak dihantar'
            };
        }
        
        // Remove loading overlay
        removeLoadingOverlay();
        
        // Reset button
        payBtn.innerHTML = originalBtnText;
        payBtn.disabled = false;
        
        // Show success page
        showSuccessPage(transaction, emailSent, emailResult);
        
    } catch (error) {
        console.error('❌ Payment processing error:', error);
        
        // Remove loading overlay
        removeLoadingOverlay();
        
        // Reset button
        payBtn.innerHTML = originalBtnText;
        payBtn.disabled = false;
        
        // Show error message
        showToast('Ralat memproses pembayaran: ' + error.message, 'error');
    }
}

// ============================================
// SUCCESS PAGE - FIXED VERSION
// ============================================

function showSuccessPage(transaction, emailSent = false, emailResult = null) {
    // Hide all other steps
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    
    // Show step 4
    document.getElementById('step4').style.display = 'block';
    document.getElementById('step4').classList.add('active');
    document.getElementById('step4Content').classList.add('active');
    
    // Prepare email status HTML
    let emailStatusHTML = '';
    if (emailSent) {
        emailStatusHTML = `
            <div class="email-success">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Resit telah dihantar ke:</strong> ${transaction.customer.email}
                    <br><small>Sila semak folder spam jika tiada dalam inbox dalam 5 minit.</small>
                </div>
            </div>
        `;
    } else {
        const reason = emailResult?.message || 'Emel tidak sah atau ralat teknikal';
        emailStatusHTML = `
            <div class="email-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <strong>Resit tidak dapat dihantar:</strong> ${reason}
                    <br><small>Sila cetak resit di bawah atau hubungi kami dengan nombor rujukan.</small>
                </div>
            </div>
        `;
    }
    
    // Generate items list HTML
    const itemsListHTML = transaction.items.map(item => `
        <div class="summary-item">
            <span>${item.name} (${item.category})</span>
            <span>RM ${item.price.toFixed(2)}</span>
        </div>
    `).join('');
    
    // Update success content
    document.getElementById('successContent').innerHTML = `
        <div class="success-message">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            
            <h3>Pembayaran Berjaya!</h3>
            <p>Terima kasih atas pesanan anda. Transaksi telah berjaya diproses.</p>
            
            <div class="transaction-details">
                <h4>Maklumat Transaksi</h4>
                <p><strong>No. Rujukan:</strong> ${transaction.refNumber}</p>
                <p><strong>Tarikh & Masa:</strong> ${transaction.date}</p>
                <p><strong>Status:</strong> <span class="status-success">${transaction.status}</span></p>
                
                <h4 style="margin-top: 20px;">Maklumat Pelanggan</h4>
                <p><strong>Nama:</strong> ${transaction.customer.name}</p>
                <p><strong>Telefon:</strong> ${transaction.customer.phone}</p>
                <p><strong>Email:</strong> ${transaction.customer.email}</p>
                
                <h4 style="margin-top: 20px;">Butiran Pesanan</h4>
                ${itemsListHTML}
                
                <div class="summary-total">
                    <span>JUMLAH KESELURUHAN</span>
                    <span>RM ${transaction.total.toFixed(2)}</span>
                </div>
            </div>
            
            ${emailStatusHTML}
            
            <div class="success-actions">
                <button class="btn btn-print" onclick="printReceiptFromStorage()">
                    <i class="fas fa-print"></i> Cetak Resit
                </button>
                <button class="btn btn-secondary" onclick="completeOrder()">
                    <i class="fas fa-home"></i> Selesai
                </button>
                <button class="btn btn-copy" onclick="copyReferenceNumber('${transaction.refNumber}')">
                    <i class="fas fa-copy"></i> Salin No. Rujukan
                </button>
            </div>
            
            <p class="success-note">
                <i class="fas fa-info-circle"></i>
                Sila simpan nombor rujukan untuk rujukan masa hadapan.
            </p>
        </div>
    `;
}

// ============================================
// LOADING OVERLAY FUNCTIONS
// ============================================

function showLoadingOverlay(message = 'Memproses...') {
    // Remove existing overlay if any
    removeLoadingOverlay();
    
    // Create new overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="loading-text">${message}</div>
            <div class="loading-subtext">Sila tunggu sebentar...</div>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
}

function updateLoadingMessage(message) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        const loadingText = loadingOverlay.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
        }
    }
}

function removeLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay && loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
    }
}

// ============================================
// OTHER ESSENTIAL FUNCTIONS
// ============================================

// Image Modal Functions
function openImageModal(imageSrc, title) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cart Functions
function loadCart() {
    const saved = localStorage.getItem('baituljenazah_cart');
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
    cart.push({id, name, price, category, quantity: 1});
    saveCart();
    showToast(`${name} telah ditambah ke troli.`, 'success');
    toggleCart();
}

function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    showToast(`${removedItem.name} telah dikeluarkan dari troli.`, 'info');
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Troli anda kosong</p></div>';
        cartTotal.textContent = 'RM 0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.category}</p>
                </div>
                <div class="cart-item-actions">
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
    document.getElementById('cartSidebar').classList.toggle('active');
}

// Checkout Functions
function openCheckout() {
    if (cart.length === 0) {
        showToast('Sila tambah sekurang-kurangnya satu item ke troli.', 'warning');
        return;
    }
    document.getElementById('checkoutModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    updateOrderSummary();
    nextStep(1);
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    let total = 0;
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
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
    
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    
    document.getElementById('step' + step).classList.add('active');
    document.getElementById('step' + step + 'Content').classList.add('active');
    
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
        <div class="summary-item"><span>Nama:</span><span>${customerName}</span></div>
        <div class="summary-item"><span>Telefon:</span><span>${customerPhone}</span></div>
        <div class="summary-item"><span>Email:</span><span>${customerEmail}</span></div>
        <div class="summary-item"><span>Alamat:</span><span>${customerAddress}</span></div>
        ${customerNotes ? `<div class="summary-item"><span>Nota:</span><span>${customerNotes}</span></div>` : ''}
    `;
    
    document.getElementById('confirmPayment').innerHTML = `
        <div class="summary-item"><span>Kaedah:</span><span>Kad Kredit/Debit</span></div>
        <div class="summary-item"><span>Nama Kad:</span><span>${cardName}</span></div>
        <div class="summary-item"><span>Nombor Kad:</span><span>**** **** **** ${cardNumber.replace(/\s/g, '').slice(-4)}</span></div>
        <div class="summary-item"><span>Tarikh Luput:</span><span>${cardExpiry}</span></div>
    `;
    
    let total = 0;
    let itemsHTML = '';
    cart.forEach(item => {
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
    
    document.getElementById('confirmItems').innerHTML = itemsHTML;
}

// Validation Functions
function validateStep1() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const addressError = document.getElementById('addressError');
    const emailError = document.getElementById('emailError');
    
    let isValid = true;
    
    // Reset errors
    [nameError, phoneError, addressError, emailError].forEach(el => {
        el.style.display = 'none';
        if (el.previousElementSibling) {
            el.previousElementSibling.classList.remove('error');
        }
    });
    
    // Validate name
    if (!name) {
        nameError.textContent = 'Sila isi nama penuh';
        nameError.style.display = 'block';
        document.getElementById('customerName').classList.add('error');
        isValid = false;
    }
    
    // Validate phone
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone) {
        phoneError.textContent = 'Sila isi nombor telefon';
        phoneError.style.display = 'block';
        document.getElementById('customerPhone').classList.add('error');
        isValid = false;
    } else if (!/^\d{10,11}$/.test(phoneDigits)) {
        phoneError.textContent = 'Sila masukkan nombor telefon yang sah (10-11 digit)';
        phoneError.style.display = 'block';
        document.getElementById('customerPhone').classList.add('error');
        isValid = false;
    }
    
    // Validate address
    if (!address) {
        addressError.textContent = 'Sila isi alamat penuh';
        addressError.style.display = 'block';
        document.getElementById('customerAddress').classList.add('error');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        emailError.textContent = 'Sila isi alamat email';
        emailError.style.display = 'block';
        document.getElementById('customerEmail').classList.add('error');
        isValid = false;
    } else if (!isValidEmail(email)) {
        emailError.textContent = 'Sila masukkan alamat email yang sah (contoh: nama@email.com)';
        emailError.style.display = 'block';
        document.getElementById('customerEmail').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Sila betulkan maklumat yang salah.', 'error');
    }
    
    return isValid;
}

function validateStep2() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry').value.trim();
    const cvv = document.getElementById('cardCVV').value.trim();
    const cardName = document.getElementById('cardName').value.trim();
    
    const cardNameError = document.getElementById('cardNameError');
    const cardError = document.getElementById('cardError');
    const expiryError = document.getElementById('expiryError');
    const cvvError = document.getElementById('cvvError');
    
    let isValid = true;
    
    // Reset errors
    [cardNameError, cardError, expiryError, cvvError].forEach(el => {
        el.style.display = 'none';
        if (el.previousElementSibling) {
            el.previousElementSibling.classList.remove('error');
        }
    });
    
    // Validate card name
    if (!cardName) {
        cardNameError.textContent = 'Sila isi nama pada kad';
        cardNameError.style.display = 'block';
        document.getElementById('cardName').classList.add('error');
        isValid = false;
    }
    
    // Validate card number
    if (!cardNumber) {
        cardError.textContent = 'Sila isi nombor kad';
        cardError.style.display = 'block';
        document.getElementById('cardNumber').classList.add('error');
        isValid = false;
    } else if (!/^\d{16}$/.test(cardNumber)) {
        cardError.textContent = 'Sila masukkan 16 digit nombor kad yang sah';
        cardError.style.display = 'block';
        document.getElementById('cardNumber').classList.add('error');
        isValid = false;
    }
    
    // Validate expiry date
    if (!expiry) {
        expiryError.textContent = 'Sila isi tarikh luput kad';
        expiryError.style.display = 'block';
        document.getElementById('cardExpiry').classList.add('error');
        isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        expiryError.textContent = 'Format tarikh luput tidak sah. Gunakan format MM/YY';
        expiryError.style.display = 'block';
        document.getElementById('cardExpiry').classList.add('error');
        isValid = false;
    } else {
        const [monthStr, yearStr] = expiry.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        
        if (month < 1 || month > 12) {
            expiryError.textContent = 'Bulan mesti antara 01 hingga 12';
            expiryError.style.display = 'block';
            document.getElementById('cardExpiry').classList.add('error');
            isValid = false;
        } else {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                expiryError.textContent = 'Kad kredit/debit telah tamat tempoh';
                expiryError.style.display = 'block';
                document.getElementById('cardExpiry').classList.add('error');
                isValid = false;
            }
        }
    }
    
    // Validate CVV
    if (!cvv) {
        cvvError.textContent = 'Sila isi kod CVV';
        cvvError.style.display = 'block';
        document.getElementById('cardCVV').classList.add('error');
        isValid = false;
    } else if (!/^\d{3,4}$/.test(cvv)) {
        cvvError.textContent = 'Sila masukkan CVV yang sah (3-4 digit)';
        cvvError.style.display = 'block';
        document.getElementById('cardCVV').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Sila betulkan maklumat pembayaran.', 'error');
    }
    
    return isValid;
}

function setupInputFormatting() {
    // Format card number input (4-4-4-4)
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 16) {
                value = value.substring(0, 16);
            }
            
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            
            e.target.value = formatted;
            
            // Validate real-time
            const errorElement = document.getElementById('cardError');
            if (value.length < 16 && value.length > 0) {
                errorElement.textContent = `Nombor kad perlu 16 digit (masih kurang ${16 - value.length} digit)`;
                errorElement.style.display = 'block';
                e.target.classList.add('error');
            } else if (value.length === 16) {
                errorElement.style.display = 'none';
                e.target.classList.remove('error');
            }
        });
    }
    
    // Format expiry date input (MM/YY)
    const expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 4) {
                value = value.substring(0, 4);
            }
            
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
                
                const formattedMonth = monthNum.toString().padStart(2, '0');
                value = formattedMonth + (value.length > 2 ? '/' + year : '');
            }
            
            e.target.value = value;
            
            // Auto-focus to CVV if expiry is complete
            if (value.length === 5) {
                document.getElementById('cardCVV').focus();
            }
        });
    }
    
    // Format CVV input (3-4 digits)
    const cvvInput = document.getElementById('cardCVV');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 4) {
                value = value.substring(0, 4);
            }
            
            e.target.value = value;
            
            // Validate real-time
            const errorElement = document.getElementById('cvvError');
            if (value.length > 0 && (value.length < 3 || value.length > 4)) {
                errorElement.textContent = 'CVV perlu 3-4 digit';
                errorElement.style.display = 'block';
                e.target.classList.add('error');
            } else {
                errorElement.style.display = 'none';
                e.target.classList.remove('error');
            }
        });
    }
}

function setupRealTimeValidation() {
    // Email validation real-time
    const emailInput = document.getElementById('customerEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const errorElement = document.getElementById('emailError');
            
            if (!email) {
                errorElement.textContent = 'Sila isi alamat email';
                errorElement.style.display = 'block';
                this.classList.add('error');
            } else if (!isValidEmail(email)) {
                errorElement.textContent = 'Format email tidak sah (contoh: nama@email.com)';
                errorElement.style.display = 'block';
                this.classList.add('error');
            } else {
                errorElement.style.display = 'none';
                this.classList.remove('error');
            }
        });
    }
}

// Transaction Storage
function saveTransaction(transaction) {
    try {
        // Save to localStorage for history
        const transactions = JSON.parse(localStorage.getItem('baituljenazah_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('baituljenazah_transactions', JSON.stringify(transactions));
        
        // Save to sessionStorage for immediate printing
        sessionStorage.setItem('lastTransaction', JSON.stringify(transaction));
        
        // Clear cart after successful payment
        cart = [];
        saveCart();
        
        console.log('💾 Transaction saved:', transaction.refNumber);
        
    } catch (error) {
        console.error('❌ Error saving transaction:', error);
        throw error;
    }
}

// Complete Order
function completeOrder() {
    closeCheckout();
    toggleCart();
    showToast('Terima kasih! Pesanan anda telah direkodkan.', 'success');
}

// Print Functions
function printReceiptFromStorage() {
    const transactionJSON = sessionStorage.getItem('lastTransaction');
    if (!transactionJSON) {
        showToast('Data resit tidak ditemui. Sila hubungi admin.', 'error');
        return;
    }
    
    try {
        const transaction = JSON.parse(transactionJSON);
        printReceipt(transaction);
    } catch (error) {
        console.error('❌ Error parsing transaction:', error);
        showToast('Ralat: Data resit tidak sah.', 'error');
    }
}

function printReceipt(transaction) {
    // Create printable window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // Build receipt HTML
    const itemsHtml = transaction.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td style="text-align: right;">RM ${item.price.toFixed(2)}</td>
        </tr>
    `).join('');
    
    const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resit - ${transaction.refNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .company-name { font-size: 24px; font-weight: bold; color: #88E788; }
                .receipt-title { font-size: 20px; margin: 20px 0; text-align: center; }
                .transaction-info { margin-bottom: 20px; }
                .info-item { margin: 5px 0; }
                .info-label { font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                th { background-color: #f5f5f5; }
                .total { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company-name">Baitul Jenazah</div>
                <div>No. 123, Jalan Kebajikan, 53100 Kuala Lumpur</div>
                <div>Tel: 03-1234 5678 | Email: info@baituljenazah.my</div>
            </div>
            
            <div class="receipt-title">RESIT PEMBAYARAN</div>
            
            <div class="transaction-info">
                <div class="info-item"><span class="info-label">No. Rujukan:</span> ${transaction.refNumber}</div>
                <div class="info-item"><span class="info-label">Tarikh:</span> ${transaction.date}</div>
                <div class="info-item"><span class="info-label">Status:</span> ${transaction.status}</div>
            </div>
            
            <div class="transaction-info">
                <div class="info-item"><span class="info-label">Nama:</span> ${transaction.customer.name}</div>
                <div class="info-item"><span class="info-label">Telefon:</span> ${transaction.customer.phone}</div>
                <div class="info-item"><span class="info-label">Email:</span> ${transaction.customer.email}</div>
                <div class="info-item"><span class="info-label">Alamat:</span> ${transaction.customer.address}</div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div class="total">
                JUMLAH: RM ${transaction.total.toFixed(2)}
            </div>
            
            <div class="footer">
                <p>Terima kasih atas kepercayaan anda</p>
                <p>Resit ini sah sebagai bukti pembayaran</p>
                <p>*** Dijana secara automatik pada ${new Date().toLocaleString('ms-MY')} ***</p>
            </div>
            
            <div class="no-print" style="margin-top: 20px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #88E788; border: none; cursor: pointer;">
                    Cetak Resit
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; cursor: pointer; margin-left: 10px;">
                    Tutup
                </button>
            </div>
            
            <script>
                // Auto print after load
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
}

// Copy Reference Number
function copyReferenceNumber(refNumber) {
    navigator.clipboard.writeText(refNumber)
        .then(() => {
            showToast('Nombor rujukan disalin: ' + refNumber, 'success');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Gagal menyalin nombor rujukan', 'error');
        });
}

// Toast Notification System
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Export functions to global scope
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
window.copyReferenceNumber = copyReferenceNumber;
