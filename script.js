// ================================
// ELEMENTS
// ================================

const steps = document.querySelectorAll(".form-step");
const sidebarSteps = document.querySelectorAll(".step");

const nextButton = document.getElementById("next-button");

const backButtons = document.querySelectorAll(".backBtn");
const nextButtons = document.querySelectorAll(".nextBtn");

const confirmBtn = document.getElementById("confirmBtn");

const changePlan = document.getElementById("changePlan");

const userName = document.querySelector("input[name='userName']");
const email = document.querySelector("input[name='email']");
const phone = document.querySelector("input[name='phone']");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");

// ================================
// APP DATA
// ================================

let currentStep = 1;

let billing = "monthly";

let selectedPlan = null;

let selectedAddons = [];

// ================================
// PLAN DATA
// ================================

const monthlyPlans = {
    Arcade: 9,
    Advance: 12,
    Pro: 15
};

const yearlyPlans = {
    Arcade: 90,
    Advance: 120,
    Pro: 150
};

const monthlyAddons = {
    online: 1,
    storage: 2,
    profile: 2
};

const yearlyAddons = {
    online: 10,
    storage: 20,
    profile: 20
};

// ================================
// STEP FUNCTIONS
// ================================

function showStep(step) {

    steps.forEach(section => {

        section.classList.remove("active");

    });

    sidebarSteps.forEach(item => {

        item.classList.remove("active");

    });

    currentStep = step;

    if(step===5){

        document
        .getElementById("thankYou")
        .classList.add("active");

        return;

    }

    document
    .getElementById("step"+step)
    .classList.add("active");

    sidebarSteps[step-1]
    .classList.add("active");

}

// ================================
// VALIDATION
// ================================

function clearErrors(){

    nameError.textContent="";

    emailError.textContent="";

    phoneError.textContent="";

}

function validateStepOne(){

    clearErrors();

    let valid=true;

    // Name

    if(userName.value.trim()===""){

        nameError.textContent="Enter your name";

        valid=false;

    }

    // Email

    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email.value.trim()===""){

        emailError.textContent="Enter email";

        valid=false;

    }

    else if(!emailRegex.test(email.value)){

        emailError.textContent="Email is not formatted correctly";

        valid=false;

    }

    // Phone

    const phoneRegex=/^[0-9]{10}$/;

    if(phone.value.trim()===""){

        phoneError.textContent="Enter your mobile number";

        valid=false;

    }

    else if(!phoneRegex.test(phone.value)){

        phoneError.textContent="Phone should contain 10 digits";

        valid=false;

    }

    return valid;

}

// ================================
// NEXT BUTTON STEP 1
// ================================

nextButton.addEventListener("click",function(){

    if(validateStepOne()){

        showStep(2);

    }

});

// ================================
// BACK BUTTONS
// ================================

backButtons.forEach(button=>{

    button.addEventListener("click",function(){

        if(currentStep>1){

            showStep(currentStep-1);

        }

    });

});

// ================================
// STEP 2 - PLAN SELECTION
// ================================

const planCards = document.querySelectorAll(".plan_card");
const planError = document.getElementById("planError");
const billingToggle = document.getElementById("billingToggle");

planCards.forEach(card => {

    card.addEventListener("click", function () {

        planCards.forEach(item => item.classList.remove("active"));

        this.classList.add("active");

        selectedPlan = this.dataset.name;

        planError.textContent = "";

    });

});

// ================================
// BILLING TOGGLE
// ================================

billingToggle.addEventListener("change", function () {

    billing = this.checked ? "yearly" : "monthly";

    planCards.forEach(card => {

        const planName = card.dataset.name;

        const price = billing === "monthly"
            ? monthlyPlans[planName]
            : yearlyPlans[planName];

        card.querySelector("p").textContent =
            billing === "monthly"
                ? `$${price}/mo`
                : `$${price}/yr`;

        let bonus = card.querySelector("small");

        if (!bonus) {

            bonus = document.createElement("small");

            card.appendChild(bonus);

        }

        bonus.textContent =
            billing === "yearly"
                ? "2 Months Free"
                : "";

    });

    // Update Addon Prices

    const addonCards = document.querySelectorAll(".addon_card");

    addonCards.forEach((card, index) => {

        const priceSpan = card.querySelector("span");

        const monthly = [1,2,2];

        const yearly = [10,20,20];

        priceSpan.textContent =
            billing === "monthly"
                ? `+$${monthly[index]}/mo`
                : `+$${yearly[index]}/yr`;

    });

});

