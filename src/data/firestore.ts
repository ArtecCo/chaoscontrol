import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";
import type { AppData } from "../types";
import { auth, db } from "../firebase";

const workspacePath = (uid: string) => doc(db!, "users", uid, "workspace", "data");
const userPath = (uid: string) => doc(db!, "users", uid);

export function subscribeToUserData(
  uid: string,
  fallback: AppData,
  onData: (data: AppData) => void,
  onError: (error: Error) => void,
): Unsubscribe | undefined {
  if (!db) return undefined;

  return onSnapshot(
    workspacePath(uid),
    async (snapshot) => {
      if (snapshot.exists()) {
        const remote = snapshot.data().data as AppData | undefined;
        if (remote?.boards?.length) {
          onData(remote);
          return;
        }
      }

      try {
        const user = auth?.currentUser;
        await setDoc(
          userPath(uid),
          {
            email: user?.email ?? null,
            displayName: user?.displayName ?? null,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        await setDoc(workspacePath(uid), {
          data: fallback,
          schemaVersion: 1,
          updatedAt: serverTimestamp(),
        });
        onData(fallback);
      } catch (error) {
        onError(error instanceof Error ? error : new Error("Could not initialize your cloud workspace."));
      }
    },
    (error) => onError(error),
  );
}

export async function saveUserData(uid: string, data: AppData) {
  if (!db) return;
  await setDoc(
    workspacePath(uid),
    { data, schemaVersion: 1, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
