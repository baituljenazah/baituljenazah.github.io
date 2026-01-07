        let allTransactions = [];
        let filteredTransactions = [];

        function loadTransactions() {
            try {
                document.getElementById('loadingState').style.display = 'block';
                document.getElementById('tableContent').style.display = 'none';
                document.getElementById('emptyState').style.display = 'none';

                const transactionsStr = localStorage.getItem('baituljenazah_transactions');
                console.log('Loading transactions from localStorage:', transactionsStr);
                
                if (!transactionsStr || transactionsStr === '[]') {
                    console.log('No transactions found');
                    showEmptyState();
                    return;
                }

                allTransactions = JSON.parse(transactionsStr);
                console.log('Transactions loaded:', allTransactions);
                allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                filteredTransactions = [...allTransactions];
                displayTransactions();
                updateStats();

            } catch (error) {
                console.error('Error loading transactions:', error);
                showEmptyState();
            } finally {
                document.getElementById('loadingState').style.display = 'none';
            }
        }

        function displayTransactions() {
            const tbody = document.getElementById('transactionsBody');
            
            if (filteredTransactions.length === 0) {
                showEmptyState();
                return;
            }

            document.getElementById('tableContent').style.display = 'block';
            document.getElementById('emptyState').style.display = 'none';

            tbody.innerHTML = filteredTransactions.map(trans => `
                <tr>
                    <td><strong>${trans.refNumber}</strong></td>
                    <td>${trans.date}</td>
                    <td>${trans.customer.name}</td>
                    <td>${trans.customer.phone}</td>
                    <td><strong>RM ${trans.total.toLocaleString('en-MY', {minimumFractionDigits: 2})}</strong></td>
                    <td><span class="status-badge status-completed">${trans.status}</span></td>
                    <td>
                        <button class="view-btn" onclick='viewTransaction(${JSON.stringify(trans).replace(/'/g, "&#39;")})'>
                            <i class="fas fa-eye"></i> Lihat
                        </button>
                    </td>
                </tr>
            `).join('');

            document.getElementById('transactionCount').textContent = `${filteredTransactions.length} transaksi`;
        }

        function showEmptyState() {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('tableContent').style.display = 'none';
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('transactionCount').textContent = '0 transaksi';
        }

        function updateStats() {
            const totalTransactions = allTransactions.length;
            const totalRevenue = allTransactions.reduce((sum, t) => sum + t.total, 0);
            
            const today = new Date().toDateString();
            const todayTrans = allTransactions.filter(t => {
                const transDate = new Date(t.timestamp).toDateString();
                return transDate === today;
            }).length;
            
            const avgValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

            document.getElementById('totalTransactions').textContent = totalTransactions;
            document.getElementById('totalRevenue').textContent = `RM ${totalRevenue.toLocaleString('en-MY', {minimumFractionDigits: 2})}`;
            document.getElementById('todayTransactions').textContent = todayTrans;
            document.getElementById('avgValue').textContent = `RM ${avgValue.toLocaleString('en-MY', {minimumFractionDigits: 2})}`;
        }

        function searchTransactions() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            
            if (!query) {
                filteredTransactions = [...allTransactions];
            } else {
                filteredTransactions = allTransactions.filter(trans => 
                    trans.refNumber.toLowerCase().includes(query) ||
                    trans.customer.name.toLowerCase().includes(query) ||
                    trans.customer.phone.includes(query) ||
                    (trans.customer.email && trans.customer.email.toLowerCase().includes(query))
                );
            }
            
            displayTransactions();
        }

        function viewTransaction(transaction) {
            const modal = document.getElementById('detailModal');
            const modalBody = document.getElementById('modalBody');
            
            modalBody.innerHTML = `
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Maklumat Transaksi</h4>
                    <div class="detail-row">
                        <span class="detail-label">No. Rujukan:</span>
                        <span class="detail-value">${transaction.refNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tarikh & Masa:</span>
                        <span class="detail-value">${transaction.date}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value"><span class="status-badge status-completed">${transaction.status}</span></span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Maklumat Pelanggan</h4>
                    <div class="detail-row">
                        <span class="detail-label">Nama:</span>
                        <span class="detail-value">${transaction.customer.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Telefon:</span>
                        <span class="detail-value">${transaction.customer.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${transaction.customer.email || '-'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Alamat:</span>
                        <span class="detail-value">${transaction.customer.address}</span>
                    </div>
                    ${transaction.customer.notes ? `
                    <div class="detail-row">
                        <span class="detail-label">Nota:</span>
                        <span class="detail-value">${transaction.customer.notes}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-credit-card"></i> Maklumat Pembayaran</h4>
                    <div class="detail-row">
                        <span class="detail-label">Kaedah:</span>
                        <span class="detail-value">Kad Kredit/Debit</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Nama Kad:</span>
                        <span class="detail-value">${transaction.payment.cardName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">No. Kad:</span>
                        <span class="detail-value">**** **** **** ${transaction.payment.cardLast4}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-shopping-cart"></i> Item Pesanan</h4>
                    <div class="items-list">
                        ${transaction.items.map(item => `
                            <div class="item-row">
                                <div>
                                    <strong>${item.name}</strong>
                                    <div style="font-size:0.85rem;color:#666">${item.category}</div>
                                </div>
                                <div style="font-weight:600">RM ${item.price.toLocaleString('en-MY', {minimumFractionDigits: 2})}</div>
                            </div>
                        `).join('')}
                        <div class="item-row">
                            <span>JUMLAH KESELURUHAN</span>
                            <span style="color:#88E788">RM ${transaction.total.toLocaleString('en-MY', {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top:20px;display:flex;gap:10px">
                    <button class="btn btn-primary" onclick="window.print()">
                        <i class="fas fa-print"></i> Cetak
                    </button>
                    <button class="btn btn-danger" onclick="deleteTransaction('${transaction.refNumber}')">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            `;
            
            modal.classList.add('active');
        }

        function closeModal() {
            document.getElementById('detailModal').classList.remove('active');
        }

        function deleteTransaction(refNumber) {
            if (!confirm('Adakah anda pasti mahu memadam transaksi ini?')) {
                return;
            }

            try {
                const transactions = JSON.parse(localStorage.getItem('baituljenazah_transactions') || '[]');
                const filtered = transactions.filter(t => t.refNumber !== refNumber);
                localStorage.setItem('baituljenazah_transactions', JSON.stringify(filtered));
                
                closeModal();
                loadTransactions();
                alert('Transaksi berjaya dipadam');
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert('Ralat semasa memadam transaksi');
            }
        }

        function exportToCSV() {
            if (allTransactions.length === 0) {
                alert('Tiada data untuk diexport');
                return;
            }

            const headers = ['No. Rujukan', 'Tarikh', 'Nama', 'Telefon', 'Email', 'Alamat', 'Jumlah', 'Status'];
            
            const csvRows = [
                headers.join(','),
                ...allTransactions.map(trans => [
                    trans.refNumber,
                    `"${trans.date}"`,
                    `"${trans.customer.name}"`,
                    trans.customer.phone,
                    `"${trans.customer.email || ''}"`,
                    `"${trans.customer.address}"`,
                    trans.total,
                    trans.status
                ].join(','))
            ];

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }

        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTransactions();
            }
        });

        loadTransactions();
