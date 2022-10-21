import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef();
  useEffect(() => {
    async function init() {
      editorRef.current = CodeMirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        {
          mode: {
            name: "javascript",
            json: true,
          },
          theme: "monokai",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      // on method is provided by codemirror
      editorRef.current.on("change", (instance, changes) => {
        const code = instance.getValue();
        onCodeChange(code);
        const { origin } = changes;
        if (origin !== 'setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
      
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
        if (code !== null){
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  }, [socketRef.current]);

  return <textarea id="realTimeEditor"></textarea>;
};

export default Editor;
