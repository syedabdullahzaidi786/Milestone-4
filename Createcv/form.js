// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners to each "Add" button for dynamic sections
    document.getElementById("addEducation")?.addEventListener("click", () => addEducationField());
    document.getElementById("addExperience")?.addEventListener("click", () => addExperienceField());
    document.getElementById("addLanguage")?.addEventListener("click", () => addField("languageFields", "Language"));
    document.getElementById("addSkill")?.addEventListener("click", () => addField("skillsFields", "Skill"));
    // Form submission event listener
    const form = document.getElementById("cvForm");
    form.addEventListener("submit", (e) => handleFormSubmit(e));
    displaySavedData();
});
// Function to add a new Education field dynamically
function addEducationField() {
    const container = document.getElementById("educationFields");
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "dynamic-item";
    sectionDiv.innerHTML = `
        <label>Degree Name:</label>
        <input type="text" placeholder="Enter Degree Name" required>
        <label>Year:</label>
        <input type="number" placeholder="Enter Year" required>
        <label>Institute:</label>
        <input type="text" placeholder="Enter Institute" required>
        <button type="button" class="remove-button">Remove</button>
    `;
    // Attach functionality to the remove button
    sectionDiv.querySelector(".remove-button")?.addEventListener("click", () => {
        sectionDiv.remove();
    });
    container.appendChild(sectionDiv);
}
// Function to add a new Experience field dynamically
function addExperienceField() {
    const container = document.getElementById("experienceFields");
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "dynamic-item";
    sectionDiv.innerHTML = `
        <label>Company Name:</label>
        <input type="text" placeholder="Enter Company Name" required>
        <label>Start Year:</label>
        <input type="number" placeholder="Enter Start Year" required>
        <label>End Year:</label>
        <input type="number" placeholder="Enter End Year" required>
        <label>Responsibilities:</label>
        <textarea placeholder="Enter Responsibilities" rows="3" required></textarea>
        <button type="button" class="remove-button">Remove</button>
    `;
    // Attach functionality to the remove button
    sectionDiv.querySelector(".remove-button")?.addEventListener("click", () => {
        sectionDiv.remove();
    });
    container.appendChild(sectionDiv);
}
// Generic function to add a new dynamic field (e.g., for Languages or Skills)
function addField(containerId, placeholder) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "dynamic-item";
    sectionDiv.innerHTML = `
        <input type="text" placeholder="Enter ${placeholder}" required>
        <button type="button" class="remove-button">Remove</button>
    `;
    // Attach functionality to the remove button
    sectionDiv.querySelector(".remove-button")?.addEventListener("click", () => {
        sectionDiv.remove();
    });
    container.appendChild(sectionDiv);
}
// Function to handle form submission, validate, and save to local storage
function handleFormSubmit(event) {
    event.preventDefault();
    const userImageInput = document.getElementById("userImage");
    const reader = new FileReader();
    reader.onload = () => {
        const imageData = reader.result;
        const formData = {
            personalInfo: {
                image: imageData,
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
            },
            summary: document.getElementById("summary").value,
            education: getFieldData("educationFields"),
            experience: getFieldData("experienceFields"),
            languages: getFieldData("languageFields"),
            skills: getFieldData("skillsFields"),
        };
        console.log("Form Data:", formData); // Check data structure
        if (validateFormData(formData)) {
            localStorage.setItem("cvData", JSON.stringify(formData));
            alert("Your CV is generating...");
            window.location.href = "./cvpreview.html";
        }
    };
    if (userImageInput.files && userImageInput.files[0]) {
        reader.readAsDataURL(userImageInput.files[0]);
    }
    else {
        alert("Please upload an image");
    }
}
// Helper function to get data from a section
function getFieldData(containerId) {
    const container = document.getElementById(containerId);
    return Array.from(container.querySelectorAll("input, textarea"))
        .map((input) => input.value)
        .filter((value) => value.trim() !== "");
}
// Function to validate form data
function validateFormData(data) {
    const { personalInfo, summary, education, experience } = data;
    if (!personalInfo.name || !personalInfo.email || !personalInfo.phone) {
        alert("Please fill out all required personal information fields.");
        return false;
    }
    if (summary.trim() === "") {
        alert("Please enter a summary.");
        return false;
    }
    if (education.length === 0) {
        alert("Please add at least one entry for education.");
        return false;
    }
    if (experience.length === 0) {
        alert("Please add at least one entry for experience.");
        return false;
    }
    return true;
}
function displaySavedData() {
    const savedData = localStorage.getItem("cvData");
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Retrieved CV Data from Local Storage:", parsedData);
    }
    else {
        console.log("No CV data found in local storage.");
    }
}
export {};