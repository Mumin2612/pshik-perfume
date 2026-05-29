const products = [
    { id: 1, name: "MU #01 Inspiration", desc: "Свежий цитрусовый аромат. Твой идеальный спутник на каждый день.", img: "https://via.placeholder.com/300", prices: {10: 450, 15: 650, 30: 1100, 50: 1600} },
    { id: 2, name: "MU #02 Tobacco Vanille", desc: "Теплый табак и сладкая ваниль. Аромат роскоши и уверенности.", img: "https://via.placeholder.com/300", prices: {10: 500, 15: 750, 30: 1300, 50: 1800} },
    { id: 3, name: "MU #03 Kirke Tiziana", desc: "Фруктовый коктейль с невероятным шлейфом. Хит сезона.", img: "https://via.placeholder.com/300", prices: {10: 450, 15: 700, 30: 1100, 50: 1700} },
    { id: 4, name: "MU #04 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: "https://via.placeholder.com/300", prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
    { id: 5, name: "MU #04 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: "https://via.placeholder.com/300", prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
    { id: 6, name: "MU #04 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: "https://via.placeholder.com/300", prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
    { id: 7, name: "MU #04 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: "https://via.placeholder.com/300", prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
    { id: 8, name: "MU #04 Molecule 02", desc: "Чистая амбра, которая раскрывается индивидуально на каждом.", img: "https://via.placeholder.com/300", prices: {10: 550, 15: 800, 30: 1400, 50: 2000} },
];

let cart = [];
let selectedVolumes = {};

function init() {
    const catalog = document.getElementById('catalog');
    if (!catalog) return;
    
    catalog.innerHTML = products.map(p => {
        selectedVolumes[p.id] = 10; // По умолчанию выбираем 10мл
        return `
            <div class="card">
                <img src="${p.img}" alt="${p.name}">
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
    
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
}

function setVolume(event, id, vol) {
    selectedVolumes[id] = vol;
    const p = products.find(x => x.id === id);
    const priceElem = document.getElementById(`price-${id}`);
    if (priceElem) priceElem.innerText = `${p.prices[vol]} ₽`;
    
    // Переключаем класс active между кнопками объёмов
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

    // НАПРАВЛЯЕМ ОБНОВЛЕНИЕ НА ВЕРХНЮЮ КНОПКУ КОРЗИНЫ
    const cartCountElem = document.getElementById('cart-count');
    if (cartCountElem) {
        cartCountElem.innerText = count;
    }

    // Обновляем список товаров внутри самой корзины
    const list = document.getElementById('cart-list');
    if (list) {
        list.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <b>${item.name}</b>
                    <span>${item.vol}ml — ${item.price * item.qty} ₽</span>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `).join('') || '<p style="text-align:center; color:#666;">Корзина пуста</p>';
    }

    // Обновляем итоговую сумму внизу корзины
    const overTotal = document.getElementById('overlay-total');
    if (overTotal) overTotal.innerText = `${total} ₽`;

    // Главная кнопка Telegram (появляется СНИЗУ ЭКРАНА только когда открыта корзина)
    const mainBtn = window.Telegram.WebApp.MainButton;
    const overlay = document.getElementById('cart-overlay');
    
    // Кнопка Телеграма "Оформить" видна ТОЛЬКО если корзина открыта (display === 'block') и там есть товары
    if (total > 0 && overlay && overlay.style.display === 'block') {
        mainBtn.setParams({ text: `ОФОРМИТЬ ЗАКАЗ (${total} ₽)`, is_visible: true, color: '#d4af37', text_color: '#000000' });
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
        updateUI(); // Перерисовываем, чтобы кнопка Telegram "Оформить" появилась
    }
}

function hideCart() { 
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.style.display = 'none'; 
        window.Telegram.WebApp.MainButton.hide(); // Прячем кнопку "Оформить", когда закрыли корзину
    }
}

// Отправка данных при клике на Главную кнопку Telegram
window.Telegram.WebApp.onEvent('mainButtonClicked', () => {
    const orderDetails = cart.map(item => `• ${item.name} (${item.vol}ml) x${item.qty}`).join('\n');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalPriceString = `${total} ₽`;
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    const customerName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : "Не указано";

    const dataToSend = {
        order: orderDetails,
        total: totalPriceString,
        customer: customerName
    };

    window.Telegram.WebApp.sendData(JSON.stringify(dataToSend));
});

// Навешиваем клик на верхнюю кнопку корзины
document.addEventListener("DOMContentLoaded", () => {
    init();
    const openCartBtn = document.getElementById('open-cart-btn');
    if (openCartBtn) {
        openCartBtn.addEventListener('click', showCart);
    }
});