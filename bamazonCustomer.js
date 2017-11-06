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

	inquirer.prompt([
    {
        type: "input",
        name: "itemId",
        message: "Which product ID would you like to buy?"
    },
    {
        type: "input",
        name: "units",
        message: "How many would you like to buy?"
    }
	]).then(function(response) {

        if(isNaN(response.itemId) === false &&
           isNaN(response.units) === false){

        	checkInventory(response.itemId, response.units);
        }
	});
}

function checkInventory(itemId, units){

    connection.query("SELECT stock_quantity FROM products WHERE ?",
    	             {item_id: itemId}, (err, results) => {

        if (err) throw err;

    	if(results !== undefined){
    		let stock = results[0].stock_quantity;
    		
    		if(parseInt(stock) < parseInt(units)){
    			console.log("Insufficient quantity!");
    		} else{
    			console.log("OK!");
    		}
    		connection.end();
		}
    });	
}