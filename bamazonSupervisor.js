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
        choices: ["View Product Sales by Department",
                  "Create New Department",
                  "Exit"]
    }
    ]).then( function(response) {

        switch (response.choice) {
          case "View Product Sales by Department":
            viewDeptSales();
            break;
          case "Create New Department":
            lowStock();
            break;
          case "Exit":
            connection.end();
        }
    });
}

function viewDeptSales(){

	connection.query(`SELECT d.department_id, d.department_name,
       				  d.over_head_costs, SUM(p.product_sales) AS product_sales,
                      SUM(p.product_sales) - d.over_head_costs AS total_profit
                      FROM products p
					  JOIN departments d ON p.department_name = d.department_name
				  	  GROUP BY d.department_id`, (err, results) => {

        if (err) throw err;

	    let header = ["department_id", "department_name",
	    			  "over_head_costs", "product_sales",
	    			  "total_profit"];
		let data = [header];

		data.push([results[0].department_id,
				   results[0].department_name,
	               results[0].over_head_costs,
		           results[0].product_sales,
		           results[0].total_profit]);

		let output = table(data); 
		console.log(output);
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