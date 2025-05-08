let goods = []
let filteredGoods = [];

const sort = document.getElementById("sort");
const category = document.getElementById("category");
const clearSortBtn = document.getElementById("clearSortBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const showAddProductModalBtn = document.getElementById("showAddProductModalBtn");

function AddProduct() {
    event.preventDefault();
    const name = document.getElementById('add-name').value.trim();
    const category = document.getElementById('add-category').value.trim();
    const price = document.getElementById('add-price').value.trim();
    const imageInput = document.getElementById('add-image');

    if (!name || !category || !price || imageInput.files.length === 0) {
        alert("Будь ласка, заповніть усі поля!");
        return;
    }


    const lastId = goods.length > 0 ? goods[goods.length - 1].id : 0;
    const newId = lastId + 1;


    const imageFile = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {

        const now = new Date().toISOString();

        const newProduct = {
            id: newId,
            name: name,
            category: category,
            price: price + "$",
            img: e.target.result,
            createdAt: now,
            updatedAt: now
        };

        goods.push(newProduct);
        filteredGoods.push(newProduct);
        renderProducts();


        const link = document.createElement('a');
        link.href = e.target.result;
        link.download = `${newId}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSnackbar(`${newProduct.name} was added`, 'added');
        updateProductCount()
        hideAddProductModal();
    };

    reader.readAsDataURL(imageFile);
}

function showAddProductModal() {
    if (document.getElementById('add-product-modal')) return;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'add-product-modal';
    modalContainer.style.display = 'block';

    modalContainer.innerHTML = `
        <div class="blurred-background"></div>
        <div class="modal-edit">
            <h1>Add product</h1>
            <form id="add-product-form">
                <label>Name:
                    <input id="add-name" type="text" required>
                </label>
                <label>Category:
                    <input id="add-category" type="text" required>
                </label>
                <label>Price:
                    <input id="add-price" type="number" min="0" required>
                </label>
                <label>Image:
                    <input id="add-image" type="file" accept="image/*" required>
                </label>
                <div class="button-wrapper">
                    <button class="btn" type="button" id="cancelProductBtn">Close</button>
                    <button class="btn" type="submit" id="addProductBtn" >Add</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalContainer);

    const form = document.getElementById('add-product-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAddProductModal();
    });
    const addProductBtn = document.getElementById('addProductBtn');
    addProductBtn.addEventListener('click', () => {
        AddProduct()
    })
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    cancelProductBtn.addEventListener('click', () => {
        hideAddProductModal()
    })
}

function hideAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    if (modal) modal.remove();
}

function renderProducts() {
    const container = document.querySelector('.products-container');
    container.innerHTML = '';

    updateCategoryFilter();

    const totalPriceElem = document.getElementById('total-price');
    const noGoodsText = document.getElementById('hint-text');

    if (goods.length === 0) {
        noGoodsText.classList.remove("hide");
        noGoodsText.classList.add("show");
        totalPriceElem.classList.add('hide');
        totalPriceElem.classList.remove('show');
        return;
    }
    noGoodsText.classList.remove("show");
    noGoodsText.classList.add("hide");
    let total = 0;
    for (const product of goods) {
        const numPrice = parseFloat(product.price.replace(/[^\d.-]/g, ''));
        total += isNaN(numPrice) ? 0 : numPrice;
    }

    totalPriceElem.textContent = `Total: ${total}$`;
    totalPriceElem.classList.remove('hide');
    totalPriceElem.classList.add('show');

    goods.forEach(product => {
        console.log(product.img)

        const card = document.createElement('div');
        card.className = 'product-card added';
        card.innerHTML = `
            <div class="image-wrapper">
                <img class="product-img" src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="main-info">
                    <span class="product-name">${product.name}</span>
                    <span class="product-category">${product.category}</span>
                </div>
                <span class="product-price">${product.price}</span>
            </div>
            <div class="hover-menu">
                <button class="btn edit-product-button">Edit</button>
                <button class="btn delete-product-button" data-id="${product.id}">Delete</button>
            </div>
        `;
        container.appendChild(card);

        setTimeout(() => {
            card.classList.remove('added');
        }, 600);

        const deleteButton = card.querySelector('.delete-product-button');
        deleteButton.addEventListener('click', () => {

            card.classList.add('removed');
            setTimeout(() => {

                deleteProductById(product.id);
            }, 600);
        });
    });


    document.querySelectorAll('.edit-product-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.product-card').querySelector('.delete-product-button').dataset.id);
            const product = goods.find(g => g.id === id);
            if (product) {
                showEditProductModal(product);
            }
        });
    });
    updateProductCount();

}

function deleteProductById(productId) {
    goods = goods.filter(product => product.id !== productId);
    filteredGoods = filteredGoods.filter(product => product.id !== productId);
    renderProducts();
    updateProductCount()
    showSnackbar('Product was removed', 'removed');
}

