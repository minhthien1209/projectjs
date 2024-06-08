import { games, toggleFavorite, favoriteGames, toggleCart, carts, accountLogin } from "./api.js";

const countHeart = document.getElementById("countHeart");
const countCart = document.getElementById("countCart");
const nameUser = document.getElementById("name");



if (nameUser) {
    if (accountLogin && accountLogin.name) {
        nameUser.innerHTML = accountLogin.name;
        nameUser.href = "#"; // Không cần thay đổi link nếu đã đăng nhập
    } else {
        nameUser.innerHTML = "Đăng nhập";
        nameUser.href = "./login.html"; // Gắn link tới trang đăng nhập
    }
}



if (countHeart) {
    countHeart.innerHTML = favoriteGames.length || "0";
}

if (countCart) {
    countCart.innerHTML = carts.length || "0";
}

document.getElementById('logout').addEventListener('click', function() {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('accountLogin');

    // Xóa toàn bộ danh sách yêu thích và giỏ hàng
    localStorage.removeItem('favoriteGames');
    localStorage.removeItem('carts');

    // Điều hướng về trang đăng nhập
    window.location.href = './login.html';
});

function renderGames(games, container) {
    console.log(accountLogin);

    container.innerHTML = "";
    games.forEach((game) => {
        const gameCard = document.createElement("a");
        gameCard.href = "";
        gameCard.className = "gameCard position-relative none-link col p-3";

        const imageDiv = document.createElement("div");
        imageDiv.className = "image position-relative";

        const img = document.createElement("img");
        img.src = game.imageSrc;
        img.alt = "";
        img.className = "imageSrc";

        const heartIcon = document.createElement("i");
        heartIcon.className = "bi bi-heart-fill position-absolute";
        // Kiểm tra nếu game đã có trong danh sách yêu thích để đổi màu trái tim
        if (favoriteGames.some((fav) => fav.name === game.name)) {
            heartIcon.style.color = "red"; // Set color to red if game is in favorites
        } else {
            heartIcon.style.color = "white";
        }

        heartIcon.onclick = (e) => {
            e.preventDefault();
            toggleFavorite(game, game.name, heartIcon);
            if (countHeart) {
                countHeart.innerHTML = favoriteGames.length || "0";
            }
        };

        imageDiv.appendChild(img);
        imageDiv.appendChild(heartIcon);

        const aboutInfoDiv = document.createElement("div");
        aboutInfoDiv.className = "about-info pt-3 d-flex flex-row justify-content-between align-items-center";

        const typeDiv = document.createElement("div");
        typeDiv.className = "type fs-7 fw-bolder";
        typeDiv.textContent = game.type[0];

        const starsDiv = document.createElement("div");
        starsDiv.className = "stars d-flex flex-row";

        for (let i = 0; i < game.star; i++) {
            const starIcon = document.createElement("i");
            starIcon.className = "bi bi-star-fill";
            starsDiv.appendChild(starIcon);
        }

        aboutInfoDiv.appendChild(typeDiv);
        aboutInfoDiv.appendChild(starsDiv);

        const nameDiv = document.createElement("div");
        nameDiv.className = "name pt-3 fw-bold fs-6 text-uppercase";
        nameDiv.textContent = game.name;

        const priceInfoDiv = document.createElement("div");
        priceInfoDiv.className = "price-info d-flex flex-row align-items-center justify-content-between pt-2";

        const discountP = document.createElement("p");
        discountP.className = "discount fst-italic fw-bolder p-1 fs-6";
        discountP.textContent = `${game.discount}%`;

        const priceP = document.createElement("p");
        priceP.className = "price fs-7";
        priceP.textContent = `$${game.price.toFixed(2)}`;

        const salePrice = game.price - (game.discount / 100) * game.price;
        const saleP = document.createElement("p");
        saleP.className = "sale fw-bolder fs-6";
        saleP.textContent = `$${salePrice.toFixed(2)}`;

        priceInfoDiv.appendChild(discountP);
        priceInfoDiv.appendChild(priceP);
        priceInfoDiv.appendChild(saleP);

        const addCartDiv = document.createElement("div");
        addCartDiv.className = "addCart";

        const cartIcon = document.createElement("i");
        cartIcon.className = carts.some((cart) => cart.name === game.name)
            ? "bi bi-bag-dash-fill position-absolute bg-primary"
            : "bi bi-bag-plus-fill position-absolute bg-primary";

        cartIcon.onclick = (e) => {
            e.preventDefault();
            toggleCart(game, game.name, cartIcon);
            if (countCart) {
                countCart.innerHTML = carts.length || "0";
            }
        };

        addCartDiv.appendChild(cartIcon);

        gameCard.appendChild(imageDiv);
        gameCard.appendChild(aboutInfoDiv);
        gameCard.appendChild(nameDiv);
        gameCard.appendChild(priceInfoDiv);
        gameCard.appendChild(addCartDiv);

        container.appendChild(gameCard);
    });
}

function renderCart(container) {

    console.log(carts);
    if (carts.length === 0) {
        container.innerHTML = "Chưa có game nào trong danh sách.";
        return;
    }

    container.innerHTML = `
        <p class="heading fs-5 fw-bolder">My Cart</p>
        <div class="row-cart">
            <p></p>
            <p class="ps-6">Tên</p>
            <p class="">Thể Loại</p>
            <p class="pe-6">Giá</p>
            <p></p>
        </div>
    `;

    carts.forEach((game) => {
        const cartItem = document.createElement("div");
        cartItem.className = "row-cart cart-item mt-3";

        cartItem.innerHTML = `
            <img class="image" src="${game.imageSrc}" alt="">
            <p class="fw-bolder">${game.name}</p>
            <p class="fw-bolder">${game.type[0]}</p>
            <p class="fw-bolder">$${game.price.toFixed(2)}</p>
            <i class="bi bi-dash-circle-fill text-rose fs-4"></i>
        `;

        const removeIcon = cartItem.querySelector(".bi-dash-circle-fill");
        removeIcon.onclick = (e) => {
            e.preventDefault();
            toggleCart(game, game.name, removeIcon);
            renderCart(container);
            if (countCart) {
                countCart.innerHTML = carts.length || "0";
            }
        };

        container.appendChild(cartItem);
    });

    const totalPrice = carts.reduce((total, game) => total + game.price, 0);
    container.insertAdjacentHTML("beforeend", `
        <hr>
        <div class="pay">
            <p class="totalPrice">
                Total Price: <span class="price fw-bolder">$${totalPrice.toFixed(2)}</span>
            </p>
            <div class="button-submit">Submit</div>
        </div>
    `);
}

document.addEventListener("DOMContentLoaded", () => {
    const listGame = document.querySelector(".listGame");
    const viewGame = document.querySelector(".viewGame");
    const listFavorites = document.querySelector(".listFavorites");
    const cartGame = document.querySelector(".cartGame");

    if (listGame) {
        renderGames(games, listGame);
    }

    if (viewGame) {
        renderGames(games.slice(0, 4), viewGame);
    }

    if (listFavorites) {
        renderGames(favoriteGames, listFavorites);
    }

    if (cartGame) {
        renderCart(cartGame);
    }
});
