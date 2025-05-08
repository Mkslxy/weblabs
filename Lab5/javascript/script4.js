const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

const watchHistory = document.getElementById('watchHistory');

const productMap = new Map(); // для зберрігання
const history = new WeakMap(); // для історії

// замовлення
const orderProduct = document.getElementById('orderProduct');

orderProduct.addEventListener('click', () => {
  const name = document.getElementById('orderName').value.trim();
  const orderQuantity = parseInt(document.getElementById('orderQuantity').value, 10);

  if (!productMap.has(name)) {
    alert(`Продукт "${name}" не знайдено`);
    return;
  }

  const product = productMap.get(name);

  if (orderQuantity > product.stock) {
    alert(`Недостатньо товару на складі. Доступна кількіість: ${product.stock} шт.`);
  } else {
    product.stock -= orderQuantity;
    recordChange(name, `Замовлено ${orderQuantity} шт.`);
    alert(`Замовлення успішне! Ви замовили: ${name}, ${orderQuantity} шт.`);

    showProducts();
  }
  document.getElementById('orderName').value = '';
  document.getElementById('orderQuantity').value = '';
});


// історія
watchHistory.addEventListener('click', () => {
  const name = document.getElementById('historyName').value.trim();

  if (!productMap.has(name)) {
    alert(`Продукт "${name}" не знайдено`);
    return;
  }

  const product = productMap.get(name);

  // якщо продукт не має історії, додаємо нову історію
  if (!history.has(product)) {
    history.set(product, []);
  }

  // отримуєм історію змін продукту
  const productHistory = history.get(product);

  if (productHistory.length === 0) {
    alert(`Немає записів для продукту "${name}".`);
  } else {
    const historyLog = productHistory
      .map((entry, index) => `${index + 1}. ${entry.timestamp} - ${entry.action}`)
      .join('\n');
    alert(`Історія змін для "${name}":\n${historyLog}`);
  }
});

// додавання змін до історії при оновленні/замовленні
function recordChange(name, action) {
  if (productMap.has(name)) {
    const product = productMap.get(name);

    if (!history.has(product)) {
      history.set(product, []);
    }

    const productHistory = history.get(product);
    productHistory.push({
      action,
      timestamp: new Date().toLocaleString(),
    });
  }
}


// додавання
productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const stock = parseInt(document.getElementById('product-stock').value, 10);

  if (productMap.has(name)) {
    const product = productMap.get(name);
    
    productMap.set(name, {
      price: price,
      stock: product.stock + stock,
    });
  } else {
    productMap.set(name, { price, stock });
    recordChange(name, `Додано ${stock} шт. , ціна: ${price} грн`);
  }

  showProducts();
  productForm.reset();
});


// показ продуктів
function showProducts() {
  productList.innerHTML = '';

  productMap.forEach((value, key) => {
    if (value && key) {
      const item = document.createElement('div');
      item.textContent = `${key} - ${value.price} грн - ${value.stock} шт`;
      productList.appendChild(item);
    }
  });
}



const deleteProduct = document.getElementById('deleteProduct');


// видалення товару
deleteProduct.addEventListener('click', () => {
  const name = document.getElementById('deleteName').value.trim().toLowerCase();

  if (productMap.has(name)) {
    productMap.delete(name);
    recordChange(name, `Видалено ${name}`);
    alert(`Товар "${name}" успішно видалено.`);
    showProducts(); 
    document.getElementById('deleteName').value = '';
  } else {
    alert(`Товар "${name}" не знайдено.`);
  }
});

// оновлення
const updateProduct = document.getElementById('updateProduct');

updateProduct.addEventListener('click', () => {
  const name = document.getElementById('updateName').value.trim();
  const updatePrice = parseFloat(document.getElementById('updatePrice').value);
  const updateStock = parseInt(document.getElementById('updateStock').value, 10);

  if (productMap.has(name)) {
    productMap.set(name, { price: updatePrice, stock: updateStock });
    recordChange(name, `Оновлено ${updateStock} шт. , ціна: ${updatePrice} грн`);
    alert(`Продукт ${name} оновлено`);
    showProducts();
    productForm.reset();
  } else {
    alert(`Продукт ${name} не знайдено`);
  }
});

// пошук
const findProduct = document.getElementById('findProduct');

findProduct.addEventListener('click', () => {
  const name = document.getElementById('findName').value.trim();

  if (productMap.has(name)) {
    const foundProduct = productMap.get(name);
    alert(`Продукт ${name} знайдено: \nЦіна: ${foundProduct.price} грн \nКількість на складі: ${foundProduct.stock} шт`);
  } else {
    alert(`Продукт ${name} не знайдено`);
  }

});




