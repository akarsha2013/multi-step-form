// ===== DOM ELEMENTS =====

const steps = document.querySelectorAll(".form-step");

const sidebarSteps = document.querySelectorAll(".step");

const nextBtn = document.getElementById("next-button");

const step2NextBtn = document.getElementById("next-button-step2");

const step3NextBtn = document.getElementById("next-button-step3");

const backBtn2 = document.getElementById("back-button-step2");

const backBtn3 = document.getElementById("back-button-step3");

const backBtn4 = document.getElementById("back-button-step4");

const confirmBtn = document.getElementById("confirm-button");

const changePlan = document.getElementById("change-plan");

const nameInput = document.querySelector('input[name="userName"]');

const emailInput = document.querySelector('input[name="email"]');

const phoneInput = document.querySelector('input[name="phone"]');

const nameError = document.getElementById("name-error");

const emailError = document.getElementById("email-error");

const phoneError = document.getElementById("phone-error");

// ===== GLOBAL VARIABLES =====

let currentStep = 1;

let billingType = "monthly";

let selectedPlan = "Arcade";

let selectedPlanPrice = 9;

let selectedAddons = [];

showStep(1);

// ===== SHOW STEP =====

function showStep(step){

    steps.forEach(section=>{

        section.classList.remove("active");

    });

    document
        .getElementById("step"+step)
        .classList.add("active");

    sidebarSteps.forEach(item=>{

        item.classList.remove("active");

    });

    if(step<=4){

        sidebarSteps[step-1].classList.add("active");

    }

    currentStep=step;

}

// ===== VALIDATE STEP 1 =====

function validateStep1(){

    let valid=true;

    nameError.textContent="";
    emailError.textContent="";
    phoneError.textContent="";

    if(nameInput.value.trim()===""){

        nameError.textContent="Enter your name";

        valid=false;

    }

    if(emailInput.value.trim()===""){

        emailError.textContent="Enter email";

        valid=false;

    }

    else{

        const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!regex.test(emailInput.value.trim())){

            emailError.textContent="Email is not formatted correctly";

            valid=false;

        }

    }

    if(phoneInput.value.trim()===""){

        phoneError.textContent="Enter your mobile number";

        valid=false;

    }

    return valid;

}

// ===== STEP 1 NEXT =====

nextBtn.addEventListener("click",()=>{

    if(validateStep1()){

        showStep(2);

    }

});

// ===== GO BACK =====

backBtn2.addEventListener("click",()=>{

    showStep(1);

});

backBtn3.addEventListener("click",()=>{

    showStep(2);

});

backBtn4.addEventListener("click",()=>{

    showStep(3);

});

// ===== PLAN SELECTION =====

const planCards = document.querySelectorAll(".plan_card");

planCards.forEach(card => {

    card.addEventListener("click", () => {

        planCards.forEach(item => {

            item.classList.remove("selected");

        });

        card.classList.add("selected");

        selectedPlan = card.dataset.plan;

        if (billingType === "monthly") {

            selectedPlanPrice = Number(card.dataset.monthly);

        } else {

            selectedPlanPrice = Number(card.dataset.yearly);

        }

    });

});

// ===== BILLING TOGGLE =====

const billingToggle = document.getElementById("billing-toggle");

const monthlyLabel = document.getElementById("monthly-label");

const yearlyLabel = document.getElementById("yearly-label");

billingToggle.addEventListener("change", () => {

    if (billingToggle.checked) {

        billingType = "yearly";

        monthlyLabel.classList.remove("active");

        yearlyLabel.classList.add("active");

    } else {

        billingType = "monthly";

        yearlyLabel.classList.remove("active");

        monthlyLabel.classList.add("active");

    }

    const selectedCard = document.querySelector(".plan_card.selected");

    if (selectedCard) {

        selectedPlanPrice =
            billingType === "monthly"
                ? Number(selectedCard.dataset.monthly)
                : Number(selectedCard.dataset.yearly);

    }

    updatePrices();

});

// ===== UPDATE PLAN & ADDON PRICES =====

function updatePrices() {

    planCards.forEach(card => {

        const price = billingType === "monthly"
            ? card.dataset.monthly
            : card.dataset.yearly;

        const suffix = billingType === "monthly"
            ? "/mo"
            : "/yr";

        card.querySelector(".plan-price").textContent =
            `$${price}${suffix}`;

    });

    addonCards.forEach(card => {

        const price = billingType === "monthly"
            ? card.dataset.monthly
            : card.dataset.yearly;

        const suffix = billingType === "monthly"
            ? "/mo"
            : "/yr";

        card.querySelector(".addon-price").textContent =
            `+$${price}${suffix}`;

    });

}

// ===== STEP 2 NEXT =====

step2NextBtn.addEventListener("click", () => {

    showStep(3);

});

// ===== ADDON SELECTION =====

const addonCards = document.querySelectorAll(".addon_card");

addonCards.forEach(card => {

    card.addEventListener("click", () => {

        card.classList.toggle("selected");

        const checkbox = card.querySelector("input");

        checkbox.checked = !checkbox.checked;

    });

});

// ===== STEP 3 NEXT =====

step3NextBtn.addEventListener("click", () => {

    selectedAddons = [];

    addonCards.forEach(card => {

        if (card.classList.contains("selected")) {

            selectedAddons.push({

                name: card.dataset.addon,

                price: billingType === "monthly"
                    ? Number(card.dataset.monthly)
                    : Number(card.dataset.yearly)

            });

        }

    });

    updateSummary();

    showStep(4);

});

// ===== SUMMARY ELEMENTS =====

const summaryPlanName = document.getElementById("summary-plan-name");

const summaryPlanPrice = document.getElementById("summary-plan-price");

const summaryAddons = document.getElementById("summary-addons");

const summaryTotalPrice = document.getElementById("summary-total-price");

const totalLabel = document.getElementById("total-label");

// ===== UPDATE SUMMARY =====

function updateSummary() {

    summaryPlanName.textContent =
        `${selectedPlan} (${billingType === "monthly" ? "Monthly" : "Yearly"})`;

    summaryPlanPrice.textContent =
        billingType === "monthly"
            ? `$${selectedPlanPrice}/mo`
            : `$${selectedPlanPrice}/yr`;

    summaryAddons.innerHTML = "";

    let total = selectedPlanPrice;

    selectedAddons.forEach(addon => {

        total += addon.price;

        const item = document.createElement("div");

        item.className = "summary-item";

        item.innerHTML = `
            <span>${addon.name}</span>
            <strong>
                +$${addon.price}${billingType === "monthly" ? "/mo" : "/yr"}
            </strong>
        `;

        summaryAddons.appendChild(item);

    });

    if (billingType === "monthly") {

        totalLabel.textContent = "Total (per month)";

        summaryTotalPrice.textContent = `+$${total}/mo`;

    } else {

        totalLabel.textContent = "Total (per year)";

        summaryTotalPrice.textContent = `+$${total}/yr`;

    }

}

// ===== CHANGE PLAN =====

changePlan.addEventListener("click", function (e) {

    e.preventDefault();

    showStep(2);

});

// ===== CONFIRM =====

confirmBtn.addEventListener("click", () => {

    steps.forEach(step => {

        step.classList.remove("active");

    });

    document
        .getElementById("thankyou")
        .classList.add("active");

    sidebarSteps.forEach(item => {

        item.classList.remove("active");

    });

});

// ===== INITIALIZE =====

updatePrices();

updateSummary();