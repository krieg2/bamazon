var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  listProducts();
});

function listProducts() {

  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    console.log("Listing all products...\n");
    for(var i=0; i < results.length; i++){
    	console.log("ID: "+results[i].item_id);
    	console.log("Product: "+results[i].product_name);
    	console.log("Price: $"+results[i].price+"\n");
	}
    connection.end();
  });
}
