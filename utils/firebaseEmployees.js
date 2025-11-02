import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, doc, onSnapshot, setDoc, where } from "firebase/firestore";
import { db } from "./firebase";

const auth = getAuth();

export const signUpEmployee = async (email, password, firstName, lastName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const fullName = `${firstName} ${lastName}`;

    await updateProfile(user, {
      displayName: fullName,
    });

    await user.reload();

    await setDoc(doc(db, "users", user.uid), {
      email: email,
      fullName: fullName,
      createdAt: new Date().toISOString(),
      role: "employee",
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        fullName: fullName,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code || null,
        message: error.message || String(error),
      },
    };
  }
};

export const signInEmployee = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        fullName: user.displayName,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code || null,
        message: error.message || String(error),
      },
    };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const signOutEmployee = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code || null,
        message: error.message || String(error),
      },
    };
  }
};

export const listenToHRUsers = (callback) => {
  const query = query(collection(db, "users"), where("role", "==", "hr"));
  const unsubscribe = onSnapshot(query, (snapshot) => {
    const hrUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(hrUsers);
  });

  return unsubscribe;
};
