// ============================================================
// AUTH STATE MANAGEMENT
// ============================================================

// These will be set by Firebase auth listener
window.isSignedIn = false;
window.isPremiumMember = false;
window.currentUser = null;

// Firebase config (replace with your own)
// This is a placeholder — you MUST replace with your Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ============================================================
// AUTH STATE LISTENER
// ============================================================
auth.onAuthStateChanged(user => {
    if (user) {
        window.isSignedIn = true;
        window.currentUser = user;
        // Check if user has premium status (stored in localStorage for demo)
        // In production, you'd check a Firestore document or Stripe subscription status
        const premiumStatus = localStorage.getItem(`premium_${user.uid}`);
        window.isPremiumMember = (premiumStatus === 'true');

        // Update UI
        document.getElementById('authBtn').textContent = '👤 My Account';
        document.getElementById('authBtn').href = '#';

        // Dispatch event for main.js
        document.dispatchEvent(new Event('authStateChanged'));
    } else {
        window.isSignedIn = false;
        window.isPremiumMember = false;
        window.currentUser = null;
        document.getElementById('authBtn').textContent = 'Sign In';
        document.getElementById('authBtn').href = 'signin.html';
        document.dispatchEvent(new Event('authStateChanged'));
    }
});

// ============================================================
// SIGN OUT (optional)
// ============================================================
function signOut() {
    auth.signOut();
}
