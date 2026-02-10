-- Insertion d'utilisateurs de test
-- Mot de passe pour tous: "Password123"
-- Hash bcrypt de "Password123" avec cost 10
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@shopexpress.com', '$2b$10$rZ5YhqL9YX9YhqL9YX9YhO9YhqL9YX9YhqL9YX9YhqL9YX9YhqL9Y', 'Admin', 'User', 'admin'),
('john.doe@example.com', '$2b$10$rZ5YhqL9YX9YhqL9YX9YhO9YhqL9YX9YhqL9YX9YhqL9YX9YhqL9Y', 'John', 'Doe', 'client'),
('jane.smith@example.com', '$2b$10$rZ5YhqL9YX9YhqL9YX9YhO9YhqL9YX9YhqL9YX9YhqL9YX9YhqL9Y', 'Jane', 'Smith', 'client'),
('bob.wilson@example.com', '$2b$10$rZ5YhqL9YX9YhqL9YX9YhO9YhqL9YX9YhqL9YX9YhqL9YX9YhqL9Y', 'Bob', 'Wilson', 'client');

-- Insertion de produits
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Laptop Pro 15"', 'Powerful laptop for professionals', 1299.99, 15, 'Electronics', '/images/laptop-pro.jpg'),
('Smartphone X', 'Latest generation smartphone', 899.99, 30, 'Electronics', '/images/smartphone-x.jpg'),
('Wireless Headphones', 'Premium noise-cancelling headphones', 249.99, 50, 'Electronics', '/images/headphones.jpg'),
('4K Monitor 27"', 'Ultra HD display for work and gaming', 449.99, 20, 'Electronics', '/images/monitor-4k.jpg'),
('Mechanical Keyboard', 'RGB gaming keyboard', 129.99, 40, 'Accessories', '/images/keyboard.jpg'),
('Ergonomic Mouse', 'Wireless ergonomic mouse', 59.99, 60, 'Accessories', '/images/mouse.jpg'),
('USB-C Hub', '7-in-1 USB-C adapter', 79.99, 100, 'Accessories', '/images/usb-hub.jpg'),
('Laptop Backpack', 'Water-resistant laptop backpack', 89.99, 35, 'Accessories', '/images/backpack.jpg'),
('Desk Lamp LED', 'Adjustable LED desk lamp', 49.99, 45, 'Office', '/images/desk-lamp.jpg'),
('Office Chair Pro', 'Ergonomic office chair', 399.99, 12, 'Office', '/images/office-chair.jpg'),
('Standing Desk', 'Electric height-adjustable desk', 599.99, 8, 'Office', '/images/standing-desk.jpg'),
('Webcam HD', '1080p webcam with microphone', 79.99, 55, 'Electronics', '/images/webcam.jpg'),
('External SSD 1TB', 'Portable solid state drive', 149.99, 70, 'Storage', '/images/ssd-1tb.jpg'),
('Power Bank 20000mAh', 'High-capacity portable charger', 39.99, 80, 'Accessories', '/images/power-bank.jpg'),
('Phone Case Premium', 'Protective phone case', 29.99, 120, 'Accessories', '/images/phone-case.jpg');

-- CrÃ©ation de paniers pour les utilisateurs
INSERT INTO carts (user_id) VALUES
(2), -- John Doe
(3), -- Jane Smith
(4); -- Bob Wilson

-- Ajout d'items dans le panier de John Doe
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 1), -- Laptop Pro
(1, 3, 1), -- Wireless Headphones
(1, 5, 1); -- Mechanical Keyboard

-- Ajout d'items dans le panier de Jane Smith
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(2, 2, 1), -- Smartphone X
(2, 14, 2); -- Power Bank

-- CrÃ©ation de commandes de test
INSERT INTO orders (user_id, total_amount, status, shipping_address, stripe_payment_id) VALUES
(2, 1679.97, 'delivered', '123 Main St, Paris 75001, France', 'pi_test_123456'),
(3, 979.98, 'shipped', '456 Oak Ave, Lyon 69001, France', 'pi_test_789012'),
(4, 699.98, 'pending', '789 Elm St, Marseille 13001, France', NULL);

-- Items de la premiÃ¨re commande (John Doe)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1299.99),
(1, 3, 1, 249.99),
(1, 5, 1, 129.99);

-- Items de la deuxiÃ¨me commande (Jane Smith)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(2, 2, 1, 899.99),
(2, 14, 2, 39.99);

-- Items de la troisiÃ¨me commande (Bob Wilson)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(3, 11, 1, 599.99),
(3, 9, 2, 49.99);
