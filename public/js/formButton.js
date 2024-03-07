// Get the submit button by id.
let formButton = document.getElementById("sendForm");

// The function adds the animations and removes it after 5 seconds.
const updateButton = () => {
    // Set busy to true.
    formButton.setAttribute("aria-busy", true);

    // Set busy to false after 5 seconds.
    setTimeout(() => {
        formButton.setAttribute("aria-busy", false);
    }, 5000);
};

// Add the event listerner to the button.
formButton.addEventListener("click", updateButton);