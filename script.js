function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const itensCart = document.querySelector('.cart__items');

function storingCart() {
  localStorage.setItem('Cart', itensCart.innerHTML);
}

let sumOfPrices = 0;
const totalPrice = document.querySelector('.total-price');

function cartItemClickListener(event) {
  const targetPrice = parseFloat(event.target.innerText.split('$')[1]);
  sumOfPrices -= targetPrice;
  totalPrice.innerText = sumOfPrices;
  event.target.remove();
  localStorage.setItem('preço', totalPrice.innerText);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  itensCart.appendChild(li);
  storingCart();

  sumOfPrices += price;
  totalPrice.innerText = sumOfPrices;
  localStorage.setItem('preço', totalPrice.innerText);
}

function addItensToCart(event) {
  const bttnParentSection = event.target.parentElement;
  const elementId = getSkuFromProductItem(bttnParentSection);
  return fetch(`https://api.mercadolibre.com/items/${elementId}`)
  .then((response) => response.json())
  .then((jsonObj) => createCartItemElement(jsonObj));
}

function activateEventListener() {
  const addToCartButtons = document.querySelectorAll('.item__add');
  addToCartButtons.forEach((button) => button.addEventListener('click', addItensToCart));
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const removeLoading = () => {
  const loadingTxt = document.querySelector('.loading');
  loadingTxt.parentElement.removeChild(loadingTxt);
};

function createProductItemElement({ sku, name, image }) {
  const itemsContainer = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  activateEventListener();
  itemsContainer.appendChild(section);
}

// Ajuda do Luiz Gustavo e do Victor Martins no requisito 1
const results = (info) => {
  const result = info.results;
  const newArray = result.map(({ id, title, thumbnail }) => ({
      sku: id,
      name: title,
      image: thumbnail,
    }));
    removeLoading();
  return newArray.forEach((element) => createProductItemElement(element));
};

const fetchAllItens = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const data = await response.json();
    return results(data);
  } catch (error) {
    console.log(error.message);
  }
};

function resetStoragePrice() {
  totalPrice.innerText = 0;
  sumOfPrices = 0;
  localStorage.setItem('preço', 0);
}

function clearCart() {
  itensCart.innerHTML = '';
  storingCart();
  resetStoragePrice();
}

const clearBttn = document.querySelector('.empty-cart');
clearBttn.addEventListener('click', clearCart);

window.onload = () => {
  fetchAllItens();
  itensCart.innerHTML = (localStorage.getItem('Cart'));
  const li = document.querySelectorAll('.cart__item');
  li.forEach((iten) => iten.addEventListener('click', cartItemClickListener));
  const recoveredPrice = localStorage.getItem('preço');
  totalPrice.innerHTML = recoveredPrice;
};
