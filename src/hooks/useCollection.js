import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export function useCollection(collectionName, localFallback = [], orderField = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = collection(db, collectionName);
    const q = orderField ? query(ref, orderBy(orderField)) : ref;

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setData(localFallback);
        } else {
          setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setData(localFallback);
        setLoading(false);
        setError(err);
      }
    );

    return unsub;
  }, [collectionName]);

  return { data: data ?? localFallback, loading, error };
}
