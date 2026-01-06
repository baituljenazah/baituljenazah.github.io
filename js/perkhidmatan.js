// Initialize EmailJS dengan Public Key
(function() {
    emailjs.init("4xUs48J_OTaSCo8Ec");
})();

// Fungsi untuk mengirim email konfirmasi
function sendConfirmationEmail(orderData) {
    const loadingOverlay = createLoadingOverlay();
    document.body.appendChild(loadingOverlay);
    
    // Siapkan template parameters
    const templateParams = {
        to_name: orderData.customerName,
        to_email: orderData.customerEmail,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        customer_notes: orderData.customerNotes || 'Tiada nota tambahan',
        order_id: orderData.orderId,
        order_date: orderData.orderDate,
        order_time: orderData.orderTime,
        transaction_id: orderData.transactionId,
        payment_method: orderData.paymentMethod,
        total_amount: 'RM ' + orderData.totalAmount.toFixed(2),
        items_list: orderData.itemsList
    };
    
    console.log('Sending email with params:', templateParams);
    
    // Kirim email menggunakan EmailJS
    emailjs.send('service_veo15lv', 'template_h17hgd6', templateParams)
        .then(function(response) {
            console.log('Email berjaya dihantar!', response.status, response.text);
            
            // Tampilkan pesan sukses
            const successContent = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 style="color: var(--success);">Pesanan Berjaya!</h3>
                    <p>Terima kasih atas pesanan anda. Resit telah dihantar ke email anda.</p>
                    
                    <div class="email-success">
                        <i class="fas fa-envelope-circle-check"></i>
                        <div>
                            <strong>Email konfirmasi telah dihantar ke:</strong><br>
                            <span style="color: var(--success); font-weight: 600;">${orderData.customerEmail}</span>
                        </div>
                    </div>
                    
                    <div class="transaction-details">
                        <h4>Butiran Transaksi</h4>
                        <p><strong>ID Pesanan:</strong> ${orderData.orderId}</p>
                        <p><strong>ID Transaksi:</strong> ${orderData.transactionId}</p>
                        <p><strong>Tarikh & Masa:</strong> ${orderData.orderDate} ${orderData.orderTime}</p>
                        <p><strong>Nama:</strong> ${orderData.customerName}</p>
                        <p><strong>Telefon:</strong> ${orderData.customerPhone}</p>
                        <p><strong>Alamat:</strong> ${orderData.customerAddress}</p>
                        <p><strong>Kaedah Bayaran:</strong> ${orderData.paymentMethod}</p>
                        <p><strong>Jumlah:</strong> RM ${orderData.totalAmount.toFixed(2)}</p>
                    </div>
                    
                    <div class="success-actions">
                        <button class="btn btn-print" onclick="window.print()">
                            <i class="fas fa-print"></i> Cetak Resit
                        </button>
                        <button class="btn btn-copy" onclick="copyOrderDetails()">
                            <i class="fas fa-copy"></i> Salin Butiran
                        </button>
                        <button class="btn" onclick="closeCheckout()">
                            <i class="fas fa-home"></i> Kembali ke Laman
                        </button>
                    </div>
                    
                    <div class="success-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Sila simpan ID Pesanan untuk rujukan masa hadapan</span>
                    </div>
                </div>
            `;
            
            document.getElementById('successContent').innerHTML = successContent;
            
        })
        .catch(function(error) {
            console.error('Gagal menghantar email:', error);
            
            // Tampilkan pesan sukses tanpa email
            const successContent = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 style="color: var(--success);">Pesanan Berjaya!</h3>
                    <p>Terima kasih atas pesanan anda.</p>
                    
                    <div class="email-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Email konfirmasi tidak dapat dihantar:</strong><br>
                            <span style="color: #e67e22;">${orderData.customerEmail}</span><br>
                            <small>Sila hubungi kami untuk mendapatkan resit.</small>
                        </div>
                    </div>
                    
                    <div class="transaction-details">
                        <h4>Butiran Transaksi</h4>
                        <p><strong>ID Pesanan:</strong> ${orderData.orderId}</p>
                        <p><strong>ID Transaksi:</strong> ${orderData.transactionId}</p>
                        <p><strong>Tarikh & Masa:</strong> ${orderData.orderDate} ${orderData.orderTime}</p>
                        <p><strong>Nama:</strong> ${orderData.customerName}</p>
                        <p><strong>Telefon:</strong> ${orderData.customerPhone}</p>
                        <p><strong>Alamat:</strong> ${orderData.customerAddress}</p>
                        <p><strong>Kaedah Bayaran:</strong> ${orderData.paymentMethod}</p>
                        <p><strong>Jumlah:</strong> RM ${orderData.totalAmount.toFixed(2)}</p>
                    </div>
                    
                    <div class="success-actions">
                        <button class="btn btn-print" onclick="window.print()">
                            <i class="fas fa-print"></i> Cetak Resit
                        </button>
                        <button class="btn btn-copy" onclick="copyOrderDetails()">
                            <i class="fas fa-copy"></i> Salin Butiran
                        </button>
                        <button class="btn" onclick="closeCheckout()">
                            <i class="fas fa-home"></i> Kembali ke Laman
                        </button>
                    </div>
                    
                    <div class="success-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Harap hubungi kami jika tidak menerima email konfirmasi dalam masa 30 minit</span>
                    </div>
                </div>
            `;
            
            document.getElementById('successContent').innerHTML = successContent;
            
            // Tampilkan toast error
            showToast('Email konfirmasi gagal dihantar. Sila hubungi kami untuk mendapatkan resit.', 'error');
        })
        .finally(function() {
            // Hapus loading overlay
            loadingOverlay.remove();
        });
}

