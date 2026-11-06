const form = document.querySelector("#expense-form");
const titleInput = document.querySelector("#title");
const amountInput = document.querySelector("#amount");
const dateInput = document.querySelector("#date");
const list = document.querySelector("#expense-list");
const totalLabel = document.querySelector("#total");
const countLabel = document.querySelector("#count");
const emptyMessage = document.querySelector("#empty-message");

let expenses = JSON.parse(localStorage.getItem("my-expenses") || "[]");
dateInput.valueAsDate = new Date();

function saveExpenses() {
  localStorage.setItem("my-expenses", JSON.stringify(expenses));
}

function showExpenses() {
  list.replaceChildren();

  expenses.forEach((expense) => {
    const item = document.createElement("li");
    item.className = "expense-item";

    const details = document.createElement("div");
    const name = document.createElement("div");
    name.className = "expense-name";
    name.textContent = expense.title;
    const date = document.createElement("div");
    date.className = "expense-date";
    date.textContent = new Date(`${expense.date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
    details.append(name, date);

    const right = document.createElement("div");
    right.className = "expense-right";
    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = `₹${Number(expense.amount).toLocaleString("en-IN")}`;
    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${expense.title}`);
    remove.addEventListener("click", () => {
      expenses = expenses.filter((entry) => entry.id !== expense.id);
      saveExpenses();
      showExpenses();
    });
    right.append(amount, remove);
    item.append(details, right);
    list.append(item);
  });

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  totalLabel.textContent = `₹${total.toLocaleString("en-IN")}`;
  countLabel.textContent = `${expenses.length} ${expenses.length === 1 ? "item" : "items"}`;
  emptyMessage.hidden = expenses.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  expenses.unshift({
    id: Date.now(),
    title: titleInput.value.trim(),
    amount: Number(amountInput.value),
    date: dateInput.value
  });
  saveExpenses();
  showExpenses();
  form.reset();
  dateInput.valueAsDate = new Date();
  titleInput.focus();
});

showExpenses();