// ================================
// STEP 2 NEXT
// ================================

nextButtons[0].addEventListener("click", function () {

    if (!selectedPlan) {

        planError.textContent = "Please select a plan";

        return;

    }

    showStep(3);

});

// ================================
// STEP 3 ADDONS
// ================================

const addonCards = document.querySelectorAll(".addon_card");

addonCards.forEach((card,index)=>{

    card.addEventListener("click",function(e){

        if(e.target.tagName!=="INPUT"){

            const checkbox=this.querySelector("input");

            checkbox.checked=!checkbox.checked;

        }

        this.classList.toggle("active");

        const addonName=[
            "online",
            "storage",
            "profile"
        ][index];

        if(this.classList.contains("active")){

            if(!selectedAddons.includes(addonName)){

                selectedAddons.push(addonName);

            }

        }

        else{

            selectedAddons=
            selectedAddons.filter(
                item=>item!==addonName
            );

        }

    });

});

// ================================
// STEP 3 NEXT
// ================================

nextButtons[1].addEventListener("click",function(){

    generateSummary();

    showStep(4);

});

// =======================================
// SUMMARY ELEMENTS
// =======================================

const selectedPlanText = document.getElementById("selectedPlan");
const planPriceText = document.getElementById("planPrice");
const addonsList = document.getElementById("addonsList");
const totalPrice = document.getElementById("totalPrice");

// =======================================
// GENERATE SUMMARY
// =======================================

function generateSummary() {

    const planPrice =
        billing === "monthly"
            ? monthlyPlans[selectedPlan]
            : yearlyPlans[selectedPlan];

    selectedPlanText.textContent =
        `${selectedPlan} (${billing})`;

    planPriceText.textContent =
        billing === "monthly"
            ? `$${planPrice}/mo`
            : `$${planPrice}/yr`;

    addonsList.innerHTML = "";

    let total = planPrice;

    selectedAddons.forEach(addon => {

        let addonTitle = "";
        let addonPrice = 0;

        if(addon==="online"){

            addonTitle="Online Services";

            addonPrice=
            billing==="monthly"
            ? monthlyAddons.online
            : yearlyAddons.online;

        }

        if(addon==="storage"){

            addonTitle="Larger Storage";

            addonPrice=
            billing==="monthly"
            ? monthlyAddons.storage
            : yearlyAddons.storage;

        }

        if(addon==="profile"){

            addonTitle="Customizable Profile";

            addonPrice=
            billing==="monthly"
            ? monthlyAddons.profile
            : yearlyAddons.profile;

        }

        total+=addonPrice;

        const div=document.createElement("div");

        div.innerHTML=`
            <span>${addonTitle}</span>
            <strong>+$${addonPrice}/${billing==="monthly"?"mo":"yr"}</strong>
        `;

        addonsList.appendChild(div);

    });

    totalPrice.textContent=
        billing==="monthly"
        ? `$${total}/mo`
        : `$${total}/yr`;

}

// =======================================
// CHANGE PLAN
// =======================================

changePlan.addEventListener("click",function(e){

    e.preventDefault();

    showStep(2);

});

// =======================================
// CONFIRM BUTTON
// =======================================

confirmBtn.addEventListener("click",function(){

    steps.forEach(step=>{

        step.classList.remove("active");

    });

    sidebarSteps.forEach(step=>{

        step.classList.remove("active");

    });

    document
        .getElementById("thankYou")
        .classList.add("active");

});

// =======================================
// INITIALIZE
// =======================================

showStep(1);