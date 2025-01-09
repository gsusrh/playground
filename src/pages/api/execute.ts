import { NextApiRequest, NextApiResponse } from "next";
import { NodeVM } from "vm2";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body;  // El código que se pasa desde el frontend

  // Inicializamos un entorno seguro para ejecutar el código
  const vm = new NodeVM({
    console: "redirect",  // Captura las salidas de la consola
    sandbox: {},  // Un sandbox vacío para que no haya acceso a objetos globales
  });

  try {
    // Ejecutamos el código en el sandbox
    const result = vm.run(code);
    res.status(200).json({ result: result.toString() });

    console.log(code)
    console.log(result)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
