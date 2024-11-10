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

let isEditing = false;

function loadCVData(): void {
    const savedData = localStorage.getItem("cvData");
    if (!savedData) return;

    try {
        const cvData: FormData = JSON.parse(savedData);

        // Populate personal information
        (document.getElementById("cvName") as HTMLElement).textContent = cvData.personalInfo.name;
        (document.getElementById("cvEmail") as HTMLElement).textContent = cvData.personalInfo.email;
        (document.getElementById("cvPhone") as HTMLElement).textContent = cvData.personalInfo.phone;
        (document.getElementById("cvAddress") as HTMLElement).textContent = cvData.personalInfo.address;
        (document.getElementById("cvImage") as HTMLImageElement).src = cvData.personalInfo.image;

        // Populate dynamic sections
        populateSection("cvSkills", cvData.skills);
        populateSection("cvLanguages", cvData.languages);
        populateSection("cvExperience", cvData.experience);
        populateSection("cvEducation", cvData.education);

        (document.getElementById("cvSummary") as HTMLElement).textContent = cvData.summary;
    } catch (error) {
        console.error("Error loading CV data:", error);
    }
}

function populateSection(elementId: string, items: string[]): void {
    const container = document.getElementById(elementId) as HTMLElement;
    container.innerHTML = items.map(item => `<p contenteditable="${isEditing}">${item}</p>`).join('');
}

function toggleEditMode(): void {
    isEditing = !isEditing;
    const elementsToToggle = document.querySelectorAll("#cvName, #cvEmail, #cvPhone, #cvAddress, #cvSummary, #cvSkills p, #cvLanguages p, #cvExperience p, #cvEducation p");

    elementsToToggle.forEach(element => {
        element.setAttribute("contenteditable", String(isEditing));
        element.classList.toggle("editable", isEditing); // Add styling for editable mode
    });

    // Update toolbar button text
    (document.getElementById("editCV") as HTMLButtonElement).textContent = isEditing ? "Save" : "Edit CV";

    if (!isEditing) saveCVData();  // Save changes when exiting edit mode
}

function saveCVData(): void {
    const updatedData: FormData = {
        personalInfo: {
            image: (document.getElementById("cvImage") as HTMLImageElement).src,
            name: (document.getElementById("cvName") as HTMLElement).textContent || "",
            email: (document.getElementById("cvEmail") as HTMLElement).textContent || "",
            phone: (document.getElementById("cvPhone") as HTMLElement).textContent || "",
            address: (document.getElementById("cvAddress") as HTMLElement).textContent || ""
        },
        summary: (document.getElementById("cvSummary") as HTMLElement).textContent || "",
        skills: Array.from(document.querySelectorAll("#cvSkills p")).map(p => p.textContent || ""),
        languages: Array.from(document.querySelectorAll("#cvLanguages p")).map(p => p.textContent || ""),
        experience: Array.from(document.querySelectorAll("#cvExperience p")).map(p => p.textContent || ""),
        education: Array.from(document.querySelectorAll("#cvEducation p")).map(p => p.textContent || "")
    };

    localStorage.setItem("cvData", JSON.stringify(updatedData));
}

function printCV(): void {
    const toolbar = document.querySelector(".toolsbar") as HTMLElement;
    toolbar.style.display = "none";
    
    setTimeout(() => {
        window.print();
        toolbar.style.display = "flex";
    }, 300);
}

async function downloadPDF(): Promise<void> {
    const cvElement = document.querySelector(".cv-container") as HTMLElement;
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
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        if (cvElement) cvElement.classList.remove("pdf-mode");
    }
}

function updateFont(): void {
    const fontSelect = document.getElementById("fontSelect") as HTMLSelectElement;
    document.body.style.fontFamily = fontSelect.value;
}

function updateCSSVariables(color: string) {
    document.documentElement.style.setProperty('--left-column-bg-color', color);
  }
  
  // Wait for the DOM to fully load
  document.addEventListener("DOMContentLoaded", () => {
      loadCVData();
      (document.getElementById("printCV") as HTMLButtonElement).addEventListener("click", printCV);
      (document.getElementById("downloadPDF") as HTMLButtonElement).addEventListener("click", downloadPDF);
      (document.getElementById("editCV") as HTMLButtonElement).addEventListener("click", toggleEditMode);
      (document.getElementById("fontSelect") as HTMLSelectElement).addEventListener("change", updateFont);
  
      // Get the color picker input and listen for changes
      const colorPicker = document.getElementById("colorSelect") as HTMLInputElement;
      colorPicker.addEventListener("input", (event) => {
        const selectedColor = (event.target as HTMLInputElement).value;
        updateCSSVariables(selectedColor);
      });
  });