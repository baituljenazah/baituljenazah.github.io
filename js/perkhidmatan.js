// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_veo15lv';
const EMAILJS_TEMPLATE_ID = 'template_h17hgd6';
const EMAILJS_PUBLIC_KEY = '4xUs48J_OTaSCo8Ec';
let EMAILJS_PRIVATE_KEY = 'W90p9mMe7SqfTf5U4F1xF'; // Hanya untuk backend, tidak digunakan di frontend

// Inisialisasi EmailJS
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("EmailJS initialized");
})();

// Cart State
let cart = [];
let transactionId = null;

// DOM Elements
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartSidebar = document.getElementById('cartSidebar');
const checkoutModal = document.getElementById('checkoutModal');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mainNav = document.getElementById('mainNav');
const backToTopBtn = document.getElementById('backToTop');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
});

mobileMenuOverlay.addEventListener('click', () => {
    mainNav.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Image Modal Functions
function openImageModal(src, title) {
    modalImage.src = src;
    modalTitle.textContent = title;
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        closeImageModal();
    }
});

// Cart Functions
function addToCart(id, name, price, category) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`${name} ditambah lagi (${existingItem.quantity} unit)`, 'info');
    } else {
        cart.push({
            id,
            name,
            price,
            category,
            quantity: 1
        });
        showToast(`${name} ditambah ke troli`, 'success');
    }
    
    updateCart();
    saveCartToStorage();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    saveCartToStorage();
    showToast('Item dikeluarkan dari troli', 'warning');
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    
    // Update cart items display
    cartItemsEl.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size:3rem;color:#ddd;margin-bottom:15px"></i>
                <p>Troli anda kosong</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.category} • RM ${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div>
                    <div class="cart-item-price">RM ${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            cartItemsEl.appendChild(itemEl);
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `RM ${total.toFixed(2)}`;
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
}

// Checkout Functions
function openCheckout() {
    if (cart.length === 0) {
        showToast('Troli anda kosong', 'warning');
        return;
    }
    
    // Update order summary
    const orderItemsEl = document.getElementById('orderItems');
    const orderTotalEl = document.getElementById('orderTotal');
    const confirmItemsEl = document.getElementById('confirmItems');
    
    let itemsHTML = '';
    let confirmHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="summary-item">
                <span>${item.name} (${item.quantity})</span>
                <span>RM ${itemTotal.toFixed(2)}</span>
            </div>
        `;
        
        confirmHTML += `
            <div class="summary-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>RM ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    itemsHTML += `
        <div class="summary-total">
            <span>Jumlah</span>
            <span>RM ${total.toFixed(2)}</span>
        </div>
    `;
    
    confirmHTML += `
        <div class="summary-total">
            <span>Jumlah</span>
            <span>RM ${total.toFixed(2)}</span>
        </div>
    `;
    
    orderItemsEl.innerHTML = itemsHTML;
    orderTotalEl.innerHTML = `
        <div class="summary-total">
            <span>Jumlah Keseluruhan</span>
            <span>RM ${total.toFixed(2)}</span>
        </div>
    `;
    confirmItemsEl.innerHTML = confirmHTML;
    
    // Reset form
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerNotes').value = '';
    document.getElementById('cardName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('cardExpiry').value = '';
    document.getElementById('cardCVV').value = '';
    
    // Show modal and go to step 1
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep(1);
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(el => {
        el.classList.remove('active');
    });
    
    // Remove active from all step indicators
    document.querySelectorAll('.step').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected step
    document.getElementById(`step${step}Content`).classList.add('active');
    document.getElementById(`step${step}`).classList.add('active');
}

function nextStep(step) {
    // Validation for step 1
    if (step === 2) {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        
        let isValid = true;
        
        // Name validation
        if (!name) {
            document.getElementById('nameError').style.display = 'block';
            document.getElementById('customerName').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('nameError').style.display = 'none';
            document.getElementById('customerName').classList.remove('error');
        }
        
        // Phone validation (Malaysian phone number)
        const phoneRegex = /^(01[0-9]{8,9})$/;
        if (!phoneRegex.test(phone)) {
            document.getElementById('phoneError').style.display = 'block';
            document.getElementById('customerPhone').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('phoneError').style.display = 'none';
            document.getElementById('customerPhone').classList.remove('error');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Sila isi email yang sah';
            document.getElementById('emailError').style.display = 'block';
            document.getElementById('customerEmail').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('emailError').style.display = 'none';
            document.getElementById('customerEmail').classList.remove('error');
        }
        
        // Address validation
        if (!address) {
            document.getElementById('addressError').style.display = 'block';
            document.getElementById('customerAddress').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('addressError').style.display = 'none';
            document.getElementById('customerAddress').classList.remove('error');
        }
        
        if (!isValid) {
            showToast('Sila lengkapkan semua maklumat yang diperlukan', 'error');
            return;
        }
        
        // Update confirmation step
        document.getElementById('confirmCustomer').innerHTML = `
            <p><strong>Nama:</strong> ${name}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Alamat:</strong> ${address}</p>
            <p><strong>Nota:</strong> ${document.getElementById('customerNotes').value || 'Tiada'}</p>
        `;
    }
    
    // Validation for step 2
    if (step === 3) {
        const cardName = document.getElementById('cardName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCVV = document.getElementById('cardCVV').value.trim();
        
        let isValid = true;
        
        // Card name validation
        if (!cardName) {
            document.getElementById('cardNameError').style.display = 'block';
            document.getElementById('cardName').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('cardNameError').style.display = 'none';
            document.getElementById('cardName').classList.remove('error');
        }
        
        // Card number validation (16 digits)
        const cardRegex = /^\d{16}$/;
        if (!cardRegex.test(cardNumber)) {
            document.getElementById('cardError').textContent = 'Sila isi 16 digit nombor kad yang sah';
            document.getElementById('cardError').style.display = 'block';
            document.getElementById('cardNumber').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('cardError').style.display = 'none';
            document.getElementById('cardNumber').classList.remove('error');
        }
        
        // Expiry date validation
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(cardExpiry)) {
            document.getElementById('expiryError').textContent = 'Format MM/YY (contoh: 12/25)';
            document.getElementById('expiryError').style.display = 'block';
            document.getElementById('cardExpiry').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('expiryError').style.display = 'none';
            document.getElementById('cardExpiry').classList.remove('error');
        }
        
        // CVV validation (3-4 digits)
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(cardCVV)) {
            document.getElementById('cvvError').style.display = 'block';
            document.getElementById('cardCVV').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('cvvError').style.display = 'none';
            document.getElementById('cardCVV').classList.remove('error');
        }
        
        if (!isValid) {
            showToast('Sila semak maklumat kad pembayaran', 'error');
            return;
        }
        
        // Mask card number for confirmation
        const maskedCard = cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 **** **** $4');
        
        document.getElementById('confirmPayment').innerHTML = `
            <p><strong>Kaedah:</strong> Kad Kredit</p>
            <p><strong>Nama pada Kad:</strong> ${cardName}</p>
            <p><strong>Nombor Kad:</strong> ${maskedCard}</p>
            <p><strong>Tarikh Luput:</strong> ${cardExpiry}</p>
        `;
    }
    
    goToStep(step);
}

function processPayment() {
    const payBtn = document.getElementById('payBtn');
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    // Generate transaction ID
    transactionId = 'TRX' + Date.now() + Math.floor(Math.random() * 1000);
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Prepare order data
    const orderData = {
        customerName: document.getElementById('customerName').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        customerEmail: document.getElementById('customerEmail').value.trim(),
        customerAddress: document.getElementById('customerAddress').value.trim(),
        customerNotes: document.getElementById('customerNotes').value.trim() || 'Tiada nota',
        orderItems: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        })),
        totalAmount: total,
        transactionId: transactionId,
        orderDate: new Date().toLocaleString('ms-MY'),
        paymentMethod: 'Kad Kredit'
    };
    
    // Show loading overlay
    showLoadingOverlay();
    
    // Send email using EmailJS
    sendOrderEmail(orderData)
        .then(() => {
            // Simulate payment processing delay
            setTimeout(() => {
                hideLoadingOverlay();
                showSuccessPage(orderData);
                saveOrderToStorage(orderData);
                clearCart();
                payBtn.disabled = false;
                payBtn.innerHTML = 'Selesaikan Pembayaran';
            }, 2000);
        })
        .catch(error => {
            hideLoadingOverlay();
            console.error('Email error:', error);
            showToast('Pembayaran berjaya tetapi email tidak dihantar. Sila hubungi kami untuk resit.', 'warning');
            
            // Still show success but with warning
            setTimeout(() => {
                hideLoadingOverlay();
                showSuccessPage(orderData, false);
                saveOrderToStorage(orderData);
                clearCart();
                payBtn.disabled = false;
                payBtn.innerHTML = 'Selesaikan Pembayaran';
            }, 1000);
        });
}

// EmailJS Function
function sendOrderEmail(orderData) {
    console.log("Preparing to send email...");
    
    // Format items for email
    const itemsList = orderData.orderItems.map(item => 
        `${item.name} (${item.quantity} × RM ${item.price.toFixed(2)}) = RM ${item.subtotal.toFixed(2)}`
    ).join('<br>');
    
    // Prepare email parameters
    const templateParams = {
        to_email: orderData.customerEmail,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        transaction_id: orderData.transactionId,
        order_date: orderData.orderDate,
        items_list: itemsList,
        total_amount: orderData.totalAmount.toFixed(2),
        customer_notes: orderData.customerNotes,
        company_name: 'Baitul Jenazah',
        company_phone: '03-1234 5678',
        company_email: 'info@baituljenazah.my'
    };
    
    console.log("Sending email with params:", templateParams);
    
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(response => {
            console.log('Email sent successfully!', response.status, response.text);
            return response;
        })
        .catch(error => {
            console.error('Failed to send email:', error);
            throw error;
        });
}

function showSuccessPage(orderData, emailSent = true) {
    // Go to step 4
    goToStep(4);
    
    // Format items for display
    const itemsList = orderData.orderItems.map(item => 
        `${item.name} × ${item.quantity} = RM ${item.subtotal.toFixed(2)}`
    ).join('<br>');
    
    const successContent = document.getElementById('successContent');
    successContent.innerHTML = `
        <div class="success-message">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Pembayaran Berjaya!</h3>
            <p>Terima kasih atas pesanan anda. Transaksi telah berjaya diproses.</p>
            
            ${emailSent ? `
                <div class="email-success">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Resit telah dihantar ke email:</strong>
                        <p>${orderData.customerEmail}</p>
                        <small>Jika tidak menerima email, sila semak folder spam.</small>
                    </div>
                </div>
            ` : `
                <div class="email-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Pesanan berjaya tetapi email gagal dihantar.</strong>
                        <p>Sila hubungi kami di 03-1234 5678 untuk mendapatkan resit.</p>
                        <small>Nombor transaksi: ${orderData.transactionId}</small>
                    </div>
                </div>
            `}
            
            <div class="transaction-details">
                <h4>Maklumat Transaksi</h4>
                <p><strong>Nombor Transaksi:</strong> ${orderData.transactionId}</p>
                <p><strong>Tarikh & Masa:</strong> ${orderData.orderDate}</p>
                <p><strong>Nama Pelanggan:</strong> ${orderData.customerName}</p>
                <p><strong>No. Telefon:</strong> ${orderData.customerPhone}</p>
                <p><strong>Alamat:</strong> ${orderData.customerAddress}</p>
                <p><strong>Nota:</strong> ${orderData.customerNotes}</p>
                <p><strong>Status:</strong> <span class="status-success">Dibayar</span></p>
            </div>
            
            <div class="transaction-details">
                <h4>Ringkasan Pesanan</h4>
                <div style="margin-bottom: 15px;">${itemsList}</div>
                <div style="border-top: 2px solid #ddd; padding-top: 10px; margin-top: 10px;">
                    <p><strong>Jumlah Keseluruhan:</strong> RM ${orderData.totalAmount.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="success-actions">
                <button class="btn btn-print" onclick="printReceipt()">
                    <i class="fas fa-print"></i> Cetak Resit
                </button>
                <button class="btn btn-copy" onclick="copyTransactionDetails()">
                    <i class="fas fa-copy"></i> Salin Maklumat
                </button>
                <button class="btn" onclick="goToHomepage()">
                    <i class="fas fa-home"></i> Kembali ke Laman Utama
                </button>
            </div>
            
            <div class="success-note">
                <i class="fas fa-info-circle"></i>
                Pasukan kami akan menghubungi anda dalam masa 24 jam untuk pengesahan lanjut.
            </div>
        </div>
    `;
}

function showLoadingOverlay() {
    const loadingHTML = `
        <div class="loading-overlay">
            <div class="loading-content">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="loading-text">Memproses Pembayaran...</div>
                <div class="loading-subtext">Sila tunggu sebentar</div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function printReceipt() {
    window.print();
}

function copyTransactionDetails() {
    const details = `
BAITUL JENAZAH - RESIT TRANSACTION
=====================================
No. Transaksi: ${transactionId}
Tarikh: ${new Date().toLocaleString('ms-MY')}

PESANAN:
${cart.map(item => `• ${item.name} (${item.quantity}) - RM ${(item.price * item.quantity).toFixed(2)}`).join('\n')}

JUMLAH: RM ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}

Terima kasih atas pesanan anda.
    `;
    
    navigator.clipboard.writeText(details)
        .then(() => showToast('Maklumat transaksi disalin', 'success'))
        .catch(() => showToast('Gagal menyalin', 'error'));
}

function goToHomepage() {
    closeCheckout();
    window.location.href = 'https://baituljenazah.github.io/';
}

function clearCart() {
    cart = [];
    updateCart();
    saveCartToStorage();
    toggleCart();
}

// Toast Notification System
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('baituljenazah_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('baituljenazah_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function saveOrderToStorage(orderData) {
    const orders = JSON.parse(localStorage.getItem('baituljenazah_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('baituljenazah_orders', JSON.stringify(orders));
}

// Form input formatting
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value.substring(0, 19);
});

document.getElementById('cardExpiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value.substring(0, 5);
});

// Prevent modal close on click inside
document.querySelector('.modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Close modal on overlay click
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        closeCheckout();
    }
});

// Prevent scrolling when modal is open
function preventScroll(e) {
    if (checkoutModal.classList.contains('active') || imageModal.classList.contains('active')) {
        e.preventDefault();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    updateCart();
    
    // EmailJS ready check
    if (typeof emailjs !== 'undefined') {
        console.log("EmailJS is ready");
    } else {
        console.error("EmailJS not loaded");
    }
});
