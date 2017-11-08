var mysql = require("mysql");
var inquirer = require("inquirer");

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
                  "Add New Product"]
    }
    ]).then( function(response) {

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
            break;
        }
    });
}

function lowStock(){

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", (err, results) => {

        if (err) throw err;

        console.log("Listing low inventory products...\n");
        for(var i=0; i < results.length; i++){
            console.log("ID: "+results[i].item_id);
            console.log("Product: "+results[i].product_name);
            console.log("Price: $"+results[i].price);
            console.log("Quantity: "+results[i].stock_quantity+"\n");
        }
        backToMain();
    });
}

function listProducts(){

    connection.query("SELECT * FROM products", (err, results) => {

        if (err) throw err;

        console.log("Listing all products...\n");
        for(var i=0; i < results.length; i++){
            console.log("ID: "+results[i].item_id);
    	    console.log("Product: "+results[i].product_name);
    	    console.log("Price: $"+results[i].price);
            console.log("Quantity: "+results[i].stock_quantity+"\n");
	    }
        backToMain();
    });
}

function addStock(){

    connection.query("SELECT product_name, item_id, stock_quantity FROM products", (err, results) => {

        if (err) throw err;

        var choices = [];
        for(var i=0; i < results.length; i++){
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
                return isNaN(value) === true ? false : true;
            }              
        }
        ]).then( function(response) {

            let stock = parseInt(response.item.stock);
            let id = parseInt(response.item.id);
            let units = parseInt(response.amount);
            addQuantity(id, stock, units);
        });

    });
}

function addQuantity(itemId, stock, units){

    // Calculate the reduced quantity.
    var newQuantity = stock + units;

    // Update the database.
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                     [newQuantity, itemId], (err, results) => {
        if (err) throw err;
        console.log(`Item #${itemId} inventory increased by ${units} to ${newQuantity}.`);
        backToMain();
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
            mainMenu();
        } else {
            connection.end();
        }
    });
}