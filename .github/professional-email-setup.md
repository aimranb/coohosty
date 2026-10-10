# Adresse professionnelle COOHOSTY

Le site accepte une adresse réelle via la variable publique `NEXT_PUBLIC_CONTACT_EMAIL`.
Une boîte suggérée est `contact@coohosty.com`, mais elle ne doit être publiée qu’après sa création et un test de réception/réponse.

1. Identifier le fournisseur de messagerie du domaine ou créer la boîte chez le fournisseur choisi par le propriétaire.
2. Appliquer les enregistrements DNS fournis par ce fournisseur (MX, SPF, DKIM et DMARC) sans remplacer aveuglément la configuration existante.
3. Vérifier réception, envoi et réponses sur la boîte.
4. Configurer `NEXT_PUBLIC_CONTACT_EMAIL` dans Vercel, puis redéployer. Cette adresse est destinée à être visible sur le site.

`EMAIL_FROM` et la vérification du domaine d’envoi Resend sont distincts d’une boîte de réception. Une adresse d’envoi vérifiée ne prouve pas qu’une boîte reçoit des messages.

## Témoignages et équipe

Les avis réels vont dans `src/config/service-proof.json`, avec le texte approuvé, le nom autorisé et le lien public si disponible. Sans avis approuvés, le site ne publie ni témoignage ni note inventée.
Les noms, rôles, biographies et photos de l’équipe doivent être fournis ou approuvés par le propriétaire avant publication. La présentation actuelle décrit le service et sa méthode sans inventer de personnes.
