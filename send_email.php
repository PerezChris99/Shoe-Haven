<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST["subject"]));
    $message = trim($_POST["message"]);
    
    // Check that data was sent to the mailer
    if (empty($name) OR empty($message) OR empty($subject) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Set a 400 (bad request) response code and exit
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }
    
    // Set the recipient email address
    // IMPORTANT: Replace this with your desired email address
    $recipient = "your-email@example.com";
    
    // Set the email subject
    $email_subject = "New Contact from Shoe Haven: $subject";
    
    // Build the email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Subject: $subject\n\n";
    $email_content .= "Message:\n$message\n";
    
    // Build the email headers
    $email_headers = "From: $name <$email>";
    
    // Send the email
    if (mail($recipient, $email_subject, $email_content, $email_headers)) {
        // Set a 200 (okay) response code
        http_response_code(200);
        echo "Thank you! Your message has been sent.";
        
        // Redirect back to the contact page with success message
        header("Location: contact.html?status=success");
        exit;
    } else {
        // Set a 500 (internal server error) response code
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
        
        // Redirect back to the contact page with error message
        header("Location: contact.html?status=error");
        exit;
    }
} else {
    // Not a POST request, redirect to the contact page
    header("Location: contact.html");
    exit;
}
?>
