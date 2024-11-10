let isEditing = false;
function loadCVData() {
    const savedData = localStorage.getItem("cvData");
    if (!savedData)
        return;
    try {
        const cvData = JSON.parse(savedData);
        // Populate personal information
        document.getElementById("cvName").textContent = cvData.personalInfo.name;
        document.getElementById("cvEmail").textContent = cvData.personalInfo.email;
        document.getElementById("cvPhone").textContent = cvData.personalInfo.phone;
        document.getElementById("cvAddress").textContent = cvData.personalInfo.address;
        document.getElementById("cvImage").src = cvData.personalInfo.image;
        // Populate dynamic sections
        populateSection("cvSkills", cvData.skills);
        populateSection("cvLanguages", cvData.languages);
        populateSection("cvExperience", cvData.experience);
        populateSection("cvEducation", cvData.education);
        document.getElementById("cvSummary").textContent = cvData.summary;
    }
    catch (error) {
        console.error("Error loading CV data:", error);
    }
}
function populateSection(elementId, items) {
    const container = document.getElementById(elementId);
    container.innerHTML = items.map(item => `<p contenteditable="${isEditing}">${item}</p>`).join('');
}
function toggleEditMode() {
    isEditing = !isEditing;
    const elementsToToggle = document.querySelectorAll("#cvName, #cvEmail, #cvPhone, #cvAddress, #cvSummary, #cvSkills p, #cvLanguages p, #cvExperience p, #cvEducation p");
    elementsToToggle.forEach(element => {
        element.setAttribute("contenteditable", String(isEditing));
        element.classList.toggle("editable", isEditing); // Add styling for editable mode
    });
    // Update toolbar button text
    document.getElementById("editCV").textContent = isEditing ? "Save" : "Edit CV";
    if (!isEditing)
        saveCVData(); // Save changes when exiting edit mode
}
function saveCVData() {
    const updatedData = {
        personalInfo: {
            image: document.getElementById("cvImage").src,
            name: document.getElementById("cvName").textContent || "",
            email: document.getElementById("cvEmail").textContent || "",
            phone: document.getElementById("cvPhone").textContent || "",
            address: document.getElementById("cvAddress").textContent || ""
        },
        summary: document.getElementById("cvSummary").textContent || "",
        skills: Array.from(document.querySelectorAll("#cvSkills p")).map(p => p.textContent || ""),
        languages: Array.from(document.querySelectorAll("#cvLanguages p")).map(p => p.textContent || ""),
        experience: Array.from(document.querySelectorAll("#cvExperience p")).map(p => p.textContent || ""),
        education: Array.from(document.querySelectorAll("#cvEducation p")).map(p => p.textContent || "")
    };
    localStorage.setItem("cvData", JSON.stringify(updatedData));
}
function printCV() {
    const toolbar = document.querySelector(".toolsbar");
    toolbar.style.display = "none";
    setTimeout(() => {
        window.print();
        toolbar.style.display = "flex";
    }, 300);
}
async function downloadPDF() {
    const cvElement = document.querySelector(".cv-container");
    const options = {
        margin: 0.5,
        filename: 'My_CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    if (cvElement) {
        cvElement.classList.add("pdf-mode");
    }
    try {
        // @ts-ignore
        await html2pdf().from(cvElement).set(options).save();
    }
    catch (error) {
        console.error("Error generating PDF:", error);
    }
    finally {
        if (cvElement)
            cvElement.classList.remove("pdf-mode");
    }
}
function updateFont() {
    const fontSelect = document.getElementById("fontSelect");
    document.body.style.fontFamily = fontSelect.value;
}
function updateCSSVariables(color) {
    document.documentElement.style.setProperty('--left-column-bg-color', color);
}
// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    loadCVData();
    document.getElementById("printCV").addEventListener("click", printCV);
    document.getElementById("downloadPDF").addEventListener("click", downloadPDF);
    document.getElementById("editCV").addEventListener("click", toggleEditMode);
    document.getElementById("fontSelect").addEventListener("change", updateFont);
    // Get the color picker input and listen for changes
    const colorPicker = document.getElementById("colorSelect");
    colorPicker.addEventListener("input", (event) => {
        const selectedColor = event.target.value;
        updateCSSVariables(selectedColor);
    });
});
export {};