DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10,2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products
VALUES (1, 'iPhone X', 'electronics', 999.00, 0);

INSERT INTO products
VALUES (2, 'iPhone 8', 'electronics', 699.00, 50);

INSERT INTO products
VALUES (3, 'iPhone 8 Plus', 'electronics', 799.00, 60);

INSERT INTO products
VALUES (4, 'iPhone 7', 'electronics', 549.00, 50);

INSERT INTO products
VALUES (5, 'iPhone 7 Plus', 'electronics', 669.00, 60);

INSERT INTO products
VALUES (6, 'iPhone 6s', 'electronics', 449.00, 40);

INSERT INTO products
VALUES (7, 'iPhone 6s Plus', 'electronics', 549.00, 30);

INSERT INTO products
VALUES (8, 'iPhone 6', 'electronics', 399.00, 45);

INSERT INTO products
VALUES (9, 'iPhone SE', 'electronics', 349.00, 20);

INSERT INTO products
VALUES (10, 'iPhone 5', 'electronics', 125.00, 10);

INSERT INTO products
VALUES (11, 'iPhone 5c', 'electronics', 160.00, 10);

INSERT INTO products
VALUES (12, 'iPhone 5s', 'electronics', 180.00, 10);