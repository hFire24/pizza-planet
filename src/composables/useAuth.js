import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { ref } from 'vue'
import { doc, setDoc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore'
import { db, dbUsersRef } from "../firebase"

export default function useAuth() {
    const auth = getAuth();
    const errorMessage = ref("");
    const signInModalOpen = ref(false);
    const userData = ref(null);
    const userIsAdmin = ref(false);
    const toggleAdminMessage = ref("");
    const selectedUser = ref(null);

    async function findUser(userEmail) {
        try {
            toggleAdminMessage.value = "";
            if(!userIsAdmin.value) {
                alert("You can't do this");
                return;
            }
            const queryData = query(dbUsersRef, where("email", "==", userEmail));
            const user = await getDocs(queryData);
            const userObject = {
                id: user.docs[0].id,
                email: user.docs[0].data().email,
                isAdmin: user.docs[0].data().isAdmin
            };
            selectedUser.value = userObject;
        } catch(e) {
            selectedUser.value = null;
            toggleAdminMessage.value = "No user found with that email..."
        }
    }

    async function checkAdminRole() {
        if(userData.value?.uid) {
            const docRef = doc(dbUsersRef, userData.value.uid);
            const user = await getDoc(docRef);
            if(user.exists() && user.data().isAdmin) {
                userIsAdmin.value = true;
            } else {
                userIsAdmin.value = false;
            }
        }
    }

    function toggleModal() {
        signInModalOpen.value = !signInModalOpen.value;
    }

    async function signUp(email, password) {
        try{
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const userObject = {
                createdAt: new Date(),
                email: user.email,
                isAdmin: false
            }
            const newDoc = doc(db, "users", user.uid);
            await setDoc(newDoc, userObject)
            errorMessage.value = "";
            signInModalOpen.value = false;
        }
        catch(e) {
            switch(e.code) {
                case 'auth/email-already-in-use':
                    errorMessage.value = "A user with that email already exists. Please log in."
                    break;
                case 'auth/weak-password':
                    errorMessage.value = "The password should be at least 6 characters long.";
                    break;
                default:
                    errorMessage.value = "Sorry, there was an unexpected error.";
            }
        }
    }

    async function logIn(email, password) {
        if(!email) return errorMessage.value = "Please enter a valid email"
        if(!password) return errorMessage.value = "Please enter a valid password"
        try{
            const user = await signInWithEmailAndPassword(auth, email, password);
            errorMessage.value = "";
            signInModalOpen.value = false;
        }
        catch(e) {
            switch(e.code) {
                case 'auth/wrong-password':
                    errorMessage.value = "Incorrect password."
                    break;
                case 'auth/user-not-found':
                    errorMessage.value = "No user found with that email.";
                    break;
                default:
                    errorMessage.value = "Sorry, there was an unexpected error.";
            }
        }
    }

    function logOut() {
        try {
            signOut(auth)
        } catch(e) {
            errorMessage.value = e.message;
        }
    }

    async function toggleAdmin() {
        try {
            if(!userIsAdmin.value) {
                alert("You can't do this");
                return
            }
            const docRef = doc(db, "users", selectedUser.value.id);
            await updateDoc(docRef, {
                isAdmin: !selectedUser.value.isAdmin
            });
            findUser(selectedUser.value.email);
        } catch(e) {
            console.log(e);
        }
    }

    onAuthStateChanged(auth, (user) => {
        if(user) {
            userData.value = user;
            checkAdminRole();
        } else {
            userData.value = null;
            userIsAdmin.value = false;
        }
    })
    return{ signUp, errorMessage, toggleModal, signInModalOpen, logIn, logOut, userData, userIsAdmin, findUser, selectedUser, toggleAdminMessage, toggleAdmin }
}