import { useState, useRef, useCallback, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import { run, transformCode } from "../lib/code/run";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

function Playground() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState([]);
  const monacoRef = useRef(null);

  function handleEditorDidMount(monaco) {
    monacoRef.current = monaco;
  }

  const formatOutputForDisplay = useCallback((results) => {
    if (!Array.isArray(results) || results.length === 0) return "";

    return results
      .map((result) => {
        if (result.type === "error") {
          return `${result.element.content}`;
        }
        return `${result.element.content}`;
      })
      .join("\n");
  }, []);

  async function RunCode(e) {
    setOutput("");
    try {
      const tranformed = transformCode(e);

      const element = await run(tranformed);

      setOutput(element);
    } catch (e) {
      console.log(e);
      setOutput([{ element: { content: e.message }, type: "error" }]);
    }
    setCode(e);
  }

  // Crear versión debounced de RunCode
  const debouncedRunCode = useCallback(

    debounce((value) => {
      RunCode(value);
    }, 250)

  ,[]);

  // Limpiar el debounce cuando el componente se desmonte
  useEffect(() => {
    return () => {
      debouncedRunCode.cancel();
    };
  }, [debouncedRunCode]);

  // Función para manejar los cambios del editor
  const handleEditorChange = useCallback((value) => {
    setCode(value); // Actualizar el código inmediatamente
    debouncedRunCode(value); // Ejecutar el código con debounce
  }, [debouncedRunCode]);

  return (
    <>
      <Head>
        <title>JavaScript Playground</title>
      </Head>

      <div className="min-h-screen bg-black">
        <div className="w-full h-screen flex">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange} // Cambiar a handleEditorChange
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              suggestOnTriggerCharacters: true,
            }}
          />

          <div className="w-[4px] h-full bg-[#3b3b3b]"></div>

          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={formatOutputForDisplay(output)}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "off",
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              domReadOnly: true,
              contextmenu: false,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Playground;