function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItensToCart(event) {
  const cartItems = document.querySelector('.cart__items');

  const bttnParentSection = event.target.parentElement;

  const elementId = getSkuFromProductItem(bttnParentSection);
  return fetch(`https://api.mercadolibre.com/items/${elementId}`)
  .then((response) => response.json())
  .then((jsonObj) => cartItems.appendChild(createCartItemElement(jsonObj)));
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

function createProductItemElement({ sku, name, image }) {
  const itemsContainer = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  activateEventListener();
  return itemsContainer.appendChild(section);
}
// Ajuda do Luiz Gustavo e do Victor Martins
const results = (info) => {
  const result = info.results;
  const newArray = result.map(({ id, title, thumbnail }) => {
    const element = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    return element;
  });
  console.log(newArray);
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

window.onload = () => {
  fetchAllItens();
};
