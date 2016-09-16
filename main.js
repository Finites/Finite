var table = document.getElementById("finite-differences");
var rows = 8;
var exponent = 6;

function cloneRow() {
   var row = document.getElementById("row"); // find row to copy
   var table = document.getElementById("finite-differences"); // find table to append to
   var clone = row.cloneNode(true); // copy children too
   table.childNodes[1].appendChild(clone); // add new row to end of table
}

function generateRows() {
   var rowCount = 0;
   while (rowCount != (rows- 1)) {
      cloneRow();
      rowCount += 1;
   }
}

function reloadRowData() {
   var data = generateDataSet("Y-Input");
   updateTable(data);
}

function generateDataSet(className) {
   var dataSet = [];
   var yColumn = document.getElementsByClassName(className);
   for (var i=0; i<yColumn.length; i++) {
      var yInput = yColumn[i];
      var num = parseInt(yInput.value);
      if (isNaN(num) == false) {
         dataSet.push(num);
      }
   }
   return dataSet;
}

function loadMathFunction() {
   var mathFunction = document.getElementById("math-function-input").value;
   var XData = generateDataSet("X-Input");
   var YData = [];

   for (var i = 0, row; row = table.rows[i]; i++) {
      if (row.id != "row") { continue }
      for (var j = 0, col; col = row.cells[j]; j++) {
         var input = col.childNodes[0];
         if (j == 0) {
            var h = mathFunction.split('x').join("(" + (i - 5) + ")");
            YData.push(math.eval(h));
            input.value = i - 5;
         } else if (j == 1) {
            input.value = YData[i - 1];
         }
      }
   }

   updateTable(YData);
   console.log(YData);
}

function updateTable(dataSet) {
   for (var i = 0, row; row = table.rows[i]; i++) {
      if (row.id != "row") { continue }
      for (var j = 0, col; col = row.cells[j]; j++) {
         if (j == 0 || j == 1) { continue }
         var data = findDiference(j, JSON.parse(JSON.stringify(dataSet)));
         if (data[i - 1] != undefined) {
            col.innerHTML = data[i - 1];
         }
      }
   }
}


function findDiference(exponent, data) {
   var localExponent = 1;
   var localData = data;
   while (exponent != localExponent) {
      for (var i=0; i<localData.length;i++) {
         if (i != (localData.length - 1)) {
            var firstNumber = localData[i];
            var secondNumber = localData[i + 1];
            if (firstNumber == null || secondNumber == null) { continue }
            var difference = secondNumber - firstNumber;
            localData.splice(i, 1, difference);
         } else {
            localData.pop();
            break;
         }
      }
      localExponent += 1;
   }
   return localData
}

generateRows();

document.getElementById("reset-btn").onclick = function() {
   for (var i = 0, row; row = table.rows[i]; i++) {
      if (row.id != "row") { continue }
      for (var j = 0, col; col = row.cells[j]; j++) {
         if (j == 0 || j == 1) {
            var input = col.childNodes[0];
            input.value = ""
         } else {
            col.innerHTML = ""
         }
      }
   }
}
