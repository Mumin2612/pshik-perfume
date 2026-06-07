const products = [
    { id: 1, name: "PERFUME #01 Inspiration", desc: "Свежий цитрусовый аромат. Твой идеальный спутник на каждый день.", img: ["https://via.placeholder.com/300/1a1a1a/D4B78F?text=Img+1", "https://via.placeholder.com/300/2c2c2c/D4B78F?text=Img+2"], prices: {10: 450, 15: 650, 30: 1100, 50: 1600} },
    { id: 2, name: "PERFUME #02 Tobacco Vanille", desc: "Теплый табак и сладкая ваниль. Аромат роскоши и уверенности.", img: ["https://via.placeholder.com/300/1a1a1a/D4B78F?text=Img+1"], prices: {10: 500, 15: 750, 30: 1300, 50: 1800} },
    { id: 3, name: "PERFUME #03 Kirke Tiziana", desc: "Фруктовый коктейль с невероятным шлейфом. Хит сезона.", img: ["https://via.placeholder.com/300"], prices: {10: 450, 15: 700, 30: 1100, 50: 1700} },
    { id: 4, name: "PERFUME #04 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: ["molecula%2001.jpg", "molecule%202.jpg", "molecule%203.webp"], prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
    { id: 5, name: "PERFUME #05 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: ["https://via.placeholder.com/300"], prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
    { id: 6, name: "PERFUME #06 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: ["https://via.placeholder.com/300"], prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
    { id: 7, name: "PERFUME #07 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: ["https://via.placeholder.com/300"], prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
    { id: 8, name: "PERFUME #08 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: ["https://via.placeholder.com/300"], prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
];

let cart = [];
let selectedVolumes = {};

// Глобальные переменные для галереи картинок
let currentGalleryImages = [];
let currentGalleryIndex = 0;

function init() {
    const catalog = document.getElementById('catalog');
    if (!catalog) return;
    
    // Рендерим основные товары
    let htmlContent = products.map(p => {
        selectedVolumes[p.id] = 10; // По умолчанию выбираем 10мл
        // Берем первое фото как обложку, если это массив
        const coverImg = Array.isArray(p.img) ? p.img[0] : p.img;
        
        return `
            <div class="card">
                <img src="${coverImg}" alt="${p.name}" onclick="openGallery(${p.id})" style="cursor:zoom-in;">
                <h3>${p.name}</h3>
                <div class="desc">${p.desc}</div>
                <div class="volume-selector" id="vol-sel-${p.id}">
                    ${Object.keys(p.prices).map(v => `<button class="vol-btn ${v==10?'active':''}" onclick="setVolume(event, ${p.id}, ${v})">${v}ml</button>`).join('')}
                </div>
                <div class="price-tag" id="price-${p.id}">${p.prices[10]} ₽</div>
                <button class="buy-btn" onclick="addToCart(${p.id})">Добавить</button>
            </div>
        `;
    }).join('');

    // В КОНЕЦ КАТАЛОГА ДОБАВЛЯЕМ КАРТОЧКУ ДЛЯ ПРЕДЗАКАЗА
    htmlContent += `
        <div class="card" style="border: 1px dashed #D4B78F; background: rgba(212, 183, 143, 0.03); justify-content: center; align-items: center; text-align: center; min-height: 280px;">
            <div style="font-size: 32px; margin-bottom: 10px;">✨</div>
            <h3 style="color: #D4B78F;">Не нашли свои духи?</h3>
            <div class="desc" style="margin-bottom: 15px; padding: 0 5px;">Мы можем привезти любой элитный аромат под заказ специально для вас!</div>
            <button class="buy-btn" onclick="showPreorder()" style="border: 1px solid #D4B78F; background: transparent; color: #D4B78F; width: 85%;">Оформить предзаказ</button>
        </div>
    `;
    
    catalog.innerHTML = htmlContent;
    
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
}

// --- ЛОГИКА ГАЛЕРЕИ ФОТОГРАФИЙ ---
function openGallery(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    
    // Переводим картинку в массив, если это была просто строка
    currentGalleryImages = Array.isArray(p.img) ? p.img : [p.img];
    currentGalleryIndex = 0;
    
    const overlay = document.getElementById('gallery-overlay');
    const imgElem = document.getElementById('gallery-img');
    const arrows = document.querySelectorAll('.gallery-arrow');
    
    if (overlay && imgElem) {
        imgElem.src = currentGalleryImages[currentGalleryIndex];
        overlay.style.display = 'flex';
        
        // Прячем стрелочки, если у товара всего 1 картинка
        arrows.forEach(arrow => {
            arrow.style.display = currentGalleryImages.length > 1 ? 'block' : 'none';
        });
    }
}

function closeGallery() {
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) overlay.style.display = 'none';
}

function nextImg() {
    if (currentGalleryImages.length <= 1) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
    document.getElementById('gallery-img').src = currentGalleryImages[currentGalleryIndex];
}

function prevImg() {
    if (currentGalleryImages.length <= 1) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    document.getElementById('gallery-img').src = currentGalleryImages[currentGalleryIndex];
}

// --- ЛОГИКА ПРЕДЗАКАЗА ---
function showPreorder() {
    const overlay = document.getElementById('preorder-overlay');
    if (overlay) overlay.style.display = 'block';
}

function hidePreorder() {
    const overlay = document.getElementById('preorder-overlay');
    if (overlay) overlay.style.display = 'none';
}

function sendPreorder() {
    const perfumeName = document.getElementById('preorder-name').value.trim();
    const perfumeVol = document.getElementById('preorder-vol').value.trim();
    
    if (!perfumeName) {
        alert("Пожалуйста, введите название духов!");
        return;
    }
    
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    const customerName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : "Не указано";
    
    // Формируем специальный JSON-пакет, который поймет Python-бэкэнд
    const preorderData = {
        type: "preorder",
        perfume: perfumeName,
        volume: perfumeVol || "Не указан",
        customer: customerName
    };
    
    window.Telegram.WebApp.sendData(JSON.stringify(preorderData));
    hidePreorder();
}

// --- ОСТАЛЬНАЯ ЛОГИКА ТОВАРА И КОРЗИНЫ (ИСПРАВЛЕННАЯ) ---
function setVolume(event, id, vol) {
    selectedVolumes[id] = vol;
    const p = products.find(x => x.id === id);
    const priceElem = document.getElementById(`price-${id}`);
    if (priceElem) priceElem.innerText = `${p.prices[vol]} ₽`;
    
    const btns = document.getElementById(`vol-sel-${id}`).querySelectorAll('.vol-btn');
    btns.forEach(b => b.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    const vol = selectedVolumes[id];
    const price = p.prices[vol];
    
    const existing = cart.find(item => item.id === id && item.vol === vol);
    if (existing) { 
        existing.qty++; 
    } else { 
        cart.push({ id, name: p.name, vol, price, qty: 1 }); 
    }
    
    updateUI();
}

function updateUI() {
    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let count = cart.reduce((sum, item) => sum + item.qty, 0);

    const cartCountElem = document.getElementById('cart-count');
    if (cartCountElem) {
        cartCountElem.innerText = count;
    }

    const list = document.getElementById('cart-list');
    if (list) {
        list.innerHTML = cart.map((item, index) => `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:#1A1A1A; padding:10px; border-radius:8px;">
                <div class="cart-item-info">
                    <b style="display:block; font-size:14px;">${item.name}</b>
                    <span style="color:#D4B78F; font-size:12px;">${item.vol}ml — ${item.price * item.qty} ₽</span>
                </div>
                <div class="qty-controls" style="display:flex; align-items:center; gap:10px;">
                    <button class="vol-btn" style="padding:2px 10px;" onclick="changeQty(${index}, -1)">-</button>
                    <span style="font-weight:bold;">${item.qty}</span>
                    <button class="vol-btn" style="padding:2px 10px;" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `).join('') || '<p style="text-align:center; color:#8E8E93; margin-top:20px;">Корзина пуста</p>';
    }

    const overTotal = document.getElementById('overlay-total');
    if (overTotal) overTotal.innerText = `${total} ₽`;

    const mainBtn = window.Telegram.WebApp.MainButton;
    const overlay = document.getElementById('cart-overlay');
    
    if (total > 0 && overlay && overlay.style.display === 'block') {
        mainBtn.setParams({ text: `ОФОРМИТЬ ЗАКАЗ (${total} ₽)`, is_visible: true, color: '#D4B78F', text_color: '#121212' });
    } else {
        mainBtn.hide();
    }
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateUI();
}

function showCart() { 
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.style.display = 'block'; 
        updateUI();
    }
}

function hideCart() { 
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.style.display = 'none'; 
        window.Telegram.WebApp.MainButton.hide();
    }
}

// Отправка обычного заказа
window.Telegram.WebApp.onEvent('mainButtonClicked', () => {
    const orderDetails = cart.map(item => `• ${item.name} (${item.vol}ml) x${item.qty}`).join('\n');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalPriceString = `${total} ₽`;
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    const customerName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : "Не указано";

    const dataToSend = {
        type: "order",
        order: orderDetails,
        total: totalPriceString,
        customer: customerName
    };

    window.Telegram.WebApp.sendData(JSON.stringify(dataToSend));
});

document.addEventListener("DOMContentLoaded", () => {
    init();
    const openCartBtn = document.getElementById('open-cart-btn');
    if (openCartBtn) {
        openCartBtn.addEventListener('click', showCart);
    }
    
    // Также вешаем вызов оформления на обычную кнопку "Оформить заказ" внутри разметки
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                window.Telegram.WebApp.MainButton.click();
            }
        });
    }
});
