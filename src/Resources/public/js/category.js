document.addEventListener('DOMContentLoaded', function() {
    // Dynamic form validation
    const form = document.querySelector('form');

    if (form) {
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#ef4444';
                    this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else {
                    this.style.borderColor = '#10b981';
                    this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }
            });

            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#e5e7eb';
                    this.style.boxShadow = 'none';
                }
            });
        });
    }

    // Auto-remove alert messages
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });

    // Smooth animations for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Enhanced table row hover effects
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.transition = 'all 0.2s ease';
        });

        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'all 0.2s ease';
        });
    });

    // Form submission loading state
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;

                // Re-enable after 5 seconds as failsafe
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    });

    // Confirmation dialogs enhancement
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        const form = button.closest('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Create custom confirmation dialog
                const confirmed = confirm('⚠️ Are you sure you want to delete this category?\n\nThis action cannot be undone.');

                if (confirmed) {
                    // Show loading state
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
                    button.disabled = true;

                    // Submit the form
                    this.submit();
                }
            });
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key to close any modals or go back
        if (e.key === 'Escape') {
            const backButton = document.querySelector('.btn-secondary');
            if (backButton && backButton.href) {
                window.location.href = backButton.href;
            }
        }

        // Ctrl/Cmd + S to submit forms
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    });

    // Add focus management for accessibility
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && !e.shiftKey && index === inputs.length - 1) {
                // Focus first button after last input
                const firstButton = document.querySelector('.btn');
                if (firstButton) {
                    e.preventDefault();
                    firstButton.focus();
                }
            }
        });
    });

    // Animate elements on page load
    const animatedElements = document.querySelectorAll('.header, .form-container, .table-container');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
});