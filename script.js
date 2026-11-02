// Exercise 3 - Expense Tracker
// Write all your code in this file. Read README.md for the full instructions.
// Run the tests with: npm test

// One expense in the array looks like this:
// { id: 1, desc: "Pizza", amount: 42.5, category: "food" }

const form = document.getElementById("expense-form");
const table_rows = document.getElementById("rows");
const desc_input = document.getElementById("desc");
const amount_input = document.getElementById("amount");
const category_choose = document.getElementById("category");
const form_error_message = document.getElementById("form-error");
const no_expense_message = document.getElementById("no-rows");
const total_amount = document.getElementById("total");
const filter_category = document.getElementById("filter");
const sort_btn = document.getElementById("sort-btn");

// Step 1: add an expense on submit (unique id, no reload, validation messages, clear desc + amount, focus desc)
let expenses_arr = [];
let counter_id = 0;
let is_sorted = false; //a flag to know if the expenses are sorted
form.addEventListener("submit", (event_) => {
  event_.preventDefault(); // make it not load

  const desc = desc_input.value.trim();

  //we get the category the user chose
  const category = category_choose.value;

  const amount = Number(amount_input.value.trim());

  let expense_obj = {};

  if (desc === "") {
    form_error_message.textContent = "Please add a description";
    form_error_message.classList.add("error");
    form_error_message.hidden = false;
  } else if (amount <= 0) {
    form_error_message.textContent = "The amount must be larger than 0";
    form_error_message.classList.add("error");
    form_error_message.hidden = false;
  } else {
    counter_id += 1;
    //initializing the object
    expense_obj.id = counter_id;
    expense_obj.desc = desc;
    expense_obj.category = category;
    expense_obj.amount = amount;

    //removing the error message
    form_error_message.textContent = "";
    form_error_message.classList.remove("error");
    form_error_message.hidden = true;
    expenses_arr.push(expense_obj);

    //restarting the input fields
    desc_input.value = "";
    amount_input.value = "";
    desc_input.focus();

    if (is_sorted) {
      const sorted_arr = expenses_arr.toSorted((a, b) => {
        return b.amount - a.amount;
      });
      table_rows.innerHTML = "";
      sorted_arr.forEach((expense) => {
        createHTMLelement(expense);
      });
    } else {
      //creating the HTML elements
      createHTMLelement(expense_obj);
    }

    //removing the "no tasks yet" message
    no_expense_message.hidden = true;

    //updating the total amount
    total_amount.textContent = calcTotalAmount(expenses_arr);
  }
});

function createHTMLelement(obj) {
  const row = document.createElement("tr");

  const desc_element_row = document.createElement("td");
  desc_element_row.textContent = obj.desc;

  const cat_element_row = document.createElement("td");
  const span_cat = document.createElement("span");
  span_cat.classList.add("badge");
  span_cat.textContent = obj.category;
  cat_element_row.appendChild(span_cat);

  const amount_element_row = document.createElement("td");
  amount_element_row.textContent = obj.amount.toFixed(2);

  const delete_btn_row = document.createElement("td");
  const delete_btn = document.createElement("button");
  delete_btn.dataset.id = obj.id;
  delete_btn.textContent = "Delete";
  delete_btn.classList.add("delete");
  delete_btn_row.appendChild(delete_btn);

  row.appendChild(desc_element_row);
  row.appendChild(cat_element_row);
  row.append(amount_element_row);
  row.appendChild(delete_btn_row);

  if (Number(amount_element_row.textContent) > 100) {
    row.classList.add("big");
  }

  table_rows.appendChild(row);
}

// Step 3: delete (one listener on #rows - event delegation, by data-id)

table_rows.addEventListener("click", (event_) => {
  if (event_.target.classList.contains("delete")) {
    const row_id = Number(event_.target.dataset.id);
    const new_rows_arr = expenses_arr.filter((row) => {
      return row.id !== row_id;
    });

    expenses_arr = new_rows_arr;
    table_rows.innerHTML = "";
    expenses_arr.forEach((expense) => {
      createHTMLelement(expense);
    });

    //updating the total amount after removing the expense
    total_amount.textContent = calcTotalAmount(expenses_arr);

    if (expenses_arr.length === 0) {
      no_expense_message.hidden = false;
    } else {
      no_expense_message.hidden = true;
    }
  }
});

// Step 4: total of the expenses that are shown
function calcTotalAmount(arr) {
  let sum = 0;
  arr.forEach((expense) => {
    sum += expense.amount;
  });
  const sum_with_two_dogits = sum.toFixed(2);
  return sum_with_two_dogits;
}

// Step 5: filter by category
filter_category.addEventListener("change", () => {
  const category_selected = filter_category.value;

  if (category_selected === "all") {
    table_rows.innerHTML = "";
    expenses_arr.forEach((expense) => {
      createHTMLelement(expense);
    });
    total_amount.textContent = calcTotalAmount(expenses_arr);
  } else {
    const filtered_arr = expenses_arr.filter((expense) => {
      return expense.category === category_selected;
    });

    if (filtered_arr.length === 0) {
      no_expense_message.hidden = false;
    }

    table_rows.innerHTML = "";
    filtered_arr.forEach((expense) => {
      createHTMLelement(expense);
    });

    total_amount.textContent = calcTotalAmount(filtered_arr);
  }
});

// Step 6: sort by amount (toSorted - the original array keeps its order)
sort_btn.addEventListener("click", () => {
  const sorted_arr = expenses_arr.toSorted((a, b) => {
    return b.amount - a.amount;
  });

  is_sorted = !is_sorted;

  if (is_sorted) {
    table_rows.innerHTML = "";
    sorted_arr.forEach((expense) => {
      createHTMLelement(expense);
    });
    sort_btn.textContent = "Sort by amount: on";
  } else {
    table_rows.innerHTML = "";
    expenses_arr.forEach((expense) => {
      createHTMLelement(expense);
    });
    sort_btn.textContent = "Sort by amount: off";
  }
});

// Step 7: rows with an amount above 100 get the class "big"
