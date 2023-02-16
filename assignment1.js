const getLoanButtonElement = document.getElementById("getLoan");
const bankButtonElement = document.getElementById("bank");
const workButtonElement = document.getElementById("work");
const repayLoanButtonElement = document.getElementById("repayLoan");
const buyNowButtonElement = document.getElementById("buyNow");
const outstandingLoanElement = document.getElementById("outstandingLoan");
const balanceElement = document.getElementById("balance");
const payElement = document.getElementById("pay");
const computersElement = document.getElementById("computers");
const featuresElement = document.getElementById("features");
const priceElement = document.getElementById("price");
const imageElement = document.getElementById("computerPhoto");
const nameElement = document.getElementById("name");
const descriptionElement = document.getElementById("description");
const feedbackElement = document.getElementById("buyFeedback");

let balance = 200.0;
let loan = 0.0;
let activeLoan = false;
let pay = 0.0;
let computers = [];
let activeComputer = null;

const handleGetALoan = e => {
    let loanAmount = parseFloat(prompt("Enter loan amount"));
    if (loanAmount <= balance * 2 && activeLoan == false){
        loan += loanAmount;
        balance += loanAmount;
        activeLoan = true;
        outstandingLoanElement.classList.toggle("loan");
        repayLoanButtonElement.style.display = "block";
        outstandingLoanElement.innerHTML = `Outstanding loan ${loan.toFixed(2)} kr`;
        balanceElement.innerHTML = `Balance ${balance.toFixed(2)} kr`;
    }
}

const handleBank = e => {
    if (!activeLoan) balance += pay;
    else {
        payLoan(pay * 0.1);
    }  
    updateNumbers();
}

const handleWork = e => {
    pay += 100;
    payElement.innerHTML = `Pay ${pay.toFixed(2)} kr`;
}

const handleRepayLoan = e => {
    payLoan(pay);
    updateNumbers();
}

function updateNumbers(){
    balanceElement.innerHTML = `Balance ${balance.toFixed(2)} kr`;
    outstandingLoanElement.innerHTML = `Outstanding loan ${loan.toFixed(2)} kr`;
    pay = 0.0;
    payElement.innerHTML = `Pay ${pay.toFixed(2)} kr`;
}

function payLoan(payNumber){
    let toPayLoan = 0.0;
        if (loan <= payNumber){
            toPayLoan = loan;
            loan = 0.0;
            activeLoan = false;
            outstandingLoanElement.classList.toggle("loan");
            repayLoanButtonElement.style.display = "none";
        } else {
            toPayLoan = payNumber;
            loan -= payNumber;
        }
        balance += pay - toPayLoan;
}

getLoanButtonElement.addEventListener("click", handleGetALoan);
bankButtonElement.addEventListener("click", handleBank);
workButtonElement.addEventListener("click", handleWork);
repayLoanButtonElement.addEventListener("click", handleRepayLoan);

fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputers(computers));

const addComputers = (computers) => {
    computers.forEach(x => addComputer(x));
    const startComputer = computers[0];
    showComputer(startComputer);
}

const addComputer = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
}

const handleComputerChange = e => {
    const selectedComputer = computers[e.target.selectedIndex];
    showComputer(selectedComputer);
}

function showComputer(selected){
    priceElement.innerText = `${selected.price} NOK`;
    featuresElement.innerText = "";
    nameElement.innerText = selected.title;
    descriptionElement.innerText = selected.description;
    if (selected.id == 5) imageElement.src = "https://hickory-quilled-actress.glitch.me/assets/images/5.png"
    else imageElement.src = `https://hickory-quilled-actress.glitch.me/${selected.image}`;  
    imageElement.alt = selected.title;
    for (let i = 0; i < selected.specs.length; i++){
        featuresElement.innerText += `${selected.specs[i]}`;
        featuresElement.innerText += "\n";
    }
    feedbackElement.innerText = "";
    activeComputer = selected;
}

const handleBuyNow = e => {
    if (balance >= activeComputer.price){
        feedbackElement.innerText = "Your purchase was successful!"
        balance -= activeComputer.price;
        balanceElement.innerHTML = `Balance ${balance.toFixed(2)} kr`;
    } else {
        feedbackElement.innerText = "Purchase cannot be completed."
    }
}

computersElement.addEventListener("change", handleComputerChange);
buyNowButtonElement.addEventListener("click", handleBuyNow);