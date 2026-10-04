DIVA QUEEN - Android V36 wrapper

Project: DivaQueen
Application ID: com.divaqueen.app
Version: 1.0.0 (versionCode 1)

Build in Android Studio:
1. Open this folder as an existing Gradle project.
2. Let Android Studio sync/download the Android Gradle Plugin and SDK.
3. For testing: Build > Build Bundle(s) / APK(s) > Build Bundle(s).
4. For Play Store: Build > Generate Signed Bundle / APK > Android App Bundle.
5. Create/choose a release keystore and keep its backup safe.

IMPORTANT:
- This wrapper packages the supplied V36 HTML as a local WebView app.
- V36 currently stores data in localStorage and has REMOTE_SYNC_ENABLED=false.
- Do not publish real admin credentials contained in the HTML. Replace the client-side login/auth with a secure backend before production.
- Razorpay refund API calls require the backend endpoint used by the HTML; this wrapper does not create that backend.
