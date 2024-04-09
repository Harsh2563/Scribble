import React, { useState } from "react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { EditorContent } from "@tiptap/react";
import Link from "@tiptap/extension-link";

import { Extension } from "@tiptap/react";
import "../../styles.scss";
import { useEditor, FloatingMenu } from "@tiptap/react";
import { UpdateNotes } from "../../integration/server";
import { useCallback } from "react";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Youtube from "@tiptap/extension-youtube";
import Bold from "@tiptap/extension-bold";
import { useEffect } from "react";

import "./editor.css";

import { IconContext } from "react-icons";
import { LuHeading1 } from "react-icons/lu";
import { LuHeading2 } from "react-icons/lu";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddLinkIcon from "@mui/icons-material/AddLink";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import SubscriptIcon from "@mui/icons-material/Subscript";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import YouTubeIcon from "@mui/icons-material/YouTube";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { updateNote } from "../../appwrite/api";

// import renderItems from "./suggestion/renderitems";

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

// Register the languages with lowlight
lowlight.register("css", css);
// console.log("====================================");
// console.log(lowlight.registered("css"));
// console.log("====================================");

export const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: fontSize + "px" })
            .run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };
  const setFontSize = () => {
    const fontSize = window.prompt("Enter font size (e.g., 16):");
    if (fontSize) {
      editor.chain().focus().setFontSize(fontSize).run();
    }
  };

  const unsetFontSize = () => {
    editor.chain().focus().unsetFontSize().run();
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  return (
    <div className="menu-bar">
      <button
        onClick={() =>
          editor.chain().focus().toggleCodeBlock({ language: "js" }).run()
        }
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        <CodeIcon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <FormatBoldIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <FormatItalicIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <FormatUnderlinedIcon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <FormatStrikethroughIcon />
      </button>

      {/* <button onClick={setFontSize}>
        <TextIncreaseIcon />
      </button>
      <button onClick={unsetFontSize}>
        <TextDecreaseIcon />
      </button> */}

      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={editor.isActive("subscript") ? "is-active" : ""}
      >
        <SubscriptIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={editor.isActive("superscript") ? "is-active" : ""}
      >
        <SuperscriptIcon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        <IconContext.Provider value={{ size: "25px" }}>
          <div>
            <LuHeading1 />
          </div>
        </IconContext.Provider>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <IconContext.Provider value={{ size: "25px" }}>
          <div>
            <LuHeading2 />
          </div>
        </IconContext.Provider>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <FormatListBulletedIcon />
      </button>

      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <BorderColorIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <div
            className={`orange-highlight ${editor.isActive("highlight", { color: "#ffc078" }) ? "is-active" : ""}`}
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "#ffc078" }).run()
            }
          >
            Orange
          </div>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <div
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "#8ce99a" }).run()
            }
            className={`green-highlight ${editor.isActive("highlight", { color: "#8ce99a" }) ? "is-active" : ""}`}
          >
            Green
          </div>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <div
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "#74c0fc" }).run()
            }
            className={`blue-highlight ${editor.isActive("highlight", { color: "#74c0fc" }) ? "is-active" : ""}`}
          >
            Blue
          </div>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <div
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "#b197fc" }).run()
            }
            className={`purple-highlight ${editor.isActive("highlight", { color: "#b197fc" }) ? "is-active" : ""}`}
          >
            Purple
          </div>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <div
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "#ffa8a8" }).run()
            }
            className={`red-highlight ${editor.isActive("highlight", { color: "#ffa8a8" }) ? "is-active" : ""}`}
          >
            red
          </div>
        </MenuItem>
      </Menu>

      <Button
        id="basic-button2"
        aria-controls={anchorEl2 ? "basic-menu2" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl2 ? "true" : undefined}
        onClick={handleClick2}
      >
        <AddLinkIcon />
      </Button>
      <Menu
        id="basic-menu2"
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button2",
        }}
      >
        <MenuItem onClick={handleClose}>
          <div onClick={addYoutubeVideo}>
            <YouTubeIcon />
          </div>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <div
            onClick={setLink}
            className={editor.isActive("link") ? "is-active" : ""}
          >
            <InsertLinkIcon />
          </div>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <div
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
          >
            <LinkOffIcon />
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

const EditorComponent = ({ content, id }) => {
  const [files, setFiles] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const updateNoteWithDebounce = useCallback(async (editor) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timerId = setTimeout(async () => {
      const jsoner = await editor.getJSON();
      const text = await editor.getText();
      const updated = await updateNote(id, jsoner);
    }, 500); // 500ms delay
    setDebounceTimer(timerId);
  }, []);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Underline,
      Subscript,
      Superscript,
      BulletList,
      FontSize,
      Highlight.configure({ multicolor: true }),
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      History,
      Image,
      Dropcursor,
      Youtube.configure({
        controls: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      updateNoteWithDebounce(editor);
    },
  });
  const [isEditable, setIsEditable] = React.useState(true);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);
  if (!content) return <div>Loading...</div>;

  return (
    <div className="editor">
      {editor && (
        <FloatingMenu
          className="floating-menu"
          editor={editor}
          tippyOptions={{ duration: 100 }}
        >
          <div
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            <IconContext.Provider value={{ size: "25px" }}>
              <div>
                <LuHeading1 />
              </div>
            </IconContext.Provider>
          </div>
          <div
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            <IconContext.Provider value={{ size: "25px" }}>
              <div>
                <LuHeading2 />
              </div>
            </IconContext.Provider>
          </div>
          <div
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            <FormatListBulletedIcon />
          </div>
        </FloatingMenu>
      )}

      <div className="editor-menu-options">
        <div>
          <div
            className="lock-button"
            onClick={() => setIsEditable(!isEditable)}
          >
            {isEditable ? <LockOpenIcon /> : <LockIcon />}
          </div>
        </div>
        <div onClick={addImage}>
          <AddPhotoAlternateIcon />
        </div>
        <MenuBar editor={editor} />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default EditorComponent;
