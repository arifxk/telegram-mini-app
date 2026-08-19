var tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

// 3 Adet Özel Favori Listesi Yapısı (Yerel Hafıza)
var listTitles = JSON.parse(localStorage.getItem('bist_list_titles')) || ["Uzun Vadeli", "Temettü Portföyü", "Takip Listem"];
var userLists = JSON.parse(localStorage.getItem('bist_user_lists')) || [
    ["THYAO", "GARAN", "ASELS"], // 1. Liste
    ["EREGL", "TUPRS", "BIMAS"], // 2. Liste
    ["SASA", "KCHOL"]            // 3. Liste
];

// BIST Taslak Havuzu
var stocks = [
    { symbol: "THYAO", name: "Türk Hava Yolları", price: "298.50", change: "2.45" },
    { symbol: "GARAN", name: "Garanti Bankası", price: "112.10", change: "-0.80" },
    { symbol: "EREGL", name: "Ereğli Demir Çelik", price: "48.30", change: "1.15" },
    { symbol: "ASELS", name: "Aselsan", price: "64.70", change: "3.20" },
    { symbol: "KCHOL", name: "Koç Holding", price: "210.40", change: "-1.50" },
    { symbol: "SASA", name: "Sasa Polyester", price: "42.10", change: "0.00" },
    { symbol: "TUPRS", name: "Tüpraş", price: "175.00", change: "1.30" },
    { symbol: "BIMAS", name: "BİM Mağazalar", price: "510.00", change: "1.60" }
];

// Taslak Haber Akışı
var newsData = [
    { title: "KAP: THYAO yeni uçak sipariş detaylarını açıkladı.", time: "10 Dk Önce" },
    { title: "TCMB Faiz Kararı Sonrası BIST 100 Endeksi Yükselişte.", time: "25 Dk Önce" },
    { title: "EREGL: Temettü dağıtım tarihi genel kurulda onaylandı.", time: "1 Saat Önce" },
    { title: "Küresel Piyasalar Fed Açıklamalarına Odaklandı.", time: "2 Saat Önce" }
];

// Swiper Başlatma
var swiper;

// Liste Başlığı Değiştirme
function renameList(index) {
    var newName = prompt("Liste adını giriniz:", listTitles[index]);
    if (newName && newName.trim() !== "") {
        listTitles[index] = newName.trim();
        localStorage.setItem('bist_list_titles', JSON.stringify(listTitles));
        updateListTitles();
    }
}

function updateListTitles() {
    var t1 = document.getElementById('title-list1');
    var t2 = document.getElementById('title-list2');
    var t3 = document.getElementById('title-list3');
    
    if(t1) t1.innerText = "⭐ " + listTitles[0] + " ✏️";
    if(t2) t2.innerText = "💼 " + listTitles[1] + " ✏️";
    if(t3) t3.innerText = "🚀 " + listTitles[2] + " ✏️";
}

// Ekrana Basma
function renderAll() {
    updateListTitles();

    for (var listIndex = 0; listIndex < 3; listIndex++) {
        var container = document.getElementById('container-list' + (listIndex + 1));
        if(!container) continue;
        
        container.innerHTML = '';
        var currentSymbols = userLists[listIndex];

        var filteredStocks = stocks.filter(function(s) {
            return currentSymbols.indexOf(s.symbol) > -1;
        });

        if (filteredStocks.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:15px; color:#787b86; font-size:12px;">Bu listede henüz hisse yok.</div>';
            continue;
        }

        for (var i = 0; i < filteredStocks.length; i++) {
            var stock = filteredStocks[i];
            var numChange = parseFloat(stock.change);
            var isUp = numChange >= 0;
            var changeClass = isUp ? 'up' : 'down';
            var prefix = (isUp && numChange > 0) ? '+' : '';

            var card = document.createElement('div');
            card.className = 'stock-card ' + changeClass;
            card.innerHTML = 
                '<div>' +
                    '<span class="stock-symbol">' + stock.symbol + '</span>' +
                    '<span class="stock-name">' + stock.name + '</span>' +
                '</div>' +
                '<div class="stock-price-info">' +
                    '<span class="stock-price">₺' + stock.price + '</span>' +
                    '<span class="stock-change ' + changeClass + '">' + prefix + '%' + stock.change + '</span>' +
                '</div>';
            container.appendChild(card);
        }
    }

    var newsContainer = document.getElementById('news-container');
    if(newsContainer) {
        newsContainer.innerHTML = '';
        for (var n = 0; n < newsData.length; n++) {
            var news = newsData[n];
            var newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = 
                '<span class="news-title">' + news.title + '</span>' +
                '<span class="news-time">' + news.time + '</span>';
            newsContainer.appendChild(newsCard);
        }
    }
}

// Saat ve Seans
function updateMarketStatus() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    
    var timeElem = document.getElementById('market-time');
    if(timeElem) timeElem.innerText = hours + ':' + minutes + ':' + seconds;

    var day = now.getDay();
    var currentMinute = now.getHours() * 60 + now.getMinutes();
    var isOpen = (day >= 1 && day <= 5) && (currentMinute >= 600 && currentMinute < 1080);

    var statusElem = document.getElementById('market-status');
    if (statusElem) {
        if (isOpen) {
            statusElem.innerText = "AÇIK";
            statusElem.className = "status-badge status-open";
        } else {
            statusElem.innerText = "KAPALI";
            statusElem.className = "status-badge status-closed";
        }
    }
}

function initApp() {
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        var nameElem = document.getElementById('user-name');
        if (nameElem) nameElem.innerText = 'Merhaba, ' + (tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name) + '!';
    }
    
    // Swiper Başlat
    if (typeof Swiper !== 'undefined') {
        swiper = new Swiper('.mySwiper', {
            pagination: { el: '.swiper-pagination', clickable: true },
        });
    }

    setInterval(updateMarketStatus, 1000);
    updateMarketStatus();
    renderAll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
