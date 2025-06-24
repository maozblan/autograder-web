import * as Autograder from "../autograder/base.js";
import * as Render from "./render.js";
import * as Routing from "./routing.js";

function init() {
    Routing.addRoute(/^server\/docs$/, handlerDocs, "API Documentation");
}

function handlerDocs(path, params, context, container) {
    Routing.setTitle("API Documentation", "API Documentation");

    Autograder.Server.describe()
        .then(function(result) {
            container.innerHTML = `
                <div class="api-docs">
                	<div class="endpoints">
                        <h1>Endpoints</h1>
                        <input type="text" placeholder="Filter Endpoints">
                        <div class="scrollable">
                            ${displayEndpoints(result.endpoints)}
                        </div>
                    </div>
                	<div class="types">
                        <h1>Types</h1>
                        <input type="text" placeholder="Filter Types">
                        <div class="scrollable">
                            ${displayTypes(result.types)}
                        </div>
                    </div>
                </div>
            `;

            container.querySelector(".endpoints input").addEventListener("input", function(event) {
                container.querySelectorAll(".endpoint").forEach(function(endpointDiv) {
                    let endpoint = endpointDiv.getAttribute("data-endpoint");
                    if (endpoint.toLowerCase().includes(event.target.value.toLowerCase())) {
                        endpointDiv.classList.remove("hidden");
                    } else {
                        endpointDiv.classList.add("hidden");
                    }
                });
            });

            container.querySelector(".types input").addEventListener("input", function(event) {
                container.querySelectorAll(".type").forEach(function(typeDiv) {
                    let type = typeDiv.getAttribute("data-type");
                    if (type.toLowerCase().includes(event.target.value.toLowerCase())) {
                        typeDiv.classList.remove("hidden");
                    } else {
                        typeDiv.classList.add("hidden");
                    }
                });
            });
        })
        .catch(function (message) {
            console.error(message);
            container.innerHTML = Render.autograderError(message);
        })
    ;
}

function displayEndpoints(endpointData) {
    let endpoints = [];

    Object.entries(endpointData).forEach(function([endpoint, data]) {
        let args = {
            [Routing.PARAM_TARGET_ENDPOINT]: endpoint,
        };

        let inputTypes = Render.tableFromDictionaries({
            head: [["name", "Name"], ["type", "Type"]],
            body: data.input,
        });

        let outputTypes = Render.tableFromDictionaries({
            head: [["name", "Name"], ["type", "Type"]],
            body: data.output,
        });

        endpoints.push(`
            <div class='endpoint' data-endpoint='${endpoint}'>
                <a href="${Routing.formHashPath(Routing.PATH_SERVER_CALL_API, args)}">
                    <h3>${endpoint}</h3>
                </a>
                <p>${data.description}</p>
                <div class="details">
                    <div>
                        <h4>Input</h4>
                        ${inputTypes}
                    </div>
                    <div>
                        <h4>Output</h4>
                        ${outputTypes}
                    </div>
                </div>
            </div>
        `);
    });

    return endpoints.join("\n");
}

function displayTypes(typeData) {
    let types = [];

    Object.entries(typeData).forEach(function([type, data]) {
        let fieldData = "";
        if (data.fields) {
            let fieldTypes = Render.tableFromDictionaries({
                head: [["name", "Name"], ["type", "Type"]],
                body: data.fields,
            });

            fieldData = `
            	<div class="details">
                    <div>
                    <h4>Fields</h4>
                    ${fieldTypes}
                    </div>
                </div>
            `;
        }

        types.push(`
            <div class='type' data-type='${type}'>
                <h3>${type}</h3>
                <p>${data.description ?? ""}</p>
                <h4>Category</h4>
                <p>${data.category}</p>
                ${fieldData}
            </div>
        `);
    });

    return types.join("\n");
}

export {
    init,
};
