// ============================================
// BAITUL JENAZAH - PERKHIDMATAN.JS
// SIMPLIFIED VERSION - NO EMAILJS ERRORS
// ============================================

// Global variables
var cart = [];
var isProcessing = false;

// EmailJS configuration
var EMAILJS_CONFIG = {
    SERVICE_ID: 'service_veo15lv',
    TEMPLATE_ID: 'template_h17hgd6',
    PUBLIC_KEY: '4xUs48J_OTaSCo8Ec'
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Baitul Jenazah - Sistem dimuatkan');
    
    // Setup semua komponen
    setupMobileMenu();
    setupBackToTop();
    setupImageModal();
    setupInputFormatting();
    loadCart();
    
    // Mark active nav
    var perkhidmatanLink = document.querySelector('nav a[href*="perkhidmatan"]');
    if (perkhidmatanLink) perkhidmatanLink.classList.add('active');
    
    // Check EmailJS
    checkEmailJS();
});

// ============================================
// EMAILJS FUNCTIONS
// ============================================
function checkEmailJS() {
    if (typeof emailjs !== 'undefined') {
        console.log('✅ EmailJS sedia digunakan');
        return true;
    } else {
        console.warn('⚠️ EmailJS belum dimuatkan. Email mungkin tidak dapat dihantar.');
        return false;
    }
}

async function sendEmailReceipt(transaction) {
    // Jika EmailJS tidak tersedia, return false
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS tidak tersedia. Skip email sending.');
        return { success: false, message: 'Email service tidak tersedia' };
    }
    
    try {
        console.log('📧 Menghantar email kepada:', transaction.customer.email);
        
        // Format items untuk email
        var itemsHtml = '';
        transaction.items.forEach(function(item) {
            itemsHtml += `<tr><td>${item.name}</td><td>RM ${item.price.toFixed(2)}</td></tr>`;
        });
        
        // Siapkan data untuk email
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
        
        // Hantar email menggunakan EmailJS
        var response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ Email berjaya dihantar');
        return { success: true, response: response };
        
    } catch (error) {
        console.error('❌ Gagal menghantar email:', error);
        return { 
            success: false, 
            message: error.text || 'Gagal menghantar email',
            error: error 
        };
    }
}

// ============================================
// CART FUNCTIONS
// ============================================
function loadCart() {
    var saved = localStorage.getItem('baituljenazah_cart');
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
    cart.push({id: id, name: name, price: price, category: category, quantity: 1});
    saveCart();
    showToast(name + ' ditambah ke troli', 'success');
    toggleCart();
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        var itemName = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        showToast(itemName + ' dikeluarkan dari troli', 'info');
    }
}

function updateCartDisplay() {
    var cartItems = document.getElementById('cartItems');
    var cartCount = document.getElementById('cartCount');
    var cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartCount || !cartTotal) return;
    
    // Update cart count
    cartCount.textContent = cart.length;
    
    // If cart is empty
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Troli anda kosong</p>
            </div>
        `;
        cartTotal.textContent = 'RM 0.00';
        return;
    }
    
    // Show cart items
    var total = 0;
    var itemsHtml = '';
    
    cart.forEach(function(item, index) {
        total += item.price;
        itemsHtml += `
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
    
    cartItems.innerHTML = itemsHtml;
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
        showToast('Troli kosong. Tambah item terlebih dahulu.', 'warning');
        return;
    }
    
    var modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateOrderSummary();
        nextStep(1);
    }
}

