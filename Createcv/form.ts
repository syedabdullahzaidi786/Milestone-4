// Define types for different sections of the form data
interface PersonalInfo {
    image: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface FormData {
    personalInfo: PersonalInfo;
    summary: string;
    education: string[];
    experience: string[];
    languages: string[];
    skills: string[];
}

// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners to each "Add" button for dynamic sections
    document.getElementById("addEducation")?.addEventListener("click", () => addEducationField());
    document.getElementById("addExperience")?.addEventListener("click", () => addExperienceField());
    document.getElementById("addLanguage")?.addEventListener("click", () => addField("languageFields", "Language"));
    document.getElementById("addSkill")?.addEventListener("click", () => addField("skillsFields", "Skill"));

    // Form submission event listener
    const form = document.getElementById("cvForm") as HTMLFormElement;
    form.addEventListener("submit", (e) => handleFormSubmit(e));

    displaySavedData();
});

// Function to add a new Education field dynamically
function addEducationField(): void {
    const container = document.getElementById("educationFields") as HTMLElement;
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
function addExperienceField(): void {
    const container = document.getElementById("experienceFields") as HTMLElement;
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
function addField(containerId: string, placeholder: string): void {
    const container = document.getElementById(containerId) as HTMLElement;
    if (!container) return;

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
function handleFormSubmit(event: Event): void {
    event.preventDefault();
    const userImageInput = document.getElementById("userImage") as HTMLInputElement;
    const reader = new FileReader();

    reader.onload = () => {
        const imageData = reader.result as string;

        const formData: FormData = {
            personalInfo: {
                image: imageData,
                name: (document.getElementById("name") as HTMLInputElement).value,
                email: (document.getElementById("email") as HTMLInputElement).value,
                phone: (document.getElementById("phone") as HTMLInputElement).value,
                address: (document.getElementById("address") as HTMLInputElement).value,
            },
            summary: (document.getElementById("summary") as HTMLTextAreaElement).value,
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
    } else {
        alert("Please upload an image");
    }
}
// Helper function to get data from a section
function getFieldData(containerId: string): string[] {
    const container = document.getElementById(containerId) as HTMLElement;
    return Array.from(container.querySelectorAll("input, textarea"))
        .map((input) => (input as HTMLInputElement).value)
        .filter((value) => value.trim() !== "");
}

// Function to validate form data
function validateFormData(data: FormData): boolean {
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

function displaySavedData(): void {
    const savedData = localStorage.getItem("cvData");
    if (savedData) {
        const parsedData: FormData = JSON.parse(savedData);
        console.log("Retrieved CV Data from Local Storage:", parsedData);
    } else {
        console.log("No CV data found in local storage.");
    }
}