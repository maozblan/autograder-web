import * as Autograder from "../autograder/base.js";
import * as Render from "./render.js";
import * as Routing from "./routing.js";

function init() {
    Routing.addRoute(/^docs$/, handlerDocs, "API Documentation");
    Routing.addRoute(/^docs\/endpoints$/, handlerEndpoints, "API Endpoints");
    Routing.addRoute(/^docs\/types$/, handlerTypes, "API Types");
}

function handlerDocs(path, params, context, container) {
    Routing.setTitle("API Documentation", "API Documentation");

    let html = `
        <ul>
            <li><a href="${Routing.formHashPath('docs/endpoints')}">Endpoints</a></li>
            <li><a href="${Routing.formHashPath('docs/types')}">Types</a></li>
        </ul>
    `;

    container.innerHTML = html;
}

function handlerEndpoints(path, params, context, container) {
    Routing.setTitle("API Documentation", "API Documentation");

    // metadata/describe display
    Autograder.Metadata.describe()
        .then(function(result) {
            let html = Render.comboBox({id: "endpoint-combo-box", options: Object.keys(result.endpoints)});
            html += displayEndpoints(result.endpoints)
            container.innerHTML = html;

            createComboBoxCallback("endpoint");
        })
        .catch(function (message) {
            container.innerHTML = Render.autograderError(message);
        });
}

function displayEndpoints(endpointData) {
    let html = "<h1>Endpoints</h1>";
    Object.entries(endpointData).forEach(function([endpoint, data]) {
        html += `
            <div class='endpoint' data-tag='${endpoint}'>
                <h3>${endpoint}</h3>
                <p>${data.description}</p>
                <h4>Input</h4>
                ${
                    Render.table({
                        head: ["Name", "Type"],
                        body: data.input.map((input) => [input.name, input.type]),
                        name: endpoint + "-input",
                    })
                }
                <h4>Output</h4>
                ${
                    Render.table({
                        head: ["Name", "Type"],
                        body: data.output.map((output) => [output.name, output.type]),
                        name: endpoint + "-output",
                    })
                }
            </div>
        `;
    });
    return html;
}

function handlerTypes(path, params, context, container) {
    Routing.setTitle("API Types", "API Types");

    // metadata/describe display
    Autograder.Metadata.describe()
        .then(function(result) {
            let html = Render.comboBox({id: "type-combo-box", options: Object.keys(result.types)});
            html += displayTypes(result.types);
            container.innerHTML = html;

            createComboBoxCallback("type");
        })
        .catch(function (message) {
            container.innerHTML = Render.autograderError(message);
        });
}


function displayTypes(typeData) {
    let html = "<h1>Types</h1>";
    Object.entries(typeData).forEach(function([type, data]) {
        html += `
            <div class='type' data-tag='${type}'>
                <h3>${type}</h3>
                <p>${data.description ?? ""}</p>
                <h4>Category</h4>
                <p>${data.category}</p>
        `;

        if (!data.fields) return;
        html += `
                <h4>Fields</h4>
            ${
                Render.table({
                    head: ["Name", "Type"],
                    body: data.fields.map((field) => [field.name, field.type]),
                    name: type + "-fields",
                })
            }
        `;
    });
    return html;
}

function createComboBoxCallback(id) {
    document.getElementById(`${id}-combo-box`).addEventListener("change", function(event) {
        const selection = event.target.value;
        document.querySelector(`div.${id}[data-tag='${selection}']`).scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
}

export {
    init,
};
