const tg = window.Telegram.WebApp;
tg.expand();

// BIST Taslak Verileri (Python Backend bağlandığında buraya canlı veri akacak)
let stocks = [
    { symbol: "THYAO", name: "Türk Hava Yolları", price: "298.50", change: "+2.45" },
    { symbol: "GARAN", name: "Garanti Bankası", price: "112.10", change: "-0.80" },
    { symbol: "EREGL", name: "Eğreyli Demir Çelik", price: "48.30", change: "+1.15" },
    { symbol: "ASELS", name: "Aselsan", price: "64.70", change: "+3.20" },
    { symbol: "KCHOL", name: "Koç Holding", price: "210.40", change: "-1.50" },
    { symbol: "SASAN", name: "Sasa Polyester", price: "42.10", change: "0.00" }
];

function renderStocks(data) {
    const container = document.getElementById('stock-container');
    if (!container) return;
    
    container.innerHTML = '';

    data.forEach(stock => {
        const isUp = parseFloat(stock.change) >= 0;
        const changeClass = isUp ? 'up' : 'down';
        const changeSign = isUp && parseFloat(stock.change) > 0 ? '+' : '';

        const card = document.createElement('div');
        card.className = `stock-card ${changeClass}`;
        card.innerHTML = `
            <div>
                <span class="stock-symbol">${stock.symbol}</span>
                <span class="stock-name">${stock.name}</span>
            </div>
            <div class="stock-price-info">
                <span class="stock-price">₺${stock.price}</span>
                <span class="stock-change ${changeClass}">${changeSign}%${stock.change}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterStocks() {
    const query = document.getElementById('search-input').value.toUpperCase();
    const filtered = stocks.filter(s => s.symbol.includes(query) || s.name.toUpperCase().includes(query));
    renderStocks(filtered);
}

// Ekrana Verileri Bas
document.addEventListener("DOMContentLoaded", () => {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const nameElement = document.getElementById('user-name');
        if (nameElement) {
            nameElement.innerText = `Merhaba, ${tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name}!`;
        }
    }
    renderStocks(stocks);
});
