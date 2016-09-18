//**** Properties ****//
// Table containing x, y and all the exponential columns
var table = document.getElementById("finite-differences");
// Amount of rows in tabe not including the header row
var rows = 8;
// The max exponent the table supports.
// Note: Adjusting this will not generate a column containing a new exponent, but instead this should match the amount of exponent columns in HTML.
var exponent = 6;

//**** Methods ****//
/*
* Clones a row from a table and appends it to the table.
* @param table: ID for the table
* @param row: ID for the row to be cloned
*/
function cloneRow(table, row) {
   var row = document.getElementById(row); // find row to copy
   var table = document.getElementById(table); // find table to append to
   var clone = row.cloneNode(true); // copy children too
   table.childNodes[1].appendChild(clone); // add new row to end of table
}

/*
* Generates the rows in a table according to the script properties
*/
function generateRows() {
   var rowCount = 0; // Local count of the amount rows already added
   // Loops until the local count matches the expected rows.
   while (rowCount != (rows - 1)) {
      cloneRow("finite-differences", "row"); // Clones a new row
      rowCount += 1;
   }
}

/*
* Reloads the data inside the table to reflect the newly inputted values.
*/
function reloadRowData() {
   // Gathers an array of all the Y values from the Y column of the table
   var data = generateDataSetFrom("Y-Input");
   // Updates the exponent rows
   updateExponentTable(data);
}

/*
* Generates an array of all the values from inputs with the matching class name.
  Note: used for inputs containing integer values.
* @param className: Name of a class that is used to style input nodes
* @return: An array of ints from all the input matching the class name
*/
function generateDataSetFrom(className) {
   var dataSet = []; // Empty data set
   var column = document.getElementsByClassName(className); // Finds all the nodes with that class name
   for (var i=0; i<column.length; i++) { // Loops over all the nodes
      var input = column[i]; // Selects an input
      var num = parseInt(input.value); // Parses the input text to an int
      if (isNaN(num) == false) { // ensures that num isn't NaN
         dataSet.push(num); // Pushes the number into the array
      }
   }
   return dataSet;
}

/*
* Processes the math function inputed into the function input.
*/
function loadMathFunction() {
   // Math function inputed by user (type string)
   var mathFunction = document.getElementById("math-function-input").value;
   // An array containing all the X coordinates in the X column.
   var XData = generateDataSetFrom("X-Input");
   // An array containing all the Y coordinates that will be in the Y column.
   var YData = [];
   // Loop through all the rows in a table
   for (var i = 0, row; row = table.rows[i]; i++) {
      // Ensures that only the rows if the "row" id is evaluted
      if (row.id != "row") { continue }
      // Loops througj all the cells in a row
      for (var j = 0, col; col = row.cells[j]; j++) {
         var input = col.childNodes[0]; // Selects the input node from the cell
         // Checks if the current cell is from the X column
         if (j == 0) {
            // Reasoning for the minus 5: Creates a more dynamic data set when evaluting the Y values.
            var x = i - 5;
            // Checks to see if the user entered any X data themselves
            if (XData.length != 0) {
               // Assigns the user entered X data to X
               x = XData[i - 1];
               if (x == undefined) { // Ensures it exists
                  continue
               }
            }
            // Replaces all the x variables with X values.
            var yAnswer = mathFunction.split('x').join("(" + x + ")");
            // Evaluates the expression and pushes the Y data into the array
            YData.push(math.eval(yAnswer));
            // Displays the X value used to create the Y answer in the input
            input.value = x;
         } else if (j == 1) { // Checks if the current cell is from the Y column
            if (YData[i - 1] != undefined) { // Ensures that the Y data exists for that index
               input.value = YData[i - 1]; // Updates the Y column
            }
         }
      }
   }
   // Updates the exponent table with the newly adjusted Y data set.
   updateExponentTable(YData);
}

/*
* Updates the exponent table with the new data set.
* @param dataSet: Array of Ints containing the new Y data set
*/
function updateExponentTable(dataSet) {
   for (var i = 0, row; row = table.rows[i]; i++) { // Loops through all the rows in the table
      // Ensures that only the rows if the "row" id is evaluted
      if (row.id != "row") { continue }
      for (var j = 0, col; col = row.cells[j]; j++) { // Loops through all the cells in the row
         // Ensures that only the rows after the X (index 0) and the Y (index 1) column are evaluated.
         if (j == 0 || j == 1) { continue }
         // Finds the differences between a data set. Reasoning for conversion to JSON and back:
         // Function parameters are reference types in Javascript and the "findDifference" function mutates
         // the array that is passed in, so to pass a copy you need to convert to JSON and back 🙃
         var data = findDiference(j, JSON.parse(JSON.stringify(dataSet)));
         // Ensures that a value is found from the index
         if (data[i - 1] != undefined) {
            col.innerHTML = data[i - 1];
         }
      }
   }
}

/*
* Finds the finite differences from a data set for a certain degree of exponent.
* @param exponent: The degree of exponent to be found
* @param data: The data set to find the differences from
* @return: Array with the requested amount of exponent differences
* Example:
findDifference(2, [2, 4, 6, 8, 10]) // -> [2, 2, 2, 2]
findDifference(3, [-64, -27, -8, -1, 0, 1, 8, 27]) // -> [6, 6, 6, 6, 6]
*/
function findDiference(exponent, data) {
   // The amount of times the while loop has ran
   var localExponent = 1;
   // The data to be mutuated
   var localData = data;

   while (exponent != localExponent) { // Loops until the local exponent is equal to the request exponent difference
      for (var i=0; i<localData.length;i++) { // Loops through all the local data
         if (i != (localData.length - 1)) { // Ensures that it isn't the last element in the array being looped
            var firstNumber = localData[i]; // Number from the array
            var secondNumber = localData[i + 1]; // The following number in the array
            if (firstNumber == null || secondNumber == null) { continue } // Ensures that they both aren't nil
            var difference = secondNumber - firstNumber; // Calculates the difference between both arrays
            localData.splice(i, 1, difference); // Replaces the previous number with the newly calculated difference
         } else { // Last element
            localData.pop(); // Removes the last element from the array
            break;
         }
      }
      localExponent += 1; // Increases the local exponent.
   }
   return localData
}

// Clones and adds the rows
generateRows();

/*
* Resets the entire table to it's original state.
*/
document.getElementById("reset-btn").onclick = function() {
   for (var i = 0, row; row = table.rows[i]; i++) { // Loops through all the rows in the table
      // Ensures that only the rows if the "row" id is evaluted
      if (row.id != "row") { continue }
      for (var j = 0, col; col = row.cells[j]; j++) { // Loops through all the cells in the table
         if (j == 0 || j == 1) { // If it's X or Y column: reset only the input
            var input = col.childNodes[0];
            input.value = ""
         } else { // Any other cell: just completely clear all the child nodes.
            col.innerHTML = ""
         }
      }
   }
}
