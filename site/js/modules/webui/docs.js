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

            document.querySelector(".endpoints input").addEventListener("input", function(event) {
                document.querySelectorAll(".endpoint").forEach(function(endpointDiv) {
                    let tag = endpointDiv.getAttribute("data-endpoint");
                    if (tag.toLowerCase().includes(event.target.value.toLowerCase())) {
                        endpointDiv.classList.remove("hidden");
                    } else {
                        endpointDiv.classList.add("hidden");
                    }
                });
            });

            document.querySelector(".types input").addEventListener("input", function(event) {
                document.querySelectorAll(".type").forEach(function(typeDiv) {
                    let tag = typeDiv.getAttribute("data-type");
                    if (tag.toLowerCase().includes(event.target.value.toLowerCase())) {
                        endpointDiv.classList.remove("hidden");
                    } else {
                        endpointDiv.classList.add("hidden");
                    }
                })
            });
        })
        .catch(function (message) {
            container.innerHTML = Render.autograderError(message);
        });
}

function displayEndpoints(endpointData) {
    let html = "";

    Object.entries(endpointData).forEach(function([endpoint, data]) {
        const args = {
            [Routing.PARAM_TARGET_ENDPOINT]: endpoint,
        };

        html += `
            <div class='endpoint' data-endpoint='${endpoint}'>
                <a href="${Routing.formHashPath(Routing.PATH_SERVER_CALL_API, args)}"><h3>${endpoint}</h3></a>
                <p>${data.description}</p>
                <div class="details">
                    <div>
                        <h4>Input</h4>
                        ${
                            Render.tableFromDictionaries({
                                head: [["name", "Name"], ["type", "Type"]],
                                body: data.input,
                            })
                        }
                    </div>
                    <div>
                        <h4>Output</h4>
                        ${
                            Render.tableFromDictionaries({
                                head: [["name", "Name"], ["type", "Type"]],
                                body: data.output,
                            })
                        }
                    </div>
                </div>
            </div>
        `;
    });

    return html;
}

function displayTypes(typeData) {
    let html = ""

    Object.entries(typeData).forEach(function([type, data]) {
        html += `
            <div class='type' data-type='${type}'>
                <h3>${type}</h3>
                <p>${data.description ?? ""}</p>
                <h4>Category</h4>
                <p>${data.category}</p>
        `;

        if (data.fields) {
            html += `
            	<div class="details">
                    <div>
                    <h4>Fields</h4>
                    ${
                        Render.tableFromDictionaries({
                            head: [["name", "Name"], ["type", "Type"]],
                            body: data.fields,
                        })
                    }
                    </div>
                </div>
            `;
        }

        html += `</div>`;
    });

    return html;
}

export {
    init,
};
