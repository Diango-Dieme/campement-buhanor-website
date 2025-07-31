<?php
header('Content-Type: application/json'); // Indique que la réponse sera du JSON
header('Access-Control-Allow-Origin: *'); // url de monn site IMPORTANT: À modifier pour la sécurité en production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Pour gérer les requêtes preflight OPTIONS (cors)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input'); // Récupère le corps de la requête brute (JSON)
    $data = json_decode($input, true); // Décode le JSON en tableau associatif PHP

    // Nettoyage et validation des données (IMPORTANT pour la sécurité)
    // Utilisez htmlspecialchars() pour prévenir les attaques XSS si vous affichez ces données
    // sur une page web. Pour l'envoi par mail, cela protège l'en-tête et le corps du mail.
    $firstName = isset($data['firstName']) ? htmlspecialchars(trim($data['firstName'])) : '';
    $lastName = isset($data['lastName']) ? htmlspecialchars(trim($data['lastName'])) : '';
    $email = isset($data['email']) ? htmlspecialchars(trim($data['email'])) : '';
    $message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';

    // Validation côté serveur (indispensable même avec validation JS)
    if (empty($lastName)) {
        $response['message'] = 'Le nom est obligatoire.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Adresse email invalide.';
    } elseif (empty($message)) { // Vous pouvez rendre le message obligatoire ici
         $response['message'] = 'Le message est obligatoire.';
    } elseif (strlen($message) < 10) {
        $response['message'] = 'Le message doit contenir au moins 10 caractères.';
    } else {
        // Préparer l'e-mail
        $to = 'kingfamra13@gmail.com'; // <<< REMPLACEZ PAR VOTRE ADRESSE EMAIL
        $subject = "Nouveau message du formulaire de contact : " . $lastName;
        if (!empty($firstName)) {
            $subject .= " (" . $firstName . ")";
        }

        $email_body = "Nom: " . $lastName . "\n";
        $email_body .= "Prénom: " . ($firstName ? $firstName : 'Non fourni') . "\n";
        $email_body .= "Email: " . $email . "\n\n";
        $email_body .= "Message:\n" . $message;

        $headers = "From: contact@votredomaine.com\r\n"; // <<< REMPLACEZ PAR UNE ADRESSE DE VOTRE DOMAINE

        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n"; // Très important pour les caractères spéciaux

        // Envoyer l'e-mail
        if (mail($to, $subject, $email_body, $headers)) {
            $response['success'] = true;
            $response['message'] = 'Votre message a été envoyé avec succès !';
        } else {
            // Log l'erreur pour le débogage (ne pas afficher au client)
            error_log('Erreur lors de l\'envoi de l\'e-mail : ' . error_get_last()['message']);
            $response['message'] = 'Échec de l\'envoi de l\'e-mail. Veuillez réessayer plus tard.';
        }
    }
} else {
    $response['message'] = 'Méthode de requête non autorisée.';
}

echo json_encode($response);
?>