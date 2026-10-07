const {onCall,HttpsError}=require("firebase-functions/v2/https");
const {initializeApp}=require("firebase-admin/app");
const {getAuth}=require("firebase-admin/auth");
const {getFirestore}=require("firebase-admin/firestore");

initializeApp();

const WEB_API_KEY="AIzaSyDCI7iBZA914KCSoUP-k25jaX83bNsr2Lg";

exports.customerLoginByPhone=onCall({region:"asia-south1",enforceAppCheck:false},async(request)=>{
  const phone=String(request.data?.phone||"").trim();
  const password=String(request.data?.password||"");
  if(!/^\+91[0-9]{10}$/.test(phone)||password.length<6){
    throw new HttpsError("invalid-argument","Invalid mobile or password");
  }

  let profileSnap;
  try{
    profileSnap=await getFirestore().collection("profiles")
      .where("phone","==",phone.slice(3)).limit(1).get();
  }catch(e){
    console.error("PROFILE_LOOKUP_FAILED",e);
    throw new HttpsError("internal","Profile lookup failed");
  }

  if(profileSnap.empty) throw new HttpsError("not-found","Customer not found");
  const profile=profileSnap.docs[0].data();
  if(profile.role!=="customer"||!profile.email){
    throw new HttpsError("permission-denied","Customer account not found");
  }

  const email=String(profile.email).trim().toLowerCase();
  let authResult;
  try{
    const response=await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+WEB_API_KEY,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password,returnSecureToken:true})
      }
    );
    authResult=await response.json();
  }catch(e){
    console.error("AUTH_REQUEST_FAILED",e);
    throw new HttpsError("internal","Authentication service failed");
  }

  if(!authResult.localId){
    throw new HttpsError("unauthenticated","Mobile/email ya password galat hai");
  }

  const userRecord=await getAuth().getUser(authResult.localId);
  if(userRecord.uid!==profileSnap.docs[0].id){
    throw new HttpsError("permission-denied","Customer account mismatch");
  }

  const token=await getAuth().createCustomToken(userRecord.uid,{role:"customer"});
  return {token};
});
