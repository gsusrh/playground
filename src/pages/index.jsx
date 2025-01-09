// /pages/playground.js
import { useState, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { run, transformCode } from "../lib/code/run";

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

function Playground() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const monacoRef = useRef(null);

  function handleEditorDidMount(monaco) {
    monacoRef.current = monaco;
  }

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

  return (
    <>
      <Head>
        <title>JavaScript Playground</title>
      </Head>

      <div className="min-h-screen bg-gray-900">
        <nav className="bg-gray-800 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">JavaScript Playground</h1>
            <button
              onClick={RunCode}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Ejecutar (Ctrl + Enter)
            </button>
          </div>
        </nav>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor de entrada */}
            <div className="bg-gray-800 rounded-lg overflow-hidden h-[600px]">
              <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={RunCode}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  suggestOnTriggerCharacters: true,
                }}
              />
            </div>

            {/* Editor de salida */}
            <div className="bg-gray-800 rounded-lg overflow-hidden h-[600px]">
              {/* <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={output}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'off',
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  domReadOnly: true,
                  contextmenu: false,
                }}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Playground;