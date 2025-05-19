// Handle contact form status messages
document.addEventListener("DOMContentLoaded", function() {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    
    if (status === 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert alert-success';
        messageDiv.textContent = 'Thank you! Your message has been sent.';
        
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.parentNode.insertBefore(messageDiv, contactForm);
            
            // Remove the parameter from URL
            const url = new URL(window.location);
            url.searchParams.delete('status');
            window.history.replaceState({}, '', url);
            
            // Clear the form
            contactForm.reset();
        }
    } else if (status === 'error') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert alert-danger';
        messageDiv.textContent = 'Oops! Something went wrong and we couldn\'t send your message.';
        
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.parentNode.insertBefore(messageDiv, contactForm);
            
            // Remove the parameter from URL
            const url = new URL(window.location);
            url.searchParams.delete('status');
            window.history.replaceState({}, '', url);
        }
    }
});