// Fungsi untuk membuat loading overlay
function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="loading-text">Memproses pesanan anda...</div>
            <div class="loading-subtext">Sila tunggu sebentar</div>
        </div>
    `;
    return overlay;
}

// Fungsi untuk membuat daftar item dalam format string
function formatItemsList(cart) {
    return cart.map(item => 
        `${item.name} (${item.category}) - RM ${item.price.toFixed(2)}`
    ).join('\n');
}

// Fungsi untuk generate Order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BJ-${timestamp}-${random}`;
}

// Fungsi untuk generate Transaction ID
function generateTransactionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TRX-${result}`;
}

// Fungsi untuk mendapatkan tanggal dan waktu sekarang
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const time = now.toLocaleTimeString('ms-MY', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return { date, time };
}

// Fungsi untuk menampilkan toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Fungsi untuk menyalin butiran pesanan
function copyOrderDetails() {
    const orderDetails = document.querySelector('.transaction-details').innerText;
    navigator.clipboard.writeText(orderDetails)
        .then(() => {
            showToast('Butiran pesanan berjaya disalin!', 'success');
        })
        .catch(err => {
            console.error('Gagal menyalin:', err);
            showToast('Gagal menyalin butiran', 'error');
        });
}

// Update fungsi processPayment untuk include email
function processPayment() {
    // Validasi data terlebih dahulu
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCVV = document.getElementById('cardCVV').value.trim();
    
    // Validasi email
    if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Sila masukkan email yang sah';
        document.getElementById('emailError').style.display = 'block';
        document.getElementById('customerEmail').classList.add('error');
        return;
    }
    
    // Simulasi proses pembayaran
    const payBtn = document.getElementById('payBtn');
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    setTimeout(() => {
        // Generate order data
        const cart = getCart();
        const { date, time } = getCurrentDateTime();
        
        const orderData = {
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerAddress: address,
            customerNotes: document.getElementById('customerNotes').value.trim(),
            orderId: generateOrderId(),
            orderDate: date,
            orderTime: time,
            transactionId: generateTransactionId(),
            paymentMethod: document.getElementById('paymentMethod').value,
            totalAmount: getCartTotal(),
            itemsList: formatItemsList(cart)
        };
        
        // Simpan order data untuk rujukan
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Pindah ke step 4
        nextStep(4);
        
        // Reset tombol
        payBtn.disabled = false;
        payBtn.innerHTML = 'Selesaikan Pembayaran';
        
        // Kosongkan cart
        clearCart();
        
        // Kirim email konfirmasi
        sendConfirmationEmail(orderData);
        
    }, 2000);
}

// Fungsi validasi email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Update fungsi validasi pada nextStep
function nextStep(step) {
    // Validasi step 1
    if (step === 2) {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        
        let isValid = true;
        
        // Reset error messages
        document.getElementById('nameError').style.display = 'none';
        document.getElementById('phoneError').style.display = 'none';
        document.getElementById('emailError').style.display = 'none';
        document.getElementById('addressError').style.display = 'none';
        document.getElementById('customerName').classList.remove('error');
        document.getElementById('customerPhone').classList.remove('error');
        document.getElementById('customerEmail').classList.remove('error');
        document.getElementById('customerAddress').classList.remove('error');
        
        if (!name) {
            document.getElementById('nameError').style.display = 'block';
            document.getElementById('customerName').classList.add('error');
            isValid = false;
        }
        
        if (!phone || !/^[0-9]{10,11}$/.test(phone)) {
            document.getElementById('phoneError').style.display = 'block';
            document.getElementById('customerPhone').classList.add('error');
            isValid = false;
        }
        
        if (!email || !validateEmail(email)) {
            document.getElementById('emailError').textContent = 'Sila masukkan email yang sah';
            document.getElementById('emailError').style.display = 'block';
            document.getElementById('customerEmail').classList.add('error');
            isValid = false;
        }
        
        if (!address) {
            document.getElementById('addressError').style.display = 'block';
            document.getElementById('customerAddress').classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
    }
    
    // Validasi step 2
    if (step === 3) {
        const cardName = document.getElementById('cardName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.trim().replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCVV = document.getElementById('cardCVV').value.trim();
        
        let isValid = true;
        
        // Reset error messages
        document.getElementById('cardNameError').style.display = 'none';
        document.getElementById('cardError').style.display = 'none';
        document.getElementById('expiryError').style.display = 'none';
        document.getElementById('cvvError').style.display = 'none';
        document.getElementById('cardName').classList.remove('error');
        document.getElementById('cardNumber').classList.remove('error');
        document.getElementById('cardExpiry').classList.remove('error');
        document.getElementById('cardCVV').classList.remove('error');
        
        if (!cardName) {
            document.getElementById('cardNameError').style.display = 'block';
            document.getElementById('cardName').classList.add('error');
            isValid = false;
        }
        
        if (!cardNumber || cardNumber.length !== 16) {
            document.getElementById('cardError').textContent = 'Sila isi 16 digit nombor kad';
            document.getElementById('cardError').style.display = 'block';
            document.getElementById('cardNumber').classList.add('error');
            isValid = false;
        }
        
        if (!cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
            document.getElementById('expiryError').textContent = 'Format: MM/YY (contoh: 12/24)';
            document.getElementById('expiryError').style.display = 'block';
            document.getElementById('cardExpiry').classList.add('error');
            isValid = false;
        }
        
        if (!cardCVV || cardCVV.length < 3 || cardCVV.length > 4) {
            document.getElementById('cvvError').textContent = 'Sila isi CVV (3-4 digit)';
            document.getElementById('cvvError').style.display = 'block';
            document.getElementById('cardCVV').classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Tampilkan ringkasan konfirmasi
        updateConfirmationSummary();
    }
    
    // Proses perubahan step
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    
    document.querySelectorAll('.checkout-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}Content`).classList.add('active');
}

// Fungsi untuk update ringkasan konfirmasi
function updateConfirmationSummary() {
    const customerInfo = `
        <p><strong>Nama:</strong> ${document.getElementById('customerName').value}</p>
        <p><strong>Telefon:</strong> ${document.getElementById('customerPhone').value}</p>
        <p><strong>Email:</strong> ${document.getElementById('customerEmail').value}</p>
        <p><strong>Alamat:</strong> ${document.getElementById('customerAddress').value}</p>
        ${document.getElementById('customerNotes').value ? 
            `<p><strong>Nota:</strong> ${document.getElementById('customerNotes').value}</p>` : ''}
    `;
    
    document.getElementById('confirmCustomer').innerHTML = customerInfo;
    
    const paymentInfo = `
        <p><strong>Kaedah:</strong> ${document.getElementById('paymentMethod').value}</p>
        <p><strong>Nama Kad:</strong> ${document.getElementById('cardName').value}</p>
        <p><strong>Nombor Kad:</strong> ${document.getElementById('cardNumber').value}</p>
        <p><strong>Tarikh Luput:</strong> ${document.getElementById('cardExpiry').value}</p>
    `;
    
    document.getElementById('confirmPayment').innerHTML = paymentInfo;
}
