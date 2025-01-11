import { useEffect, useState } from "react";
import { auth, firestore, SubscriptionDataInterface } from "@/util/firebaseConfig";
import { getDoc, doc, collection } from "firebase/firestore";

export function useSubscriptionData() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionDataInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          setAuthToken(token);

          const collect = collection(firestore, "subscription-state");
          const query = await getDoc(doc(collect, user.uid));
          if (query.exists()) {
            console.log(query.data());
            setSubscriptionData(query.data() as SubscriptionDataInterface);
          }
        } else {
          window.location.pathname = "/account/login";
        }
        setLoading(false);
      });
    };
    fetchData();
  }, []);

  return { subscriptionData, loading, authToken };
}
