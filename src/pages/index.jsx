import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

export default function Runjs() {
  const [code, setCode] = useState("// Escribe tu código aquí");
  const [consoleOutput, setConsoleOutput] = useState("");

  useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (message) => {
      setConsoleOutput((prevOutput) => prevOutput + message + "\n");
      originalConsoleLog(message);
    };
    
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const runCode = () => {
    try {
      // Limpiar la consola antes de ejecutar
      setConsoleOutput("");
      eval(code);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen p-8">
      <div className="flex flex-col h-full">
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          defaultValue={code}
          onChange={(value) => setCode(value)}
        />
        <button onClick={runCode} className="bg-blue-500 text-white p-2 mt-2">Ejecutar Código</button>
        <div className="bg-black text-white p-2 mt-2 h-40 overflow-y-auto">
          <pre>{consoleOutput}</pre>
        </div>
      </div>
    </div>
  );
}
