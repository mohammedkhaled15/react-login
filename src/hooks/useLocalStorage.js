import { useState, useEffect } from "react";

const getLocalValue = (key, initialValue) => {
  //SSR nextJS
  if (typeof window === "undefined") return initialValue;

  // if There is allready value stored
  const localValue = JSON.parse(localStorage.getItem(key));
  if (localValue) return localValue;

  // if initial value is a function we need to get the result of invoking it
  if (initialValue instanceof Function) return initialValue();

  return initialValue;
};

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
