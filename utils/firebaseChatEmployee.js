import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const getEmployees = (callback) => {
  const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
    const employees = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(employees);
  });
  return unsubscribe;
};

export const sendMessage = async (conversationId, senderId, text) => {
  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages",
  );

  await addDoc(messagesRef, {
    senderId,
    text,
    timestamp: serverTimestamp(),
  });

  const conversationRef = doc(db, "conversations", conversationId);
  await setDoc(
    conversationRef,
    {
      lastMessage: text,
      lastMessageTimestamp: serverTimestamp(),
    },
    { merge: true },
  );
};

export const listenToConversation = (conversationId, callback) => {
  const conversationRef = doc(db, "conversations", conversationId);

  let unsubscribeMessages = null;

  const unsubscribeConversation = onSnapshot(conversationRef, (docSnap) => {
    if (!docSnap.exists()) {
      console.warn("Conversation not found!");
      callback(null);

      if (unsubscribeMessages) {
        unsubscribeMessages();
        unsubscribeMessages = null;
      }

      return;
    }

    const conversationData = { id: docSnap.id, ...docSnap.data() };

    const messagesQuery = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("timestamp", "asc"),
    );

    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }

    unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      callback({ conversation: conversationData, messages });
    });
  });

  return () => {
    if (unsubscribeConversation) unsubscribeConversation();
    if (unsubscribeMessages) unsubscribeMessages();
  };
};

export const listenToConversations = (callback) => {
  const conversationsQuery = query(
    collection(db, "conversations"),
    orderBy("lastMessageTimestamp", "desc"),
  );

  const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
    const conversations = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(conversations);
  });

  return unsubscribe;
};
