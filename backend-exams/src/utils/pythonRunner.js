const { spawn } = require('child_process');
const path = require('path');

exports.runPythonScript = (type, filePath) => {
  return new Promise((resolve, reject) => {
    // À adapter avec ton vrai script !
    const scriptName = type === "exam" ? "analyse_llm.py" : "analyse_syllabus.py";
    const scriptPath = path.join(__dirname, "../../Project_Exams/", scriptName);
    const py = spawn('python', [scriptPath, filePath]);

    let data = "";
    py.stdout.on('data', (chunk) => { data += chunk.toString(); });
    py.stderr.on('data', (err) => { console.error("PYTHON ERR:", err.toString()); });

    py.on('close', (code) => {
      if (code !== 0) return reject("Python script failed");
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({ raw: data });
      }
    });
  });
};
