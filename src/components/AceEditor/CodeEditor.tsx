"use client";
import AceEditor from "react-ace";

// Static imports for themes and a few common modes
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-error_marker";
import "ace-builds/src-noconflict/ext-keybinding_menu";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-settings_menu";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-r";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/csharp";
import "ace-builds/src-noconflict/snippets/dart";
import "ace-builds/src-noconflict/snippets/golang";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/kotlin";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/r";
import "ace-builds/src-noconflict/snippets/ruby";
import "ace-builds/src-noconflict/snippets/rust";
import "ace-builds/src-noconflict/snippets/sql";
import "ace-builds/src-noconflict/snippets/swift";
import "ace-builds/src-noconflict/snippets/typescript";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

const MAX_LENGTH = 4000;
interface CodeEditorProps {
  className?: string | undefined;
  value?: string;
  onChange?: ((value: string, event?: any) => void) | undefined;
  language: string;
  placeholder?: string;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor = ({
  className,
  value,
  onChange,
  language,
  placeholder,
  readOnly = false,
  height = "22rem",
}: CodeEditorProps) => {
  const { theme } = useTheme();

  const aceEditorRef = useRef<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleEditorChange = (value: string) => {
    if (copied) {
      setCopied(false);
    }
    const editor = aceEditorRef.current?.editor;
    if (editor && value.length > MAX_LENGTH) {
      const newValue = value.substring(0, MAX_LENGTH);
      editor.getSession().setValue(newValue);
      editor.navigateFileEnd();
      editor.clearSelection();

      if (onChange) {
        onChange(newValue);
      }
      toast.error(`최대 ${MAX_LENGTH}자까지 입력할 수 있습니다.`);
    } else {
      if (onChange) {
        onChange(value);
      }
    }
  };

  useEffect(() => {
    const editor = aceEditorRef.current?.editor;
    return () => {};
  }, []);

  function onClickCopy() {
    const editor = aceEditorRef.current?.editor;
    const value = editor.getSession().getValue();
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("성공적으로 복사되었습니다.");
  }

  return (
    <div className="group relative w-full">
      <div className="absolute right-2 top-2 z-10 opacity-100 transition-opacity group-hover:opacity-100">
        <Button
          onClick={onClickCopy}
          type="button"
          variant="outline"
          size="icon-sm"
        >
          {copied ? (
            <CopyCheckIcon className="h-5 w-5 text-primary" />
          ) : (
            <CopyIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
      <AceEditor
        ref={aceEditorRef}
        readOnly={readOnly}
        className={className}
        mode={language.toLowerCase()}
        width="100%"
        height={height}
        theme={theme === "dark" ? "tomorrow_night_eighties" : "chrome"}
        name="UNIQUE_ID_OF_DIV"
        value={value}
        placeholder={placeholder}
        onChange={handleEditorChange}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        editorProps={{ $blockScrolling: true }}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
