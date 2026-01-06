// Initialize variables
let cart = [];
let lastScrollTop = 0;
let isButtonVisible = false;
const scrollThreshold = 100;

// EmailJS Configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_veo15lv',
    TEMPLATE_ID: 'template_h17hgd6',
    PUBLIC_KEY: '4xUs48J_OTaSCo8Ec'
};

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mainNav = document.getElementById('mainNav');
    const backToTopBtn = document.getElementById('backToTop');
    const imageModal = document.getElementById('imageModal');
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized with key:', EMAILJS_CONFIG.PUBLIC_KEY);
    } else {
        console.error('❌ EmailJS SDK not loaded');
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
    
    // Show toast notification
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
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart" style="font-size:3rem;color:#ddd;margin-bottom:15px"></i><p>Troli anda kosong</p></div>';
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
    document.getElementById('cartSidebar').classList.toggle('active');
}

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
                <span>RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})}</span>
            </div>
        `;
    });
    
    orderTotal.innerHTML = `
        <div class="summary-item summary-total">
            <span>JUMLAH KESELURUHAN</span>
            <span>RM ${total.toLocaleString('en-MY', {minimumFractionDigits: 2})}</span>
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
                <span>RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})}</span>
            </div>
        `;
    });
    
    itemsHTML += `
        <div class="summary-item summary-total">
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
    
    // Validate email (REQUIRED)
    if (!email) {
        emailError.textContent = 'Sila isi alamat email';
        emailError.style.display = 'block';
        document.getElementById('customerEmail').classList.add('error');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

async function processPayment() {
    const payBtn = document.getElementById('payBtn');
    const originalBtnText = payBtn.innerHTML;
    
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    payBtn.disabled = true;

    // Show loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-spinner fa-spin fa-3x"></i>
            <p>Memproses pembayaran anda...</p>
            <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                Sedang menghantar resit ke email anda
            </p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);

    try {
        const refNumber = 'BJ-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        
        const customer = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            email: document.getElementById('customerEmail').value.trim(),
            address: document.getElementById('customerAddress').value.trim(),
            notes: document.getElementById('customerNotes').value.trim() || ''
        };
        
        const payment = {
            method: 'credit_card',
            cardName: document.getElementById('cardName').value.trim(),
            cardLast4: document.getElementById('cardNumber').value.replace(/\s/g, '').slice(-4),
            cardExpiry: document.getElementById('cardExpiry').value.trim()
        };
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        const transaction = {
            refNumber: refNumber,
            date: new Date().toLocaleString('ms-MY'),
            timestamp: new Date().toISOString(),
            customer: customer,
            payment: payment,
            items: [...cart],
            total: total,
            status: 'Selesai'
        };
        
        // Save transaction to localStorage
        saveTransaction(transaction);
        
        // Send email via EmailJS - EMAIL WAJIB DIISI
        console.log('📧 Attempting to send email to:', customer.email);
        
        try {
            const emailResult = await sendEmail(transaction);
            console.log('✅ Email sent successfully:', emailResult);
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError);
            // Jangan gagalkan transaksi jika email gagal
            showToast('Pembayaran berjaya tetapi email tidak dapat dihantar. Sila hubungi kami dengan nombor rujukan: ' + refNumber, 'warning');
        }
        
        // Remove loading overlay
        if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
        
        showSuccess(transaction);
        
    } catch (error) {
        console.error('❌ Payment processing error:', error);
        
        // Remove loading overlay
        if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
        
        payBtn.innerHTML = originalBtnText;
        payBtn.disabled = false;
        
        showToast('Ralat memproses pembayaran. Sila cuba lagi.', 'error');
    }
}

