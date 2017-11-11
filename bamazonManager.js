const mysql = require("mysql");
const inquirer = require("inquirer");
const {table} = require("table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect( (err) => {

    if (err) throw err;

    mainMenu();
});

function mainMenu(){

    inquirer.prompt([
    {
        type: "list",
        name: "choice",
        message: "Choose an option:",
        choices: ["View Products for Sale",
                  "View Low Inventory",
                  "Add to Inventory",
                  "Add New Product",
                  "Exit"]
    }
    ]).then( function(response) {

        // These are the main menu choices
        // and their corresponsing function calls.
        switch (response.choice) {
          case "View Products for Sale":
            listProducts();
            break;
          case "View Low Inventory":
            lowStock();
            break;
          case "Add to Inventory":
            addStock();
            break;
          case "Add New Product":
            addProduct();
            break;
          case "Exit":
            connection.end();
        }
    });
}

function lowStock(){

    // Finds all products with a quantity less than 5.
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", (err, results) => {

        if (err) throw err;

        // Create the column headers for the table.
        let header = ["item_id", "product_name", "price", "stock_quantity"];
        let data = [header];

        // Push each product result into the data array.
        for(var i=0; i < results.length; i++){
            data.push([results[i].item_id,
                       results[i].product_name,
                       results[i].price,
                       results[i].stock_quantity]);
        }

        // Display the results.
        let output = table(data); 
        console.log(output);

        // Then prompt to return back to the main menu.
        backToMain();
    });
}

function listProducts(){

    // List all products in the database.
    connection.query("SELECT * FROM products", (err, results) => {

        if (err) throw err;

        // Create the column headers for the table.
        let header = ["item_id", "product_name", "price", "stock_quantity"];
        let data = [header];

        // Push each product result into the data array.
        for(var i=0; i < results.length; i++){
            data.push([results[i].item_id,
                       results[i].product_name,
                       results[i].price,
                       results[i].stock_quantity]);
        }

        // Display the results.
        let output = table(data); 
        console.log(output);

        backToMain();
    });
}

function addStock(){

    // First query the products to generate a list of choices.
    connection.query("SELECT product_name, item_id, stock_quantity FROM products", (err, results) => {

        if (err) throw err;

        var choices = [];
        for(var i=0; i < results.length; i++){
            // Store the choices in an array for inquirer.
            choices.push({name: results[i].product_name,
                          value: {id: results[i].item_id,
                                  stock: results[i].stock_quantity}});
        }

        inquirer.prompt([
        {
            type: "list",
            name: "item",
            message: "Select a product:",
            choices: choices
        },
        {
            type: "input",
            name: "amount",
            message: "How many would you like to add?",
            validate: function(value) {
                return isNaN(value) === true || value < 1 ? false : true;
            }              
        }
        ]).then( function(response) {

            let stock = parseInt(response.item.stock);
            let id = parseInt(response.item.id);
            let units = parseInt(response.amount);
            // Proceed to update the database...
            addQuantity(id, stock, units);
        });

    });
}

function addQuantity(itemId, stock, units){

    // Calculate the new quantity.
    var newQuantity = stock + units;

    // Update the database.
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                     [newQuantity, itemId], (err, results) => {

        if (err) throw err;

        console.log(`Item #${itemId} inventory increased by ${units} to ${newQuantity}.`);

        backToMain();
    });
}

function addProduct(){

    // Gather the product information from the user.
    inquirer.prompt([
    {
        type: "input",
        name: "prodName",
        message: "Product name:",
        validate: function(value) {
            if(value.length > 0 && value.length <= 100){
                return true;
            } else {
                return false;
            }
        }
    },
    {
        type: "input",
        name: "deptName",
        message: "Department name:",
        validate: function(value) {
            if(value.length > 0 && value.length <= 50){
                return true;
            } else {
                return false;
            }
        }              
    },
    {
        type: "input",
        name: "price",
        message: "Price:",
        validate: function(value) {
            return isNaN(value) === true || value <= 0 ? false : true;
        }              
    },
    {
        type: "input",
        name: "stockQty",
        message: "Inventory quantity:",
        validate: function(value) {
            return isNaN(value) === true ? false : true;
        }              
    }
    ]).then( function(response) {

        let values = {product_name: response.prodName,
                      department_name: response.deptName,
                      price: parseInt(response.price),
                      stock_quantity: parseInt(response.stockQty)};

        // Update the database.
        connection.query("INSERT INTO products SET ?",
                         values, (err, results) => {

            if (err) throw err;

            console.log("Product has been added.");
            backToMain();
        });
    });

}

function backToMain(){

    inquirer.prompt([
    {
        type: "confirm",
        name: "yesNo",
        message: "Would you like to return to the main menu?"
    }
    ]).then( function(response) {

        if(response.yesNo){

            // Display the main menu.
            mainMenu();
        } else {

            // End the connection.
            connection.end();
        }
    });
}