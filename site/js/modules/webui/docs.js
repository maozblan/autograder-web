import * as Autograder from "../autograder/base.js";
import * as Render from "./render.js";
import * as Routing from "./routing.js";

function init() {
    Routing.addRoute(/^docs$/, handlerDocs, "API Documentation");
}

function handlerDocs(path, params, context, container) {
    Routing.setTitle("API Documentation", "API Documentation");
    Autograder.Docs.get()
        .then(function (result) {
            let html = "";
            Object.entries(result.endpoints).forEach(([endpoint, data]) => {
                html += `
                    <div class='endpoint'>
                        <h3>${endpoint}</h3>
                        <p>${data.description}</p>
                        <h4>Input</h4>
                        ${
                            Render.table({
                                head: [
                                    "Name",
                                    "Type",
                                ],
                                body: data.input.map((
                                    input,
                                ) => [input.name, input.type]),
                            })
                        }
                        <h4>Output</h4>
                        ${
                            Render.table({
                                head: [
                                    "Name",
                                    "Type",
                                ],
                                body: data.output.map((
                                    output,
                                ) => [output.name, output.type]),
                            })
                        }
                    </div>
                `;
            });
            container.innerHTML = html;
        })
        .catch(function (message) {
            container.innerHTML = Render.autograderError(message);
        });
}

export {
    init,
};
