import * as Autograder from "../autograder/base.js";
import * as Render from "./render.js";
import * as Routing from "./routing.js";

function init() {
    Routing.addRoute(/^docs$/, handlerDocs, "API Documentation");
}

function handlerDocs(path, params, context, container) {
    Routing.setTitle("API Documentation", "API Documentation");

    Autograder.Metadata.describe()
        .then(function(result) {
            let html = `
                <div class="api-docs">
                	<div class="endpoints">
                    	<input type="text" id="endpoint-filter" placeholder="Filter Endpoints">
                        ${displayEndpoints(result.endpoints)}
                    </div>
                	<div class="types">
                    	<input type="text" id="type-filter" placeholder="Filter Types">
                        ${displayTypes(result.types)}
                    </div>
                </div>
            `;

            container.innerHTML = html;

            document.querySelector("#endpoint-filter").addEventListener("input", function(event) {
                document.querySelectorAll(".endpoint").forEach(function(endpointDiv) {
                    let tag = endpointDiv.getAttribute("data-tag");
                    if (tag.toLowerCase().includes(event.target.value.toLowerCase())) {
                        endpointDiv.style.display = "";
                    } else {
                        endpointDiv.style.display = "none";
                    }
                })
            });
            document.querySelector("#type-filter").addEventListener("input", function(event) {
                document.querySelectorAll(".type").forEach(function(typeDiv) {
                    let tag = typeDiv.getAttribute("data-tag");
                    if (tag.toLowerCase().includes(event.target.value.toLowerCase())) {
                        typeDiv.style.display = "";
                    } else {
                        typeDiv.style.display = "none";
                    }
                })
            });
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
                <div class="details">
                    <div>
                        <h4>Input</h4>
                        ${
                            Render.table({
                                head: ["Name", "Type"],
                                body: data.input.map((input) => [input.name, input.type]),
                                name: endpoint + "-input",
                            })
                        }
                    </div>
                    <div>
                        <h4>Output</h4>
                        ${
                            Render.table({
                                head: ["Name", "Type"],
                                body: data.output.map((output) => [output.name, output.type]),
                                name: endpoint + "-output",
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
    let html = "<h1>Types</h1>";
    Object.entries(typeData).forEach(function([type, data]) {
        html += `
            <div class='type' data-tag='${type}'>
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
                        Render.table({
                            head: ["Name", "Type"],
                            body: data.fields.map((field) => [field.name, field.type]),
                            name: type + "-fields",
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