async function sendEmail(transaction) {
    // Validate email sebelum hantar
    if (!transaction.customer.email || !isValidEmail(transaction.customer.email)) {
        throw new Error('Invalid email address: ' + transaction.customer.email);
    }
    
    // Format items untuk email (HTML format untuk table rows)
    const itemsListHTML = transaction.items.map(item => 
        `<tr>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td style="text-align: right;">RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})}</td>
        </tr>`
    ).join('');
    
    // Prepare email data - SESUAI DENGAN TEMPLATE BARU
    const templateParams = {
        // Email recipient
        to_email: transaction.customer.email,
        to_name: transaction.customer.name,
        
        // Transaction info
        ref_number: transaction.refNumber,
        date: transaction.date,
        transaction_status: transaction.status,
        
        // Customer info
        customer_name: transaction.customer.name,
        customer_phone: transaction.customer.phone,
        customer_address: transaction.customer.address,
        customer_notes: transaction.customer.notes || '',
        
        // Order items
        items_list: itemsListHTML,
        items_count: transaction.items.length,
        total_amount: `RM ${transaction.total.toLocaleString('en-MY', {minimumFractionDigits: 2})}`,
        
        // Payment info
        payment_method: 'Kad Kredit/Debit',
        payment_last4: transaction.payment.cardLast4,
        payment_expiry: transaction.payment.cardExpiry,
        
        // Company info
        company_name: 'Baitul Jenazah',
        company_phone: '03-1234 5678',
        company_email: 'info@baituljenazah.my',
        
        // Optional: reply email
        reply_to: 'info@baituljenazah.my'
    };
    
    console.log('📧 Sending email with templateParams:', templateParams);
    
    // Send email via EmailJS
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ Email sent successfully! Status:', response.status);
        return response;
    } catch (error) {
        console.error('❌ EmailJS Error:', {
            status: error.status,
            text: error.text,
            message: error.message
        });
        throw error;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saveTransaction(transaction) {
    try {
        const transactions = JSON.parse(localStorage.getItem('baituljenazah_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('baituljenazah_transactions', JSON.stringify(transactions));
        
        // Save to sessionStorage for printing
        sessionStorage.setItem('lastTransaction', JSON.stringify(transaction));
        
        // Clear cart
        cart = [];
        saveCart();
        
        console.log('💾 Transaction saved:', transaction.refNumber);
    } catch (error) {
        console.error('❌ Error saving transaction:', error);
        throw error;
    }
}

function showSuccess(transaction) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    
    document.getElementById('step4').style.display = 'block';
    document.getElementById('step4').classList.add('active');
    document.getElementById('step4Content').classList.add('active');
    
    document.getElementById('successContent').innerHTML = `
        <div class="success-message">
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h3>Pembayaran Berjaya!</h3>
            <p>Terima kasih atas pesanan anda. Transaksi telah berjaya diproses.</p>
            
            <div class="transaction-details">
                <p><strong>No. Rujukan:</strong> ${transaction.refNumber}</p>
                <p><strong>Tarikh:</strong> ${transaction.date}</p>
                <p><strong>Nama:</strong> ${transaction.customer.name}</p>
                <p><strong>Telefon:</strong> ${transaction.customer.phone}</p>
                <p><strong>Email:</strong> ${transaction.customer.email}</p>
                <p><strong>Jumlah Bayaran:</strong> RM ${transaction.total.toLocaleString('en-MY', {minimumFractionDigits: 2})}</p>
                <p><strong>Status:</strong> <span style="color:#27ae60">${transaction.status}</span></p>
            </div>
            
            <div style="margin-top:20px;background:#e8f5e9;padding:15px;border-radius:4px;">
                <i class="fas fa-envelope" style="color:#27ae60"></i> 
                <strong>Resit telah dihantar ke email:</strong> ${transaction.customer.email}
                <br><small style="color:#666;">Sila semak folder spam jika tiada dalam inbox dalam 5 minit.</small>
            </div>
            
            <p style="margin-top:20px;font-size:0.9rem;color:#666">
                Sila simpan nombor rujukan untuk rujukan masa hadapan.
            </p>
            
            <div style="margin-top:30px">
                <button class="btn" onclick="printReceiptFromStorage()" style="width:auto;padding:12px 30px">
                    <i class="fas fa-print"></i> Cetak Resit
                </button>
                <button class="btn btn-secondary" onclick="completeOrder()" style="width:auto;padding:12px 30px;margin-left:10px">
                    <i class="fas fa-home"></i> Selesai
                </button>
            </div>
        </div>
    `;
}

function completeOrder() {
    closeCheckout();
    toggleCart();
    showToast('Terima kasih! Pesanan anda telah direkodkan.', 'success');
}

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
    // Keep the existing printReceipt function content
    // (same as before)
}

// Toast Notification System
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 350px;
        border-left: 4px solid #3498db;
    `;
    
    // Set border color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    toast.style.borderLeftColor = colors[type] || colors.info;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}; font-size: 1.2rem;"></i>
            <span style="flex: 1;">${message}</span>
            <button class="toast-close" style="background: none; border: none; color: #999; cursor: pointer; font-size: 1rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
    
    // Show toast with animation
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
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
