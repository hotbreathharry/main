// ============================================================
// SUBSCRIPTION PAGE LOGIC
// ============================================================

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    // --- Plan buttons (Stripe checkout simulation) ---
    const planButtons = document.querySelectorAll('.btn-plan');
    planButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const plan = this.dataset.plan;

            // In production, redirect to Stripe Checkout with the appropriate price ID
            // For demo, we simulate a successful subscription
            if (window.isSignedIn) {
                // Simulate premium upgrade
                const user = firebase.auth().currentUser;
                if (user) {
                    localStorage.setItem(`premium_${user.uid}`, 'true');
                    window.isPremiumMember = true;
                    alert(`✅ Success! You're now a premium member (${plan} plan).`);
                    window.location.href = 'index.html';
                } else {
                    alert('Please sign in first.');
                    window.location.href = 'signin.html';
                }
            } else {
                alert('Please sign in to subscribe.');
                window.location.href = 'signin.html';
            }
        });
    });

    // --- Prompt pack "Buy now" ---
    const packBtn = document.querySelector('.btn-pack');
    if (packBtn) {
        packBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Prompt packs coming soon! Contact us for bulk purchases.');
        });
    }

    // --- Nav toggle ---
    document.getElementById('navToggle')?.addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });

    // Update auth button from auth.js state
    // auth.js will handle the button text via onAuthStateChanged
});
