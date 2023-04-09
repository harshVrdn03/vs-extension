const vscode = require("vscode");
const fs = require("fs");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
function activate(context) {
  console.log('Congratulations, your extension "askus" is now active!');

  let disposable = vscode.commands.registerCommand(
    "askus.helloWorld",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }
      const selectedText = editor.document.getText(editor.selection);
      if (!selectedText) {
        vscode.window.showErrorMessage("No text selected");
        return;
      }
      try {
        const configuration = new Configuration({
          apiKey: process.env.API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: selectedText,
          max_tokens: 2000,
          temperature: 0,
        });

        const rootPath = vscode.workspace.rootPath;
        const fileName = "output.txt";
        const filePath = rootPath + "/" + fileName;
        const t = response.data.choices[0].text;
        console.log(t);
        fs.writeFile(filePath, t, (err) => {
          if (err) {
            vscode.window.showErrorMessage(
              "Failed to write file: " + err.message
            );
          } else {
            vscode.window.showInformationMessage(
              "Selected text saved to: " + fileName
            );
          }
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error: " + error.message);
      }
      vscode.window.showInformationMessage(selectedText);
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
