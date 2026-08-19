// Telegram WebApp Başlatma
var tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
    tg.expand();
}

// BIST Test Verileri
var stocks = [
    { symbol: "THYAO", name: "Türk Hava Yolları", price: "298.50", change: "+2.45" },
    { symbol: "GARAN", name: "Garanti Bankası", price: "112.10", change: "-0.80" },
    { symbol: "EREGL", name: "Ereğli Demir Çelik", price: "48.30", change: "+1.15" },
    { symbol: "ASELS", name: "Aselsan", price: "64.70", change: "+3.20" },
    { symbol: "KCHOL", name: "Koç Holding", price: "210.40", change: "-1.50" },
    { symbol: "SASAN", name: "Sasa Polyester", price: "42.10", change: "0.00" }
];

// Ekrana Liste Basma
function renderStocks(data) {
    var container = document.getElementById('stock-container');
    if (!container) return;
    
    container.innerHTML = '';

    for (var i = 0; i < data.length; i++) {
        var stock = data[i];
        var numChange = parseFloat(stock.change);
        var isUp = numChange >= 0;
        var changeClass = isUp ? 'up' : 'down';
        var changeSign = (isUp && numChange > 0) ? '+' : '';

        var card = document.createElement('div');
        card.className = 'stock-card ' + changeClass;
        card.innerHTML = 
            '<div>' +
                '<span class="stock-symbol">' + stock.symbol + '</span>' +
                '<span class="stock-name">' + stock.name + '</span>' +
            '</div>' +
            '<div class="stock-price-info">' +
                '<span class="stock-price">₺' + stock.price + '</span>' +
                '<span class="stock-change ' + changeClass + '">' + changeSign + '%' + stock.change + '</span>' +
            '</div>';
        
        container.appendChild(card);
    }
}

// Arama Filtresi
function filterStocks() {
    var input = document.getElementById('search-input');
    if (!input) return;
    var query = input.value.toUpperCase();
    
    var filtered = [];
    for (var i = 0; i < stocks.length; i++) {
        if (stocks[i].symbol.indexOf(query) > -1 || stocks[i].name.toUpperCase().indexOf(query) > -1) {
            filtered.push(stocks[i]);
        }
    }
    renderStocks(filtered);
}

// Sayfa Yüklendiğinde Doğrudan Çalıştır
function initApp() {
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        var nameElement = document.getElementById('user-name');
        if (nameElement) {
            var userName = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
            nameElement.innerText = 'Merhaba, ' + userName + '!';
        }
    }
    renderStocks(stocks);
}

// Anında tetikle
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
