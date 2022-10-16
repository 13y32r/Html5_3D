/*******
 * @Author: 邹岱志
 * @Date: 2022-10-14 18:23:14
 * @LastEditTime: 2022-10-15 18:43:40
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\testWeb\myCodeEditorOnLine\codeEditor.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { dynamicImportTips } from "../../assist/dynamicImportTips.js";

function includeLinkStyle(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

class CodeEditor {
    constructor() {
        includeLinkStyle("../../threeSrc/libs/codemirror/codemirror.css");
        includeLinkStyle("../../threeSrc/libs/codemirror/theme/monokai.css");
        includeLinkStyle("../../threeSrc/libs/codemirror/addon/dialog.css");
        includeLinkStyle("../../threeSrc/libs/codemirror/addon/show-hint.css");
        includeLinkStyle("../../threeSrc/libs/codemirror/addon/tern.css");
        this.initClass();
    }

    async initClass() {
        let promiseArray = new Array();

        await dynamicImportTips("../../threeSrc/libs/codemirror/codemirror.js");

        promiseArray[0] = dynamicImportTips("../../threeSrc/libs/codemirror/mode/javascript.js");
        promiseArray[1] = dynamicImportTips("../../threeSrc/libs/codemirror/mode/glsl.js");
        promiseArray[2] = dynamicImportTips("../../threeSrc/libs/esprima.js");
        promiseArray[3] = dynamicImportTips("../../threeSrc/libs/codemirror/addon/dialog.js");
        promiseArray[4] = dynamicImportTips("../../threeSrc/libs/codemirror/addon/show-hint.js");
        promiseArray[5] = dynamicImportTips("../../threeSrc/libs/codemirror/addon/tern.js");

        await Promise.all(promiseArray);

        await dynamicImportTips("../../threeSrc/libs/acorn/acorn.js");
        await dynamicImportTips("../../threeSrc/libs/acorn/acorn_loose.js");
        await dynamicImportTips("../../threeSrc/libs/acorn/walk.js");

        await dynamicImportTips("../../threeSrc/libs/ternjs/polyfill.js");
        await dynamicImportTips("../../threeSrc/libs/ternjs/signal.js");
        await dynamicImportTips("../../threeSrc/libs/ternjs/tern.js");
        await dynamicImportTips("../../threeSrc/libs/ternjs/def.js");
        await dynamicImportTips("../../threeSrc/libs/ternjs/comment.js");
        await dynamicImportTips("../../threeSrc/libs/ternjs/infer.js");
        await dynamicImportTips("../../threeSrc/libs/ternjs/doc_comment.js");
        await dynamicImportTips("../../threeSrc/libs/tern-threejs/threejs.js");
        await dynamicImportTips("../../threeSrc/libs/signals.dynamic.js");

        let delay;
        // let currentMode;
        let currentMode = "javascript";
        let currentScript;
        let currentObject;

        var myCodeMirror = CodeMirror(document.body, {
            value: '',
            lineNumbers: true,
            matchBrackets: true,
            indentWithTabs: true,
            tabSize: 4,
            indentUnit: 4,
            hintOptions: {
                completeSingle: false
            }
        });

        myCodeMirror.setOption('theme', 'monokai');
        myCodeMirror.on('change', function () {

            if (myCodeMirror.state.focused === false) return;

            clearTimeout(delay);
            delay = setTimeout(function () {

                const value = myCodeMirror.getValue();

                if (!validate(value)) return;

                if (typeof (currentScript) === 'object') {

                    if (value !== currentScript.source) {

                        editor.execute(new SetScriptValueCommand(editor, currentObject, currentScript, 'source', value));

                    }

                    return;

                }

                if (currentScript !== 'programInfo') return;

                const json = JSON.parse(value);

                if (JSON.stringify(currentObject.material.defines) !== JSON.stringify(json.defines)) {

                    const cmd = new SetMaterialValueCommand(editor, currentObject, 'defines', json.defines);
                    cmd.updatable = false;
                    editor.execute(cmd);

                }

                if (JSON.stringify(currentObject.material.uniforms) !== JSON.stringify(json.uniforms)) {

                    const cmd = new SetMaterialValueCommand(editor, currentObject, 'uniforms', json.uniforms);
                    cmd.updatable = false;
                    editor.execute(cmd);

                }

                if (JSON.stringify(currentObject.material.attributes) !== JSON.stringify(json.attributes)) {

                    const cmd = new SetMaterialValueCommand(editor, currentObject, 'attributes', json.attributes);
                    cmd.updatable = false;
                    editor.execute(cmd);

                }

            }, 300);

        });

        // prevent backspace from deleting objects
        const wrapper = myCodeMirror.getWrapperElement();
        wrapper.addEventListener('keydown', function (event) {

            event.stopPropagation();

        });

        // validate

        const errorLines = [];
        const widgets = [];

        const validate = function (string) {

            let valid;
            let errors = [];

            return myCodeMirror.operation(function () {

                while (errorLines.length > 0) {

                    myCodeMirror.removeLineClass(errorLines.shift(), 'background', 'errorLine');

                }

                while (widgets.length > 0) {

                    myCodeMirror.removeLineWidget(widgets.shift());

                }

                //

                switch (currentMode) {

                    case 'javascript':

                        try {

                            const syntax = esprima.parse(string, { tolerant: true });
                            errors = syntax.errors;

                        } catch (error) {

                            errors.push({

                                lineNumber: error.lineNumber - 1,
                                message: error.message

                            });

                        }

                        for (let i = 0; i < errors.length; i++) {

                            const error = errors[i];
                            error.message = error.message.replace(/Line [0-9]+: /, '');

                        }

                        break;

                    case 'json':

                        errors = [];

                        jsonlint.parseError = function (message, info) {

                            message = message.split('\n')[3];

                            errors.push({

                                lineNumber: info.loc.first_line - 1,
                                message: message

                            });

                        };

                        try {

                            jsonlint.parse(string);

                        } catch (error) {

                            // ignore failed error recovery

                        }

                        break;

                    case 'glsl':

                        currentObject.material[currentScript] = string;
                        currentObject.material.needsUpdate = true;
                        signals.materialChanged.dispatch(currentObject.material);

                        const programs = renderer.info.programs;

                        valid = true;
                        const parseMessage = /^(?:ERROR|WARNING): \d+:(\d+): (.*)/g;

                        for (let i = 0, n = programs.length; i !== n; ++i) {

                            const diagnostics = programs[i].diagnostics;

                            if (diagnostics === undefined ||
                                diagnostics.material !== currentObject.material) continue;

                            if (!diagnostics.runnable) valid = false;

                            const shaderInfo = diagnostics[currentScript];
                            const lineOffset = shaderInfo.prefix.split(/\r\n|\r|\n/).length;

                            while (true) {

                                const parseResult = parseMessage.exec(shaderInfo.log);
                                if (parseResult === null) break;

                                errors.push({

                                    lineNumber: parseResult[1] - lineOffset,
                                    message: parseResult[2]

                                });

                            } // messages

                            break;

                        } // programs

                } // mode switch

                for (let i = 0; i < errors.length; i++) {

                    const error = errors[i];

                    const message = document.createElement('div');
                    message.className = 'esprima-error';
                    message.textContent = error.message;

                    const lineNumber = Math.max(error.lineNumber, 0);
                    errorLines.push(lineNumber);

                    myCodeMirror.addLineClass(lineNumber, 'background', 'errorLine');

                    const widget = myCodeMirror.addLineWidget(lineNumber, message);

                    widgets.push(widget);

                }

                return valid !== undefined ? valid : errors.length === 0;

            });

        };

        const server = new CodeMirror.TernServer({
            caseInsensitive: true,
            plugins: { threejs: null }
        });

        myCodeMirror.setOption('extraKeys', {
            'Ctrl-Space': function (cm) {

                server.complete(cm);

            },
            'Ctrl-I': function (cm) {

                server.showType(cm);

            },
            'Ctrl-O': function (cm) {

                server.showDocs(cm);

            },
            'Alt-.': function (cm) {

                server.jumpToDef(cm);

            },
            'Alt-,': function (cm) {

                server.jumpBack(cm);

            },
            'Ctrl-Q': function (cm) {

                server.rename(cm);

            },
            'Ctrl-.': function (cm) {

                server.selectName(cm);

            }
        });

        myCodeMirror.on('cursorActivity', function (cm) {

            if (currentMode !== 'javascript') return;
            server.updateArgHints(cm);

        });

        myCodeMirror.on('keypress', function (cm, kb) {

            if (currentMode !== 'javascript') return;
            const typed = String.fromCharCode(kb.which || kb.keyCode);
            if (/[\w\.]/.exec(typed)) {

                server.complete(cm);

            }

        });

        let btn = document.createElement("button");
        btn.innerHTML = "提交";
        document.body.appendChild(btn);

        btn.onclick = function () {
            eval(myCodeMirror.getValue());
        }
    }
}

export { CodeEditor };