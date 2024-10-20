let currentSlide = 0; // Current slide index
const slides = document.querySelectorAll('.carousel-slide'); // All carousel slides

// Function to show the modal with details
function openModal(slideIndex) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const jobDetails = document.getElementById('jobDetails');

    modalImage.src = slides[slideIndex].querySelector('img').src; // Set the modal image to the clicked slide image
    jobDetails.style.display = 'none'; // Hide job details initially
    currentSlide = slideIndex; // Set the current slide

    modal.classList.add('active'); // Show the modal
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active'); // Hide the modal
}

// Function to view job details
function viewDetails() {
    const jobRole = document.getElementById('jobRole');
    const packageOffered = document.getElementById('packageOffered');
    const interviewDate = document.getElementById('interviewDate');

    // Set job details (You can customize these values)
    jobRole.textContent = "Job Role: Software Engineer"; // Example role
    packageOffered.textContent = "Package Offered: $80,000"; // Example package
    interviewDate.textContent = "Interview Date: 2024-12-01"; // Example date

    const jobDetails = document.getElementById('jobDetails');
    jobDetails.style.display = 'block'; // Show job details
}

// Function to delete a job (placeholder)
function deleteJob() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active'); // Close modal
    alert('Job deleted'); // Alert for demo
}

// Functions to handle carousel navigation
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length; // Move to the next slide
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length; // Move to the previous slide
    updateCarousel();
}

// Function to update carousel position
function updateCarousel() {
    const offset = -currentSlide * 100; // Calculate offset
    slides.forEach((slide) => {
        slide.style.transform = `translateX(${offset}%)`; // Move the slides
    });
}

// Form submission handling
document.getElementById('jobForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const company = document.getElementById('company').value;
    const packageOffered = document.getElementById('package').value;
    const role = document.getElementById('role').value;

    console.log('Company:', company);
    console.log('Package Offered:', packageOffered);
    console.log('Job Role:', role);

    // Reset form after submission
    this.reset();
});