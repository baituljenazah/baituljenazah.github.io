// Initialize variables
let cart = [];
let lastScrollTop = 0;
let isButtonVisible = false;
const scrollThreshold = 100;

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
        // Only close if clicking on the modal background, not the image
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
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
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
    alert(name + ' telah ditambah ke troli.');
    toggleCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
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
        alert('Sila tambah sekurang-kurangnya satu item ke troli.');
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
        <div class="summary-item"><span>Email:</span><span>${customerEmail || '-'}</span></div>
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
    
    // Validate required fields
    if (!name || !phone || !address) {
        alert('Sila isi semua maklumat yang diperlukan (nama, telefon, alamat).');
        return false;
    }
    
    // Validate phone number (10-11 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^\d{10,11}$/.test(phoneDigits)) {
        alert('Sila masukkan nombor telefon yang sah (10-11 digit).');
        return false;
    }
    
    // Validate email format if provided
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Sila masukkan alamat email yang sah (contoh: nama@email.com).');
            return false;
        }
    }
    
    return true;
}

function validateStep2() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry').value.trim();
    const cvv = document.getElementById('cardCVV').value.trim();
    const cardName = document.getElementById('cardName').value.trim();
    
    // Validate all required fields
    if (!cardName || !cardNumber || !expiry || !cvv) {
        alert('Sila isi semua maklumat kad pembayaran.');
        return false;
    }
    
    // Validate card number (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
        alert('Sila masukkan nombor kad yang sah (16 digit).');
        return false;
    }
    
    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('Sila masukkan CVV yang sah (3 atau 4 digit).');
        return false;
    }
    
    // Validate expiry date format
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Format tarikh luput tidak sah. Gunakan format MM/YY (contoh: 12/26).');
        return false;
    }
    
    // Extract month and year
    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    
    // Validate month (01-12)
    if (month < 1 || month > 12) {
        alert('Bulan mesti antara 01 hingga 12.');
        return false;
    }
    
    // Validate expiry date not in the past
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed
    
    // Check if card is expired (specifically check for Jan 2026 or earlier)
    const expiryYearFull = 2000 + year;
    
    // Create expiry date (last day of the month)
    const expiryDate = new Date(expiryYearFull, month, 0);
    
    // Check if expired before Jan 2026
    const jan2026 = new Date(2026, 0, 31); // 31 Jan 2026
    
    if (expiryDate < new Date()) {
        alert('Kad kredit/debit telah tamat tempoh. Sila gunakan kad yang sah.');
        return false;
    }
    
    // Additional check: if expiry is Jan 2026 or earlier, show warning
    if (expiryDate <= jan2026) {
        const userConfirmed = confirm('Kad anda akan tamat tempoh pada ' + expiry + '. Adakah anda pasti mahu meneruskan?');
        if (!userConfirmed) {
            return false;
        }
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
        
        // Auto format on focus out
        cardNumberInput.addEventListener('blur', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length === 16) {
                let formatted = '';
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        formatted += ' ';
                    }
                    formatted += value[i];
                }
                this.value = formatted;
            }
        });
    }
    
    // Format expiry date input (MM/YY) - AUTO FORMAT
    const expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
        let isDeleting = false;
        
        expiryInput.addEventListener('keydown', function(e) {
            // Check if backspace or delete
            if (e.key === 'Backspace' || e.key === 'Delete') {
                isDeleting = true;
            } else {
                isDeleting = false;
            }
        });
        
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // If deleting, don't auto-format
            if (isDeleting) {
                return;
            }
            
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
                document.getElementById('cardCVV').focus();
            }
        });
        
        // Validate on blur
        expiryInput.addEventListener('blur', function() {
            const value = this.value.trim();
            const errorElement = document.getElementById('expiryError');
            
            if (value && /^\d{2}\/\d{2}$/.test(value)) {
                const [monthStr, yearStr] = value.split('/');
                const month = parseInt(monthStr, 10);
                const year = parseInt(yearStr, 10);
                
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear() % 100;
                const currentMonth = currentDate.getMonth() + 1;
                
                if (month < 1 || month > 12) {
                    errorElement.textContent = 'Bulan mesti antara 01 hingga 12';
                    errorElement.style.display = 'block';
                    this.classList.add('error');
                } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    errorElement.textContent = 'Kad telah tamat tempoh';
                    errorElement.style.display = 'block';
                    this.classList.add('error');
                } else {
                    errorElement.style.display = 'none';
                    this.classList.remove('error');
                }
            }
        });
    }
    
    // Format CVV input (3-4 digits)
    const cvvInput = document.getElementById('cardCVV');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 4 digits
            if (value.length > 4) {
                value = value.substring(0, 4);
            }
            
            e.target.value = value;
            
            // Show error if invalid
            const errorElement = document.getElementById('cvvError');
            if (value.length < 3 && value.length > 0) {
                errorElement.textContent = 'CVV perlu 3-4 digit';
                errorElement.style.display = 'block';
            } else {
                errorElement.style.display = 'none';
            }
        });
    }
}

