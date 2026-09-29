import { useContext, useEffect } from "react";
import { PagesContext } from "../Store/PagesProvider";

export const UsePageMeta = (title, description) => {
  const { setCurrentPage } = useContext(PagesContext);

  useEffect(() => {
    setCurrentPage({ title, description });
    return () => setCurrentPage({ title: "Home", description: "" });
  }, [title, description, setCurrentPage]);
};
