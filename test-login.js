// Run this in the browser console on the login page
// First, set up the form values
function testLogin() {
  console.log("Testing login with admin@neurolog.com and admin123");

  // Set the email input value
  const emailInput = document.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.value = "admin@neurolog.com";
    console.log("Email input set");
  } else {
    console.error("Could not find email input");
    return;
  }

  // Set the password input value
  const passwordInput = document.querySelector('input[type="password"]');
  if (passwordInput) {
    passwordInput.value = "admin123";
    console.log("Password input set");
  } else {
    console.error("Could not find password input");
    return;
  }

  // Find and click the submit button
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    console.log("Found submit button, clicking...");
    submitButton.click();
    console.log("Login form submitted");
  } else {
    console.error("Could not find submit button");
    return;
  }

  // Set a callback to check redirection
  console.log("Waiting for redirect...");

  // Check every 500ms for 10 seconds if we've been redirected
  let checkCount = 0;
  const redirectCheck = setInterval(() => {
    checkCount++;
    console.log(`Current path: ${window.location.pathname}`);

    if (window.location.pathname === "/procedures" || window.location.pathname === "/dashboard") {
      console.log("SUCCESSFULLY redirected to authenticated page!");
      clearInterval(redirectCheck);
    } else if (checkCount > 20) {
      console.log("Timed out waiting for redirect");
      clearInterval(redirectCheck);
    }
  }, 500);
}

// Don't run automatically, show instructions
console.log("To test login, navigate to http://localhost:3000/login in your browser");
console.log("Then open the developer console (F12) and run:");
console.log("testLogin()");