function setupRealTimeValidation() {
    // Email validation
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
}

function processPayment() {
    const payBtn = document.getElementById('payBtn');
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    payBtn.disabled = true;

    // Show loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-spinner fa-spin fa-3x"></i>
            <p>Memproses pembayaran anda...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);

    setTimeout(() => {
        const refNumber = 'BJ-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        
        const customer = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            email: document.getElementById('customerEmail').value.trim() || '',
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
            refNumber: refNumber,
            date: new Date().toLocaleString('ms-MY'),
            timestamp: new Date().toISOString(),
            customer: customer,
            payment: payment,
            items: [...cart],
            total: total,
            status: 'Selesai'
        };
        
        // Simulate email sending if email provided
        if (customer.email) {
            console.log(`[SIMULASI EMAIL] ====================================`);
            console.log(`[SIMULASI EMAIL] Kepada: ${customer.email}`);
            console.log(`[SIMULASI EMAIL] Subjek: Resit Pembayaran Baitul Jenazah - ${refNumber}`);
            console.log(`[SIMULASI EMAIL] Isi:`);
            console.log(`[SIMULASI EMAIL] Terima kasih atas pembelian anda!`);
            console.log(`[SIMULASI EMAIL] No. Rujukan: ${refNumber}`);
            console.log(`[SIMULASI EMAIL] Jumlah: RM ${total.toLocaleString('en-MY', {minimumFractionDigits: 2})}`);
            console.log(`[SIMULASI EMAIL] Tarikh: ${transaction.date}`);
            console.log(`[SIMULASI EMAIL] ====================================`);
            
            // Show message to user
            setTimeout(() => {
                alert(`📧 Resit telah dihantar ke: ${customer.email}\nSila semak folder spam jika tiada dalam inbox.`);
            }, 100);
        }
        
        saveTransaction(transaction);
        
        // Remove loading overlay
        if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
        
        showSuccess(transaction);
        
        payBtn.innerHTML = 'Selesaikan Pembayaran';
        payBtn.disabled = false;
    }, 2000);
}

function saveTransaction(transaction) {
    try {
        const transactions = JSON.parse(localStorage.getItem('baituljenazah_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('baituljenazah_transactions', JSON.stringify(transactions));
        
        cart = [];
        saveCart();
    } catch (error) {
        console.error('Error saving transaction:', error);
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
                <p><strong>Jumlah Bayaran:</strong> RM ${transaction.total.toLocaleString('en-MY', {minimumFractionDigits: 2})}</p>
                <p><strong>Status:</strong> <span style="color:#27ae60">${transaction.status}</span></p>
            </div>
            
            ${transaction.customer.email ? `
                <p style="margin-top:20px;color:#27ae60;background:#e8f5e9;padding:15px;border-radius:4px;">
                    <i class="fas fa-envelope"></i> Resit telah dihantar ke email: <strong>${transaction.customer.email}</strong>
                    <br><small style="color:#666;">Sila semak folder spam jika tiada dalam inbox.</small>
                </p>
            ` : ''}
            
            <p style="margin-top:20px;font-size:0.9rem;color:#666">
                Sila simpan nombor rujukan untuk rujukan masa hadapan.
            </p>
            
            <div style="margin-top:30px">
                <button class="btn" onclick="window.print()" style="width:auto;padding:12px 30px">
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
    alert('Terima kasih! Pesanan anda telah direkodkan.');
}
