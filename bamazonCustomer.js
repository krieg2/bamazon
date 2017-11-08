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
    listProducts();
});

function listProducts(){

    connection.query("SELECT * FROM products", (err, results) => {

        if (err) throw err;

        console.log("Listing all products...\n");
        for(var i=0; i < results.length; i++){
            console.log("ID: "+results[i].item_id);
    	      console.log("Product: "+results[i].product_name);
    	      console.log("Price: $"+results[i].price+"\n");
	      }
    
        buyPrompt();
    });
}

function buyPrompt(){

    // Gather the product ID number and quantity/units
    // requested from the user.
    inquirer.prompt([
    {
        type: "input",
        name: "itemId",
        message: "Which product ID would you like to buy?",
        validate: function(value) {
            return isNaN(value) === true ? false : true;
        }
    },
    {
        type: "input",
        name: "units",
        message: "How many would you like to buy?",
        validate: function(value) {
            return isNaN(value) === true ? false : true;
        }        
    }
	  ]).then( function(response) {

        checkInventory(parseInt(response.itemId), parseInt(response.units));
	  });
}

function checkInventory(itemId, units){

    connection.query("SELECT stock_quantity, price FROM products WHERE ?",
    	             {item_id: itemId}, (err, results) => {

        if (err) throw err;

      	if(results !== undefined){

      		let stock = results[0].stock_quantity;
          let price = results[0].price;

    		  // Compare existing stock to requested unit amount.
      		if(stock < units){

      			console.log("Insufficient quantity!");

            continueShopping();
      		} else{

            // Update the database and reduce the quantity.
            reduceQuantity(itemId, stock, units, price);
      		}
		  }
    });
}

function reduceQuantity(itemId, stock, units, price){

    // Calculate the reduced quantity.
    var newQuantity = stock - units;
    // Calculate the user's cost for this transaction.
    var cost = units * price;


    // Update the database.
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                     [newQuantity, itemId], (err, results) => {

        if (err) throw err;
        console.log("Your total cost is: $" + cost + "\n");

        continueShopping();
    });
}


function continueShopping(){

    inquirer.prompt([
    {
        type: "confirm",
        name: "yesNo",
        message: "Would you like to buy another item?"
    }
    ]).then( function(response) {

        if(response.yesNo){
            listProducts();
        } else {
            connection.end();
        }
    });
}