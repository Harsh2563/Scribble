import { useEffect, useState } from "react";
import Tiptap from "./components/editor/editor";

import React from "react";

import { getNote } from "./appwrite/api";

import Loader from "./components/Loader/Loader";


const TiptapEditor = ({id}) => {
  const [dataNote, setDataNote] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getNote(id);
        setDataNote(fetchedData);
        setDataNote(fetchedData)
      } catch (error) {
        console.error("Some error has occurred:", error);
      }
    };

    fetchData();
  }, []);

  if (!dataNote) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className="TiptapEditor">
        <Tiptap content={dataNote} id={id}/>
      </div>
    </>
  );
};

export default TiptapEditor;
