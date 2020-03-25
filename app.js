//BUDGET CONTROLLER

var budgetController = (function() {
  var Expense = function(id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  var Income = function(id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      income: 0,
      expense: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, description, value) {
      var newItem, id;
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }
      if (type === "income") {
        newItem = new Income(id, description, value);
      } else if (type == "expense") {
        newItem = new Expense(id, description, value);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    calculateBudget: function() {
      //calculate the total income & expense
      calculateTotal("income");
      calculateTotal("expense");

      //calculate Budget : income - expenses
      data.budget = data.totals.income - data.totals.expense;

      // calculate percentage of the income spent
      if (data.totals.income > 0) {
        data.percentage = Math.round(
          (data.totals.expense / data.totals.income) * 100
        );
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense
      };
    },
    deleteItem: function(id, type) {
      var ids, index;
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    test: function() {
      return data;
    }
  };
})();

//UICONTROLLER
var UIController = (function() {
  var domStrings = {
    inputType: "budgetType", //idName
    inputDescription: "description", //idName
    inputValue: "price", //idName
    addButton: ".clickButton", //className
    incomeBox: ".showIncome", //className
    expenseBox: ".showExpense", //className
    budgetBox: "budget", //idName
    incomeBox: "incomeAmount", //idName
    expenseBox: "expenseAmount", //idName
    percentageBox: "expensePer", //idName
    bottom: ".bottom",
    budgetMonth: "budgetMonth"
  };
  return {
    getInput: function() {
      return {
        type: document.getElementById(domStrings.inputType).value,
        description: document.getElementById(domStrings.inputDescription).value,
        value: parseFloat(document.getElementById(domStrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var ul,
        li,
        listContainer,
        elementDesc,
        pDescription,
        elementValue,
        pValue,
        btnDelete,
        completeNode,
        button,
        listId,
        bottom;
      listId = type + "-" + obj.id;
      // ul = document.getElementById(type);
      // li = document.createElement("LI"); // adds li to ul

      bottom = document.getElementById(type);
      listContainer = document.createElement("div"); //add listContainer DIV
      elementDesc = document.createElement("div"); //adds elementDescription DIV
      pDescription = document.createElement("p"); //adds paragraph tp elementDescription
      pDescription.innerHTML = obj.description;
      elementValue = document.createElement("div");
      pValue = document.createElement("p");
      pValue.innerHTML = obj.value;
      btnDelete = document.createElement("div");
      button = document.createElement("button");
      button.innerHTML = "-";

      btnDelete.appendChild(button); //button in Delete Btn Div

      elementValue.appendChild(pValue); //p value in elementValue

      elementDesc.appendChild(pDescription); //Element Description

      btnDelete.setAttribute("class", "delete");
      elementValue.setAttribute("class", "elementValue");
      elementDesc.setAttribute("class", "elementDesc");
      listContainer.setAttribute("class", "listContainer");

      listContainer.appendChild(elementDesc);
      listContainer.appendChild(elementValue);
      listContainer.appendChild(btnDelete);

      // li.appendChild(listContainer);     //creating a List
      // li.setAttribute("id", listId);     //setting id to list
      listContainer.setAttribute("id", listId);
      // ul.appendChild(li);                appending the list to the UL
      // ul.appendChild(listContainer);
      bottom.appendChild(listContainer);
    },

    deleteListItem: function(type, id) {
      var typeDiv = document.getElementById(type); //get the div whose child to be deleted
      var deleteElement = document.getElementById(id); //get the child which need to be deleted
      typeDiv.removeChild(deleteElement); //deletes the child from the parent
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        "#" + domStrings.inputDescription + "," + "#" + domStrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    displayDate: function() {
      var now, month, year, currentDate;
      var months = [];
      now = new Date();
      currentMonth = now.getMonth();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "November",
        "December"
      ];

      year = now.getFullYear();

      currentDate = now.getDate();
      document.getElementById(domStrings.budgetMonth).textContent =
        currentDate + " " + months[currentMonth] + " " + year;
    },

    getDOMStrings: function() {
      return domStrings;
    },

    displayBudget: function(obj) {
      document.getElementById(domStrings.budgetBox).textContent = obj.budget;
      document.getElementById(domStrings.incomeBox).textContent =
        obj.totalIncome;
      document.getElementById(domStrings.expenseBox).textContent =
        obj.totalExpense;
      if (obj.percentage > 0) {
        document.getElementById(domStrings.percentageBox).textContent =
          obj.percentage + "%";
      } else {
        document.getElementById(domStrings.percentageBox).textContent = "---";
      }
    }
  };
})();

//GLOBAL APP CONTROLLER
var appController = (function(budgetCtrl, uiCtrl) {
  uiCtrl.displayDate();
  var setupEventListeners = function() {
    var DOM = uiCtrl.getDOMStrings();

    document
      .querySelector(DOM.addButton)
      .addEventListener("click", ctrlAddItems);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItems();
      }
    });

    document
      .querySelector(DOM.bottom)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. Calculate budget
    budgetCtrl.calculateBudget();
    // 2. Return the Budget
    var budget = budgetCtrl.getBudget();
    // 3. Display the Budget on UI
    uiCtrl.displayBudget(budget);

    // console.log(budget);
  };

  var ctrlAddItems = function() {
    var input, newItem;
    //1. Get the field input data
    input = uiCtrl.getInput();

    if (input.description != "" && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget Controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //3. Add the Item to the UI
      uiCtrl.addListItem(newItem, input.type);
      // Clear All fields of UI
      uiCtrl.clearFields();
      // 4. Call the update budge method
      updateBudget();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemId, splitId, type, ID;
    // console.log(event.target.tagName.contains('button'));
    if (event.target.matches("button")) {
      itemId = event.target.parentNode.parentNode.id;
      splitId = itemId.split("-");
      type = splitId[0];
      ID = parseInt(splitId[1]);
      // console.log(type, ID);

      // 1. delete the item from data Structure
      budgetCtrl.deleteItem(ID, type);
      // 2. delete from user interface
      uiCtrl.deleteListItem(type, itemId);
      // 3. update and show new budget
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log("Application Started");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();
