let products = JSON.parse(localStorage.getItem("products")) || [];

const form = document.getElementById("productForm");
const table = document.getElementById("productTable");
const searchInput = document.getElementById("search");

let editId = null;

// Add / Update Product
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const price = parseFloat(document.getElementById("price").value);

    if (!name || quantity <= 0 || price <= 0) {
        alert("Please enter valid data!");
        return;
    }

    if (editId) {
        // Update
        products = products.map(p => 
            p.id === editId ? { ...p, name, quantity, price } : p
        );
        editId = null;
        form.querySelector("button").innerText = "Add Product";
    } else {
        // Add
        const product = {
            id: Date.now(),
            name,
            quantity,
            price
        };
        products.push(product);
    }

    saveAndRender();
    form.reset();
});

// Display
function displayProducts(filtered = products) {
    table.innerHTML = "";

    if (filtered.length === 0) {
        table.innerHTML = `<tr><td colspan="6">No products found</td></tr>`;
        return;
    }

    filtered.forEach((p, index) => {
        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${p.name}</td>
                <td>${p.quantity}</td>
                <td>₹${p.price}</td>
                <td>₹${p.quantity * p.price}</td>
                <td>
                    <button class="edit-btn" onclick="editProduct(${p.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Delete
function deleteProduct(id) {
    if (confirm("Are you sure?")) {
        products = products.filter(p => p.id !== id);
        saveAndRender();
    }
}

// Edit
function editProduct(id) {
    const p = products.find(p => p.id === id);

    document.getElementById("name").value = p.name;
    document.getElementById("quantity").value = p.quantity;
    document.getElementById("price").value = p.price;

    editId = id;
    form.querySelector("button").innerText = "Update Product";
}

// Search
searchInput.addEventListener("input", function() {
    const value = this.value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(value)
    );
    displayProducts(filtered);
});

// Save + Render
function saveAndRender() {
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

// Initial Load
displayProducts();