# Diva Queen — Firebase security setup

The app uses Firebase Authentication and Cloud Firestore. Firestore access is intentionally denied by default except for the role-based collections defined in `firestore.rules`.

## Important
- Never store plaintext passwords in Firestore.
- Do not use `allow read, write: if true`.
- The browser cannot safely grant itself the `admin` role.
- The first admin profile must be created/assigned from a trusted Firebase/Google Cloud administrative environment.

## Current collections
- `profiles/{uid}`
- `products/{productId}`
- `orders/{orderId}`
- `appSettings/{docId}`

The rules are designed for customer/seller/admin separation.