function showEditProductModal(product) {

    document.querySelectorAll('.blurred-background, .modal-edit').forEach(el => el.remove());

    const blurred = document.createElement('div');
    blurred.className = 'blurred-background';

    const modal = document.createElement('div');
    modal.className = 'modal-edit';
    modal.innerHTML = `
        <h1>Edit</h1>
        <form>
            <label>Name:
                <input id="modal-name" type="text" value="${product.name}" required>
            </label>
            <label>Category:
                <input id="modal-category" type="text" value="${product.category}" required>
            </label>
            <label>Price:
                <input id="modal-price" type="number" min="0" value="${parseInt(product.price)}" required>
            </label>
            <label>Image:
                <input id="modal-image" type="file" accept="image/*">
            </label>
            <div class="button-wrapper">
                <button class="btn" type="button" id="close-modal">Close</button>
                <button class="btn" type="submit">Save</button>
            </div>
        </form>
    `;

    document.body.appendChild(blurred);
    document.body.appendChild(modal);


    modal.querySelector('#close-modal').addEventListener('click', () => {
        modal.remove();
        blurred.remove();
    });


    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        const newName = modal.querySelector('#modal-name').value;
        const newCategory = modal.querySelector('#modal-category').value;
        const newPrice = modal.querySelector('#modal-price').value;
        const newImage = modal.querySelector('#modal-image').files[0];

        const index = goods.findIndex(p => p.id === product.id);
        if (index !== -1) {
            goods[index].name = newName;
            goods[index].category = newCategory;
            goods[index].price = newPrice + "$";
            goods[index].updatedAt = new Date().toISOString();

            if (newImage) {
                goods[index].img = `D:/downloads/firefox downloads/${product.id}.png`;


            }
            showSnackbar("Edited product", "added")
            renderProducts();
        }

        modal.remove();
        blurred.remove();
    });
}

function applyFiltersAndSort() {

    const category = document.getElementById('category').value;


    if (category === 'all') {
        filteredGoods = [...goods];
    } else {
        filteredGoods = goods.filter(product => product.category === category);
    }


    const sortValue = document.getElementById('sort').value;


    switch (sortValue) {
        case 'price-low-high':
            filteredGoods.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high-low':
            filteredGoods.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'create-low-low':
            filteredGoods.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'create-high-high':
            filteredGoods.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'edit-low-high':
            filteredGoods.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
            break;
        case 'edit-high-high':
            filteredGoods.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            break;
        default:
            break;
    }
    updateProductCount();
    showSnackbar('Sort and filter was applied', 'sorted');
    renderFilteredProducts(filteredGoods);
}

function getUniqueCategories() {
    const categories = goods.map(product => product.category);
    return [...new Set(categories)];
}

function updateCategoryFilter() {
    const categorySelect = document.getElementById('category');
    const uniqueCategories = getUniqueCategories();


    categorySelect.innerHTML = `<option value="all">Усі</option>`;


    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });
}

function renderFilteredProducts(productsToRender) {
    const container = document.querySelector('.products-container');
    container.innerHTML = '';

    const totalPriceElem = document.getElementById('total-price');
    totalPriceElem.classList.remove('show');
    totalPriceElem.classList.add('hide');

    if (productsToRender.length === 0) {
        return;
    }


    let total = 0;
    productsToRender.forEach(product => {
        const numPrice = parseFloat(product.price.replace(/[^\d.-]/g, ''));
        total += isNaN(numPrice) ? 0 : numPrice;

        const card = document.createElement('div');
        console.log(product.img)

        card.className = 'product-card added';
        card.innerHTML = `
            <div class="image-wrapper">
                <img class="product-img" src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="main-info">
                    <span class="product-name">${product.name}</span>
                    <span class="product-category">${product.category}</span>
                </div>
                <span class="product-price">${product.price}</span>
            </div>
            <div class="hover-menu">
                <button class="btn edit-product-button">Edit</button>
                <button class="btn delete-product-button" data-id="${product.id}">Delete</button>
            </div>
        `;
        container.appendChild(card);
        setTimeout(() => {
            card.classList.remove('added');
        }, 600);

        const deleteButton = card.querySelector('.delete-product-button');
        deleteButton.addEventListener('click', () => {

            card.classList.add('removed');
            setTimeout(() => {

                deleteProductById(product.id);
            }, 600);
        });
    });


    document.querySelectorAll('.edit-product-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.product-card').querySelector('.delete-product-button').dataset.id);
            const product = goods.find(g => g.id === id);
            if (product) {
                showEditProductModal(product);
            }
        });
    });


    totalPriceElem.textContent = `Total: ${total}$`;
    totalPriceElem.classList.remove('hide');
    totalPriceElem.classList.add('show');
    updateProductCount();

}

function clearSort() {
    document.getElementById('sort').value = 'regular';
    applyFiltersAndSort();
    showSnackbar('Sorting applied', 'sorted');
    renderFilteredProducts(filteredGoods);
}

function clearFilter() {
    document.getElementById('category').value = 'all';
    filteredGoods = [...goods];
    applyFiltersAndSort();
    showSnackbar('Filter applied', 'sorted');
    renderFilteredProducts(filteredGoods);
}

function showSnackbar(message, type) {
    const snackbar = document.getElementById("snackbar");


    snackbar.textContent = message;


    snackbar.classList.remove("show");
    snackbar.classList.add(type);


    setTimeout(() => {
        snackbar.classList.add("show");
    }, 100);


    setTimeout(() => {
        snackbar.classList.remove("show");
    }, 3000);
}

function updateProductCount() {
    const countElement = document.getElementById('product-count');
    countElement.textContent = `${filteredGoods.length}`;
}

document.addEventListener('DOMContentLoaded', () => {
    if (goods.length === 0) {
        const hint = document.getElementById('hint-text')
        hint.className = "show hint-text"
    }
})

sort.addEventListener('change', () => {
    applyFiltersAndSort();
})

category.addEventListener('change', () => {
    applyFiltersAndSort();
})

clearSortBtn.addEventListener('click', () => {
    clearSort();
})

clearFilterBtn.addEventListener('click', () => {
    clearFilter();
})

showAddProductModalBtn.addEventListener('click', () => {
    showAddProductModal();
})
