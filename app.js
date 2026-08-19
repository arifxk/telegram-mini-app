// Telegram uygulamasını başlat
const tg = window.Telegram.WebApp;

// Uygulamayı ekrana tam oturt
tg.expand();

// Kullanıcının Telegram adını alıp ekrana yaz
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    document.getElementById('user-name').innerText = `Merhaba, ${tg.initDataUnsafe.user.first_name}! 👋`;
}

function sayHello() {
    tg.showAlert("Uygulama başarıyla çalışıyor!");
}