function closeCheckout() {
    var modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function updateOrderSummary() {
    var orderItems = document.getElementById('orderItems');
    var orderTotal = document.getElementById('orderTotal');
    
    if (!orderItems || !orderTotal) return;
    
    var total = 0;
    var itemsHtml = '';
    
    cart.forEach(function(item) {
        total += item.price;
        itemsHtml += `
            <div class="summary-item">
                <span>${item.name}</span>
                <span>RM ${item.price.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderItems.innerHTML = itemsHtml;
    orderTotal.innerHTML = `
        <div class="summary-item summary-total">
            <span>JUMLAH KESELURUHAN</span>
            <span>RM ${total.toFixed(2)}</span>
        </div>
    `;
}

function nextStep(step) {
    // Hide all steps
    var steps = document.querySelectorAll('.step');
    var contents = document.querySelectorAll('.checkout-step');
    
    steps.forEach(function(step) { step.classList.remove('active'); });
    contents.forEach(function(content) { content.classList.remove('active'); });
    
    // Validate before proceeding
    if (step === 2 && !validateStep1()) return;
    if (step === 3 && !validateStep2()) return;
    
    // Show target step
    var stepEl = document.getElementById('step' + step);
    var contentEl = document.getElementById('step' + step + 'Content');
    
    if (stepEl) stepEl.classList.add('active');
    if (contentEl) contentEl.classList.add('active');
    
    if (step === 3) updateConfirmSections();
}

function updateConfirmSections() {
    // Get customer data
    var customer = {
        name: getValue('customerName'),
        phone: getValue('customerPhone'),
        email: getValue('customerEmail'),
        address: getValue('customerAddress'),
        notes: getValue('customerNotes')
    };
    
    // Get payment data
    var payment = {
        cardName: getValue('cardName'),
        cardLast4: getValue('cardNumber').replace(/\s/g, '').slice(-4),
        cardExpiry: getValue('cardExpiry')
    };
    
    // Update confirmation sections
    var confirmCustomer = document.getElementById('confirmCustomer');
    var confirmPayment = document.getElementById('confirmPayment');
    var confirmItems = document.getElementById('confirmItems');
    
    if (confirmCustomer) {
        confirmCustomer.innerHTML = `
            <div class="summary-item"><span>Nama:</span><span>${customer.name}</span></div>
            <div class="summary-item"><span>Telefon:</span><span>${customer.phone}</span></div>
            <div class="summary-item"><span>Email:</span><span>${customer.email}</span></div>
            <div class="summary-item"><span>Alamat:</span><span>${customer.address}</span></div>
            ${customer.notes ? `<div class="summary-item"><span>Nota:</span><span>${customer.notes}</span></div>` : ''}
        `;
    }
    
    if (confirmPayment) {
        confirmPayment.innerHTML = `
            <div class="summary-item"><span>Kaedah:</span><span>Kad Kredit/Debit</span></div>
            <div class="summary-item"><span>Nama Kad:</span><span>${payment.cardName}</span></div>
            <div class="summary-item"><span>Nombor Kad:</span><span>**** **** **** ${payment.cardLast4}</span></div>
            <div class="summary-item"><span>Tarikh Luput:</span><span>${payment.cardExpiry}</span></div>
        `;
    }
    
    if (confirmItems) {
        var total = 0;
        var itemsHtml = '';
        
        cart.forEach(function(item) {
            total += item.price;
            itemsHtml += `
                <div class="summary-item">
                    <span>${item.name}</span>
                    <span>RM ${item.price.toFixed(2)}</span>
                </div>
            `;
        });
        
        itemsHtml += `
            <div class="summary-item summary-total">
                <span>JUMLAH KESELURUHAN</span>
                <span>RM ${total.toFixed(2)}</span>
            </div>
        `;
        
        confirmItems.innerHTML = itemsHtml;
    }
}

function getValue(elementId) {
    var element = document.getElementById(elementId);
    return element ? element.value.trim() : '';
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================
function validateStep1() {
    var isValid = true;
    
    // Reset errors
    var errorIds = ['nameError', 'phoneError', 'addressError', 'emailError'];
    errorIds.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // Validate name
    var name = getValue('customerName');
    if (!name) {
        showError('customerName', 'nameError', 'Sila isi nama penuh');
        isValid = false;
    }
    
    // Validate phone
    var phone = getValue('customerPhone').replace(/\D/g, '');
    if (!phone) {
        showError('customerPhone', 'phoneError', 'Sila isi nombor telefon');
        isValid = false;
    } else if (phone.length < 10 || phone.length > 11) {
        showError('customerPhone', 'phoneError', 'Nombor telefon mesti 10-11 digit');
        isValid = false;
    }
    
    // Validate address
    var address = getValue('customerAddress');
    if (!address) {
        showError('customerAddress', 'addressError', 'Sila isi alamat penuh');
        isValid = false;
    }
    
    // Validate email
    var email = getValue('customerEmail');
    if (!email) {
        showError('customerEmail', 'emailError', 'Sila isi alamat email');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('customerEmail', 'emailError', 'Format email tidak sah');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Sila betulkan maklumat di atas', 'error');
    }
    
    return isValid;
}

function validateStep2() {
    var isValid = true;
    
    // Reset errors
    var errorIds = ['cardNameError', 'cardError', 'expiryError', 'cvvError'];
    errorIds.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // Validate card name
    var cardName = getValue('cardName');
    if (!cardName) {
        showError('cardName', 'cardNameError', 'Sila isi nama pada kad');
        isValid = false;
    }
    
    // Validate card number
    var cardNumber = getValue('cardNumber').replace(/\s/g, '');
    if (!cardNumber) {
        showError('cardNumber', 'cardError', 'Sila isi nombor kad');
        isValid = false;
    } else if (cardNumber.length !== 16) {
        showError('cardNumber', 'cardError', 'Nombor kad mesti 16 digit');
        isValid = false;
    }
    
    // Validate expiry
    var expiry = getValue('cardExpiry');
    if (!expiry) {
        showError('cardExpiry', 'expiryError', 'Sila isi tarikh luput');
        isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        showError('cardExpiry', 'expiryError', 'Format: MM/YY');
        isValid = false;
    }
    
    // Validate CVV
    var cvv = getValue('cardCVV');
    if (!cvv) {
        showError('cardCVV', 'cvvError', 'Sila isi kod CVV');
        isValid = false;
    } else if (cvv.length < 3 || cvv.length > 4) {
        showError('cardCVV', 'cvvError', 'CVV mesti 3-4 digit');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Sila betulkan maklumat pembayaran', 'error');
    }
    
    return isValid;
}

function showError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    
    if (input) {
        input.classList.add('error');
        input.focus();
    }
    
    if (error) {
        error.textContent = message;
        error.style.display = 'block';
    }
}

function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// PAYMENT PROCESSING
// ============================================
async function processPayment() {
    if (isProcessing) return;
    
    isProcessing = true;
    var payBtn = document.getElementById('payBtn');
    var originalText = payBtn ? payBtn.innerHTML : '';
    
    // Show loading
    if (payBtn) {
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        payBtn.disabled = true;
    }
    
    showLoading('Memproses pembayaran anda...');
    
    try {
        // Generate reference
        var refNumber = 'BJ-' + Date.now();
        
        // Collect data
        var transaction = {
            refNumber: refNumber,
            date: new Date().toLocaleString('ms-MY'),
            customer: {
                name: getValue('customerName'),
                phone: getValue('customerPhone'),
                email: getValue('customerEmail'),
                address: getValue('customerAddress'),
                notes: getValue('customerNotes')
            },
            payment: {
                method: 'credit_card',
                cardLast4: getValue('cardNumber').replace(/\s/g, '').slice(-4)
            },
            items: JSON.parse(JSON.stringify(cart)),
            total: cart.reduce(function(sum, item) { return sum + item.price; }, 0),
            status: 'Selesai'
        };
        
        console.log('💾 Menyimpan transaksi:', refNumber);
        
        // Save transaction
        saveTransaction(transaction);
        
        // Try to send email
        var emailResult = { success: false, message: 'Email tidak dihantar' };
        
        if (transaction.customer.email && isValidEmail(transaction.customer.email)) {
            updateLoading('Menghantar resit ke email...');
            emailResult = await sendEmailReceipt(transaction);
        }
        
        // Show success
        hideLoading();
        showSuccessPage(transaction, emailResult.success, emailResult.message);
        
    } catch (error) {
        console.error('❌ Payment error:', error);
        hideLoading();
        showToast('Ralat: ' + error.message, 'error');
    } finally {
        isProcessing = false;
        if (payBtn) {
            payBtn.innerHTML = originalText;
            payBtn.disabled = false;
        }
    }
}

function saveTransaction(transaction) {
    try {
        // Save to localStorage for history
        var transactions = JSON.parse(localStorage.getItem('baituljenazah_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('baituljenazah_transactions', JSON.stringify(transactions));
        
        // Save to sessionStorage for printing
        sessionStorage.setItem('lastTransaction', JSON.stringify(transaction));
        
        // Clear cart
        cart = [];
        saveCart();
        
    } catch (error) {
        console.error('Error saving transaction:', error);
        throw error;
    }
}

// ============================================
// SUCCESS PAGE
// ============================================
function showSuccessPage(transaction, emailSent, emailMessage) {
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
    document.querySelectorAll('.step:not(#step4)').forEach(function(s) {
        s.classList.remove('active');
    });
    
    document.querySelectorAll('.checkout-step:not(#step4Content)').forEach(function(s) {
        s.classList.remove('active');
    });
    
    // Build success message
    var emailStatus = emailSent ? 
        `<div class="email-success"><i class="fas fa-check-circle"></i> Resit telah dihantar ke email</div>` :
        `<div class="email-warning"><i class="fas fa-exclamation-triangle"></i> ${emailMessage || 'Resit tidak dapat dihantar'}</div>`;
    
    var successContent = document.getElementById('successContent');
    if (successContent) {
        successContent.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                
                <h3>Pembayaran Berjaya!</h3>
                <p>Terima kasih atas pesanan anda.</p>
                
                <div class="transaction-details">
                    <p><strong>No. Rujukan:</strong> ${transaction.refNumber}</p>
                    <p><strong>Tarikh:</strong> ${transaction.date}</p>
                    <p><strong>Nama:</strong> ${transaction.customer.name}</p>
                    <p><strong>Jumlah:</strong> RM ${transaction.total.toFixed(2)}</p>
                </div>
                
                ${emailStatus}
                
                <div class="success-actions">
                    <button class="btn" onclick="printReceiptFromStorage()">
                        <i class="fas fa-print"></i> Cetak Resit
                    </button>
                    <button class="btn btn-secondary" onclick="completeOrder()">
                        <i class="fas fa-home"></i> Selesai
                    </button>
                </div>
            </div>
        `;
    }
}

function completeOrder() {
    closeCheckout();
    toggleCart();
    showToast('Terima kasih! Transaksi selesai.', 'success');
}

// ============================================
// PRINT FUNCTIONS
// ============================================
function printReceiptFromStorage() {
    var transactionJSON = sessionStorage.getItem('lastTransaction');
    if (!transactionJSON) {
        showToast('Tiada data resit', 'error');
        return;
    }
    
    try {
        var transaction = JSON.parse(transactionJSON);
        
        // Create print window
        var printWindow = window.open('', '_blank', 'width=800,height=600');
        
        // Build HTML
        var itemsHtml = transaction.items.map(function(item) {
            return `<tr><td>${item.name}</td><td>RM ${item.price.toFixed(2)}</td></tr>`;
        }).join('');
        
        var html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Resit ${transaction.refNumber}</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .company { color: #88E788; font-size: 24px; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 8px; border: 1px solid #ddd; }
                    .total { text-align: right; font-weight: bold; margin-top: 20px; }
                    @media print {
                        body { padding: 10px; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company">Baitul Jenazah</div>
                    <div>Resit Pembayaran</div>
                </div>
                
                <div>
                    <p><strong>No. Rujukan:</strong> ${transaction.refNumber}</p>
                    <p><strong>Tarikh:</strong> ${transaction.date}</p>
                    <p><strong>Nama:</strong> ${transaction.customer.name}</p>
                </div>
                
                <table>
                    <tr><th>Item</th><th>Harga</th></tr>
                    ${itemsHtml}
                </table>
                
                <div class="total">
                    JUMLAH: RM ${transaction.total.toFixed(2)}
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <button onclick="window.print()">Cetak</button>
                    <button onclick="window.close()" style="margin-left: 10px;">Tutup</button>
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
        
    } catch (error) {
        showToast('Ralat membuat resit', 'error');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function setupMobileMenu() {
    var menuBtn = document.getElementById('mobileMenuBtn');
    var overlay = document.getElementById('mobileMenuOverlay');
    var nav = document.getElementById('mainNav');
    
    if (!menuBtn || !overlay || !nav) return;
    
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        menuBtn.innerHTML = nav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    overlay.addEventListener('click', function() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
}

function setupBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

function setupImageModal() {
    var modal = document.getElementById('imageModal');
    if (!modal) return;
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeImageModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
}

function setupInputFormatting() {
    // Card number formatting
    var cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.substring(0, 16);
            
            var formatted = '';
            for (var i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
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
            if (value.length > 4) value = value.substring(0, 4);
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            e.target.value = value;
        });
    }
}

// ============================================
// LOADING FUNCTIONS
// ============================================
function showLoading(message) {
    hideLoading();
    
    var loading = document.createElement('div');
    loading.id = 'loadingOverlay';
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
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <i class="fas fa-spinner fa-spin fa-3x" style="color: #88E788"></i>
            <p style="margin-top: 20px; font-weight: bold;">${message || 'Memproses...'}</p>
        </div>
    `;
    
    document.body.appendChild(loading);
}

function updateLoading(message) {
    var loading = document.getElementById('loadingOverlay');
    if (loading) {
        var p = loading.querySelector('p');
        if (p) p.textContent = message;
    }
}

function hideLoading() {
    var loading = document.getElementById('loadingOverlay');
    if (loading && loading.parentNode) {
        loading.parentNode.removeChild(loading);
    }
}

// ============================================
// TOAST NOTIFICATIONS
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
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    // Set color
    var colors = { success: '#27ae60', error: '#e74c3c', warning: '#f39c12', info: '#3498db' };
    toast.style.borderLeftColor = colors[type] || colors.info;
    
    var icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', 
                  warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left:10px;background:none;border:none;color:#999;cursor:pointer;">×</button>
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
// EXPORT FUNCTIONS TO GLOBAL SCOPE
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
