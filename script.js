document.addEventListener("DOMContentLoaded", () => {
    // --- Card Animations ---
    const cards = document.querySelectorAll('.glass-card');
    
    // Simple intersection observer to animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.15}s`;
        observer.observe(card);
    });

    // Hover effect for 3D tilt
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // --- Modal Logic ---
    const clickableCards = document.querySelectorAll('.clickable-card');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');

    // Open modal
    clickableCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.style.display = 'flex'; // Make it block/flex before animating opacity
                // Slight timeout so the browser registers the display change before animating opacity
                setTimeout(() => {
                    targetModal.classList.add('show');
                }, 10);
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Close modal via close button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal via clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal via Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) closeModal(openModal);
        }
    });

    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore background scrolling
        // Wait for CSS opacity transition to finish, then set display none
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                modal.style.display = 'none';
            }
        }, 300); // 300ms matches the CSS transition time
    }
});
