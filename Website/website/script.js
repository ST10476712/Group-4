const courseData = {
    // Six-month Courses (R1500)
    firstAid: { title: "First Aid", fees: 1500, purpose: "To provide first aid awareness and basic life support.", content: ["Wounds and bleeding", "Burns and fractures", "Emergency scene management", "Cardio-Pulmonary Resuscitation (CPR)", "Respiratory distress e.g. Choking, Blocked Airway"] },
    sewing: { title: "Sewing", fees: 1500, purpose: "To provide alterations and new garment tailoring services.", content: ["Types of stitches", "Threading a sewing machine", "Sewing buttons, zips, hems and seams", "Alterations", "Designing and sewing new garments"] },
    landscaping: { title: "Landscaping", fees: 1500, purpose: "To provide landscaping services for new and established gardens.", content: ["Indigenous and exotic plants and trees", "Fixed structures (fountains, statues, benches, tables, built-in braai)", "Balancing of plants and trees in a garden", "Aesthetics of plant shapes and colours", "Garden layout"] },
    lifeSkills: { title: "Life Skills", fees: 1500, purpose: "To provide skills to navigate basic life necessities.", content: ["Opening a bank account", "Basic labour law (know your rights)", "Basic reading and writing literacy", "Basic numeric literacy"] },
    // Six-week Short Courses (R750)
    childMinding: { title: "Child Minding", fees: 750, purpose: "To provide basic child and baby care.", content: ["Birth to six-month old baby needs", "Seven-month to one year old needs", "Toddler needs", "Educational toys"] },
    cooking: { title: "Cooking", fees: 750, purpose: "To prepare and cook nutritious family meals.", content: ["Nutritional requirements for a healthy body", "Types of protein, carbohydrates and vegetables", "Planning meals", "Tasty and nutritious recipes", "Preparation and cooking of meals"] },
    gardenMaintenance: { title: "Garden Maintenance", fees: 750, purpose: "To provide basic knowledge of watering, pruning and planting in a domestic garden.", content: ["Water restrictions and the watering requirements of indigenous and exotic plants", "Pruning and propagation of plants", "Planting techniques for different plant types"] }
};

// State variable to track history for 'Back' button
let pageHistory = ['home'];

document.addEventListener('DOMContentLoaded', () => {
    // Populate course selection checkboxes when the page loads
    populateCourseSelection();
});

// Function to toggle the dropdown menu visibility
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('visible');
}

// Function to switch visible page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show the requested page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update history, but prevent adding the same page multiple times
        if (pageHistory[pageHistory.length - 1] !== pageId) {
            pageHistory.push(pageId);
        }
    }
    
    // Hide dropdown menu after selection
    document.getElementById('navMenu').classList.remove('visible');
}

// Function to go back to the previous page
function goBack() {
    // Remove current page from history
    pageHistory.pop(); 

    // Get the previous pageId
    const previousPageId = pageHistory[pageHistory.length - 1] || 'home'; 

    // Remove the previous page from history so it's not added again by showPage
    pageHistory.pop(); 
    
    // Show the previous page
    showPage(previousPageId);
}

// Function to display detailed course information
function showCourseDetails(courseId) {
    const course = courseData[courseId];
    if (!course) return;

    // Update the Enroll button's function call to pass the course title
    document.getElementById('enroll-button').setAttribute('onclick', `enrollInCourse('${course.title}')`);
    
    document.getElementById('detail-title').textContent = course.title;
    document.getElementById('detail-fees').textContent = course.fees.toFixed(2);
    document.getElementById('detail-purpose').textContent = course.purpose;

    const contentList = document.getElementById('detail-content');
    contentList.innerHTML = '';
    course.content.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        contentList.appendChild(li);
    });

    showPage('course-details');
}

// Function to populate the checkboxes in the 'Calculate Total Fees' form
function populateCourseSelection() {
    const container = document.getElementById('courseSelection');
    container.innerHTML = ''; // Clear previous content

    for (const id in courseData) {
        const course = courseData[id];
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="checkbox" id="${id}" name="course" value="${course.fees}">
            <label for="${id}">${course.title} (R${course.fees})</label>
        `;
        container.appendChild(div);
    }
}

// Function to calculate fees and discounts
function calculateTotalFees() {
    const form = document.getElementById('quoteForm');
    
    // Check if the required contact fields are filled
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const selectedCourses = document.querySelectorAll('#courseSelection input[type="checkbox"]:checked');
    const courseCount = selectedCourses.length;
    let subtotal = 0;

    selectedCourses.forEach(checkbox => {
        subtotal += parseFloat(checkbox.value);
    });

    let discountRate = 0;
    if (courseCount === 2) {
        discountRate = 0.05; // 5%
    } else if (courseCount === 3) {
        discountRate = 0.10; // 10%
    } else if (courseCount >= 4) {
        discountRate = 0.15; // 15%
    }

    const discountAmount = subtotal * discountRate;
    const totalBeforeVAT = subtotal - discountAmount;
    const vatRate = 0.15; // 15%
    const vatAmount = totalBeforeVAT * vatRate;
    const finalTotal = totalBeforeVAT + vatAmount;

    // Display results
    document.getElementById('courseCount').textContent = courseCount;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('discountRate').textContent = `${(discountRate * 100).toFixed(0)}%`;
    document.getElementById('discountAmount').textContent = discountAmount.toFixed(2);
    document.getElementById('totalBeforeVAT').textContent = totalBeforeVAT.toFixed(2);
    document.getElementById('vatAmount').textContent = vatAmount.toFixed(2);
    document.getElementById('finalTotal').textContent = finalTotal.toFixed(2);

    document.getElementById('resultsArea').classList.remove('hidden');
}


// ====================================================================
// NEW ENROLLMENT FUNCTIONS
// ====================================================================

/**
 * Navigates to the enrollment form and pre-populates the selected course name.
 * @param {string} courseName The title of the course to enroll in.
 */
function enrollInCourse(courseName) {
    // Reset the form and hide results
    document.getElementById('courseEnrollmentForm').reset();
    document.getElementById('courseEnrollmentForm').classList.remove('hidden');
    document.getElementById('enrollmentResults').classList.add('hidden');

    // Display the selected course name
    document.getElementById('enrollment-course-name').textContent = courseName;
    
    // Switch to the enrollment page
    showPage('enrollment-form');
}

/**
 * Handles the enrollment form submission and displays a confirmation message.
 */
function submitEnrollment() {
    const form = document.getElementById('courseEnrollmentForm');
    
    if (form.checkValidity()) {
        // Collect form data
        const name = document.getElementById('enrollName').value;
        const courseName = document.getElementById('enrollment-course-name').textContent;
        const email = document.getElementById('enrollEmail').value;
        const phone = document.getElementById('enrollPhone').value;
        const venue = document.getElementById('enrollVenue').value;

        // Populate results area
        document.getElementById('enrollResultName').textContent = name;
        document.getElementById('enrollResultCourse').textContent = courseName;
        document.getElementById('enrollResultEmail').textContent = email;
        document.getElementById('enrollResultPhone').textContent = phone;
        document.getElementById('enrollResultVenue').textContent = venue;

        // Hide form and show results
        form.classList.add('hidden');
        document.getElementById('enrollmentResults').classList.remove('hidden');
        
        // In a real application, the data would be sent to a server here.
    } else {
        // If validation fails, trigger native browser validation display
        form.reportValidity();
    }
}