import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { updateNoteTitle, getNoteTitleById } from "../../appwrite/api";

const Title = () => {
  const labelText = "Title";
  const { id } = useParams();

  const [inputValue, setInputValue] = useState("");
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    const fetchTitleAndSet = async () => {
      const title = await getNoteTitleById(id);
      setInputValue(title);
    };

    fetchTitleAndSet();
  }, [id]);

  const handleInputChange = (event) => {
    if (isEditable) {
      setInputValue(event.target.value);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      setIsEditable(false);
      await updateNoteTitle(id, inputValue);
    }
  };

  const handleDoubleClick = () => {
    setIsEditable(true);
  };
  

  const renderLabelChars = () => {
    // Only render the label if inputValue is empty
    // if (inputValue === "") {
    //   return labelText.split("").map((char, index) => (
    //     <span key={index} className="label-char" style={{ "--index": index }}>
    //       {char}
    //     </span>
    //   ));
    // }
    // Return null or an empty fragment if inputValue is not empty
    return null;
  };

  return (
    <div className="wave-group">
      <input
        required
        type="text"
        className="input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onDoubleClick={handleDoubleClick}
        readOnly={!isEditable}
      />
      <label className="label">{renderLabelChars()}</label>
    </div>
  );
};

export default Title;
