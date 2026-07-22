// ================================
// DOM ELEMENTS
// ================================

const steps = document.querySelectorAll(".form-step");
const sidebarSteps = document.querySelectorAll(".step");

const nextBtn = document.getElementById("next-button");

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

// ================================
// GLOBAL VARIABLES
// ================================

let currentStep = 1;

let billingType = "monthly";

let selectedPlan = "Arcade";
let selectedPlanPrice = 9;

let selectedAddons = [];

// ================================
// SHOW STEP
// ================================

function showStep(step) {

    steps.forEach(section => {
        section.classList.remove("active");
    });

    if (step === 5) {
        document.getElementById("thankyou").classList.add("active");

        sidebarSteps.forEach(item => {
            item.classList.remove("active");
        });

        currentStep = 5;
        return;
    }

    document
        .getElementById("step" + step)
        .classList.add("active");

    sidebarSteps.forEach(item => {
        item.classList.remove("active");
    });

    sidebarSteps[step - 1].classList.add("active");

    currentStep = step;
}

// ================================
// VALIDATION
// ================================

function validateStep1() {

    let valid = true;

    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";

    if (nameInput.value.trim() === "") {
        nameError.textContent = "This field is required";
        nameInput.reportValidity();
        valid = false;
    }

    if (emailInput.value.trim() === "") {
        emailError.textContent = "This field is required";
        emailInput.reportValidity();
        valid = false;
    }
    else if (!emailInput.checkValidity()) {
        emailError.textContent = "Invalid email";
        emailInput.reportValidity();
        valid = false;
    }

    if (phoneInput.value.trim() === "") {
        phoneError.textContent = "This field is required";
        phoneInput.reportValidity();
        valid = false;
    }

    return valid;
}

// ================================
// NEXT BUTTON
// ================================

nextBtn.addEventListener("click", () => {

    if (currentStep === 1) {

        if (validateStep1()) {
            showStep(2);
        }

    }

});

// ================================
// GO BACK BUTTONS
// ================================

backBtn2.addEventListener("click", () => {
    showStep(1);
});

backBtn3.addEventListener("click", () => {
    showStep(2);
});

backBtn4.addEventListener("click", () => {
    showStep(3);
});

// ================================
// PLAN SELECTION
// ================================

const planCards = document.querySelectorAll(".plan_card");

planCards.forEach(card => {

    card.addEventListener("click", () => {

        planCards.forEach(item => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        selectedPlan = card.dataset.plan;

        selectedPlanPrice =
            billingType === "monthly"
                ? Number(card.dataset.monthly)
                : Number(card.dataset.yearly);

    });

});

// ================================
// BILLING TOGGLE
// ================================

const billingToggle = document.getElementById("billing-toggle");

const monthlyLabel = document.getElementById("monthly-label");

const yearlyLabel = document.getElementById("yearly-label");

billingToggle.addEventListener("change", () => {

    billingType = billingToggle.checked
        ? "yearly"
        : "monthly";

    monthlyLabel.classList.toggle(
        "active",
        billingType === "monthly"
    );

    yearlyLabel.classList.toggle(
        "active",
        billingType === "yearly"
    );

    const selectedCard =
        document.querySelector(".plan_card.selected");

    if (selectedCard) {

        selectedPlanPrice =
            billingType === "monthly"
                ? Number(selectedCard.dataset.monthly)
                : Number(selectedCard.dataset.yearly);

    }

    updatePrices();

});

// ================================
// UPDATE PLAN & ADDON PRICES
// ================================

const addonCards =
    document.querySelectorAll(".addon_card");

function updatePrices() {

    planCards.forEach(card => {

        const price =
            billingType === "monthly"
                ? card.dataset.monthly
                : card.dataset.yearly;

        card.querySelector(".plan-price").textContent =
            `$${price}${billingType === "monthly" ? "/mo" : "/yr"}`;

    });

    addonCards.forEach(card => {

        const price =
            billingType === "monthly"
                ? card.dataset.monthly
                : card.dataset.yearly;

        card.querySelector(".addon-price").textContent =
            `+$${price}${billingType === "monthly" ? "/mo" : "/yr"}`;

    });

}

// ================================
// STEP 2 NEXT BUTTON
// ================================

const step2NextBtn =
    document.getElementById("next-button-step2");

step2NextBtn.addEventListener("click", () => {

    const selected =
        document.querySelector(".plan_card.selected");

    if (!selected) {

        alert("Please select a plan.");

        return;

    }

    showStep(3);

});

// ================================
// ADD-ON SELECTION
// ================================

addonCards.forEach(card => {

    card.addEventListener("click", () => {

        card.classList.toggle("selected");

        const checkbox = card.querySelector(".addon-checkbox");

        checkbox.checked = card.classList.contains("selected");

    });

});

// ================================
// STEP 3 NEXT BUTTON
// ================================

const step3NextBtn =
    document.getElementById("next-button-step3");

step3NextBtn.addEventListener("click", () => {

    selectedAddons = [];

    addonCards.forEach(card => {

        if (card.classList.contains("selected")) {

            selectedAddons.push({

                name: card.dataset.addon,

                price:
                    billingType === "monthly"
                        ? Number(card.dataset.monthly)
                        : Number(card.dataset.yearly)

            });

        }

    });

    updateSummary();

    showStep(4);

});

// ================================
// SUMMARY ELEMENTS
// ================================

const summaryPlanName =
    document.getElementById("summary-plan-name");

const summaryPlanPrice =
    document.getElementById("summary-plan-price");

const summaryAddons =
    document.getElementById("summary-addons");

const summaryTotalPrice =
    document.getElementById("summary-total-price");

const totalLabel =
    document.getElementById("total-label");

// ================================
// UPDATE SUMMARY
// ================================

function updateSummary() {

    summaryPlanName.textContent =
        `${selectedPlan} (${billingType === "monthly" ? "Monthly" : "Yearly"})`;

    summaryPlanPrice.textContent =
        `$${selectedPlanPrice}${billingType === "monthly" ? "/mo" : "/yr"}`;

    summaryAddons.innerHTML = "";

    let total = selectedPlanPrice;

    selectedAddons.forEach(addon => {

        total += addon.price;

        const div = document.createElement("div");

        div.className = "summary-item";

        div.innerHTML = `
            <span>${addon.name}</span>
            <strong>+$${addon.price}${billingType === "monthly" ? "/mo" : "/yr"}</strong>
        `;

        summaryAddons.appendChild(div);

    });

    totalLabel.textContent =
        billingType === "monthly"
            ? "Total (per month)"
            : "Total (per year)";

    summaryTotalPrice.textContent =
        `+$${total}${billingType === "monthly" ? "/mo" : "/yr"}`;

}

// ================================
// CHANGE PLAN
// ================================

changePlan.addEventListener("click", (e) => {

    e.preventDefault();

    showStep(2);

});

// ================================
// CONFIRM BUTTON
// ================================

confirmBtn.addEventListener("click", () => {

    showStep(5);

});

// ================================
// INITIALIZATION
// ================================

updatePrices();

updateSummary();