<?php
header('Content-Type: application/json');
// IMPORTANT: En production, remplacez l'URL ci-dessous par le domaine EXACT de votre site (ex: 'https://www.campementbuhanor.com') pour des raisons de sécurité !
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // CHAMPS DE CONTACT
    $firstName = isset($data['firstName']) ? htmlspecialchars(trim($data['firstName'])) : '';
    $lastName = isset($data['lastName']) ? htmlspecialchars(trim($data['lastName'])) : '';
    $email = isset($data['email']) ? htmlspecialchars(trim($data['email'])) : '';
    $message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';
    
    // NOUVEAUX CHAMPS DE RÉSERVATION
    $dateArrivee = isset($data['dateArrivee']) ? htmlspecialchars(trim($data['dateArrivee'])) : '';
    $dateDepart = isset($data['dateDepart']) ? htmlspecialchars(trim($data['dateDepart'])) : '';
    $typeChambre = isset($data['typeChambre']) ? htmlspecialchars(trim($data['typeChambre'])) : '';
    $nombreAdultes = isset($data['nombreAdultes']) ? intval($data['nombreAdultes']) : 0;
    $nombreEnfants = isset($data['nombreEnfants']) ? intval($data['nombreEnfants']) : 0;

    // --- VALIDATION CÔTÉ SERVEUR ---
    if (empty($lastName)) {
        $response['message'] = 'Le nom est obligatoire.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Adresse email invalide.';
    } elseif (empty($dateArrivee) || empty($dateDepart)) {
        $response['message'] = 'Les dates d\'arrivée et de départ sont obligatoires.';
    } elseif (empty($typeChambre)) {
        $response['message'] = 'Le type de chambre est obligatoire.';
    } elseif ($nombreAdultes < 1) {
        $response['message'] = 'Le nombre d\'adultes doit être d\'au moins 1.';
    } else {
        // Préparer l'e-mail
        $to = 'kingfamra13@gmail.com'; // <<< REMPLACEZ PAR VOTRE ADRESSE EMAIL DE RÉCEPTION
        $subject = "DEMANDE DE RÉSERVATION Buhanor : " . $lastName;
        if (!empty($firstName)) {
            $subject .= " (" . $firstName . ")";
        }

        $email_body = "--- DEMANDE DE RÉSERVATION ---" . "\n\n";
        $email_body .= "Dates du séjour:" . "\n";
        $email_body .= "Arrivée: " . $dateArrivee . "\n";
        $email_body .= "Départ: " . $dateDepart . "\n\n";
        
        $email_body .= "Détails de la réservation:" . "\n";
        $email_body .= "Chambre: " . $typeChambre . "\n";
        $email_body .= "Adultes: " . $nombreAdultes . "\n";
        $email_body .= "Enfants (0-12 ans): " . $nombreEnfants . "\n\n";
        
        $email_body .= "--- COORDONNÉES CLIENT ---" . "\n";
        $email_body .= "Nom: " . $lastName . "\n";
        $email_body .= "Prénom: " . ($firstName ? $firstName : 'Non fourni') . "\n";
        $email_body .= "Email: " . $email . "\n\n";
        
        $email_body .= "Commentaire/Demande Spéciale:\n" . ($message ? $message : 'Aucun commentaire.') . "\n";

        // IMPORTANT : Remplacez par une adresse de votre domaine, par exemple 'noreply@campementbuhanor.com'
        $headers = "From: contact@votredomaine.com\r\n"; 
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Envoyer l'e-mail
        if (mail($to, $subject, $email_body, $headers)) {
            $response['success'] = true;
            $response['message'] = 'Votre demande de réservation a été envoyée avec succès ! Nous vous recontacterons très vite.';
        } else {
            error_log('Erreur lors de l\'envoi de l\'e-mail : ' . error_get_last()['message']);
            $response['message'] = 'Échec de l\'envoi de l\'e-mail. Veuillez réessayer plus tard.';
        }
    }
} else {
    $response['message'] = 'Méthode de requête non autorisée.';
}

echo json_encode($response);
?>