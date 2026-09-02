document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.9)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.5)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Booking Form Submission
    const bookingForm = document.getElementById('booking-form');
    const bookingHeader = document.querySelector('.booking-header');
    const successMessage = document.getElementById('success-message');
    const resetBtn = document.getElementById('reset-btn');

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation is handled by HTML5 attributes (required)
        // Simulate an API call or processing time
        const submitBtn = bookingForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Fade out form and header
            bookingForm.classList.add('fade-out');
            bookingHeader.classList.add('fade-out');
            
            // Show success message after form fades out
            setTimeout(() => {
                bookingForm.style.display = 'none';
                bookingHeader.style.display = 'none';
                successMessage.classList.remove('hidden');
                successMessage.classList.add('fade-in');
                
                // Show an explicit alert box as requested
                alert("Booking Successful! We look forward to hosting you.");
            }, 300); // matches transition time
            
        }, 1000);
    });

    resetBtn.addEventListener('click', () => {
        // Reset form
        bookingForm.reset();
        
        // Reset button state
        const submitBtn = bookingForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Confirm Reservation';
        submitBtn.disabled = false;
        
        // Hide success message
        successMessage.classList.remove('fade-in');
        successMessage.classList.add('hidden');
        
        // Show form and header
        bookingForm.style.display = 'flex';
        bookingHeader.style.display = 'block';
        setTimeout(() => {
            bookingForm.classList.remove('fade-out');
            bookingHeader.classList.remove('fade-out');
        }, 50);
    });
});
