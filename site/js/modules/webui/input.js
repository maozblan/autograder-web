const PATTERN_INT = /^int\d*$/;
const PATTERN_TARGET_USER = /^core\.Target((Course)|(Server))User$/;
const PATTERN_TARGET_SELF_OR = /^core\.Target((Course)|(Server))UserSelfOr[a-zA-Z]+$/;

const COURSE_USER_REFERENCE_LIST_FIELD_TYPE = '[]model.CourseUserReference';

// The set of valid types for a FieldType.
const validFieldTypes = [
    "checkbox",
    "email",
    "json",
    "number",
    "password",
    "select",
    "text",
    "textarea",
];

const standardTypes = [
    "bool",
    "string",
];

const standardTypePatterns = [
    PATTERN_INT,
];

// Returns whether a type is a standard type.
// Non-standard types are defaulted to JSON.
// The standard types that are currently supported can be found in the above constants.
function isStandardType(type) {
    if (standardTypes.includes(type)) {
        return true;
    }

    for (const pattern of standardTypePatterns) {
        if (pattern.test(type)) {
            return true;
        }
    }

    return false;
}

// A general representation of a user input field.
// The FieldType is responsible for generating and validating the HTML of a field.
class FieldType {
    #parsedType;

    constructor(
            context, name, displayName,
            {
                type = 'string', parsedType = undefined, required = false, placeholder = '',
                defaultValue = '', inputClasses = '', additionalAttributes = '', choices = [],
                labelBefore = true, extractInputFunc = undefined, inputValidationFunc = undefined,
            }) {
        // The name of the field.
        this.name = name;

        // The display name that will be shown to the user.
        this.displayName = displayName;

        // The field type.
        // Non-standard types are parsed to JSON.
        // If a non-standard type cannot be parsed to JSON,
        // a validation error is raised.
        this.type = type;

        // Flags the field requires user input.
        this.required = required;

        // The placeholder text for the input.
        this.placeholder = placeholder;

        // The default value for the field.
        // Fields with a "select" type should provide the name of the value that is selected.
        this.defaultValue = defaultValue;

        // Optional classes that are attached to the input.
        this.inputClasses = inputClasses;

        // Any additional attributes to the input field.
        // If the field is required, the required attribute will be added automatically.
        this.additionalAttributes = additionalAttributes;

        // A list of choices for a dropdown.
        // Only used when the parsedType is "select".
        this.choices = choices;

        // Determines the position of the HTML label with respect to the input.
        this.labelBefore = labelBefore;

        // A custom function for extracting the value from an input.
        // If a default value extraction cannot be inferred, the value is parsed using JSON.
        this.extractInputFunc = extractInputFunc;

        // A custom input validation function.
        // The validity state of the input is checked before calling this custom validation function.
        this.inputValidationFunc = inputValidationFunc;

        this.#parsedType = parsedType;
        if (this.#parsedType == undefined) {
            this.inferFieldInformation(context);
        }

        this.validate();
    }

    validate() {
        if ((this.name == undefined) || (this.name == '')) {
            console.error(`Input field cannot have an empty name: '${JSON.stringify(this)}'.`);
        }

        if ((this.displayName == undefined) || (this.displayName == '')) {
            console.error(`Input field cannot have an empty display name: '${JSON.stringify(this)}'.`);
        }

        if ((this.#parsedType == undefined) || (this.#parsedType == '')) {
            console.error(`Input field cannot have an empty parsed type: '${JSON.stringify(this)}'.`);
        }

        if (!this.isValidType()) {
            console.error(`Input field contains an invalid parsed type: '${JSON.stringify(this.#parsedType)}'.`);
        }
    }

    isValidType() {
        if (validFieldTypes.includes(this.#parsedType)) {
            return true;
        }

        return false;
    }

    // Using the context and the type,
    // infer the input type and field information.
    // This function must be called exactly once when the FieldType is created.
    inferFieldInformation(context) {
        if (this.type === "string") {
            this.#parsedType = "text";
        } else if (PATTERN_TARGET_SELF_OR.test(this.type)) {
            this.#parsedType = "email";
            this.placeholder = context.user.email;
        } else if (PATTERN_TARGET_USER.test(this.type)) {
            this.#parsedType = "email";
        } else if (PATTERN_INT.test(this.type)) {
            this.#parsedType = "number";
            this.inputClasses += ` pattern="\d*"`;
        } else if (this.type === "bool") {
            this.#parsedType = "checkbox";
            this.inputClasses += " checkbox-field";

            let value = "true";
            if (this.defaultValue != "") {
                value = this.defaultValue;
            }

            this.additionalAttributes += ` value="${value}"`;
            this.labelBefore = false;
        } else if (this.type === "select") {
            this.#parsedType = "select";
        } else if (this.type === "textarea") {
            this.#parsedType = "textarea";
        } else {
            this.#parsedType = "json";
            this.displayName += ` (expects: ${this.type})`;
        }

        // Due to the context credentials, remind the user the email and pass fields are optional.
        if (this.name === "user-email") {
            this.#parsedType = "email";
            this.placeholder = context.user.email;
        } else if (this.name === "user-pass") {
            this.#parsedType = "password";
            this.placeholder = "<current token>";
        }

        if ((this.required) && (this.placeholder === "")) {
            this.additionalAttributes += ' required';
            this.displayName += ` <span class="required-color">*</span>`;
        }
    }

    toHTML() {
        let listOfFieldHTML = [
            `<label for="${this.name}">${this.displayName}</label>`,
        ];

        let fieldInformation = `id="${this.name}" name="${this.name}" class="tertiary-color" ${this.additionalAttributes}`;

        if (this.#parsedType === "select") {
            let choices = this.choices;

            // Add a help message as the first choice of the select.
            choices.unshift(new SelectOption("", "-- Choose an Option --"));

            listOfFieldHTML.push(
                `
                    <select ${fieldInformation}>
                        ${getSelectChoicesHTML(choices, this.defaultValue)}
                    </select>
                `,
            );
        } else if (this.#parsedType === "textarea") {
            listOfFieldHTML.push(
                `
                    <textarea ${fieldInformation} placeholder="${this.placeholder}"></textarea>
                `,
            );
        } else {
            let htmlType = this.#parsedType;
            if (htmlType === "json") {
                htmlType = "text";
            }

            listOfFieldHTML.push(
                `<input type="${htmlType}" ${fieldInformation} placeholder="${this.placeholder}"/>`,
            );
        }

        if (!this.labelBefore) {
            listOfFieldHTML.reverse();
        }

        return `
            <div class="input-field ${this.inputClasses}">
                ${listOfFieldHTML.join("\n")}
            </div>
        `;
    }

    getFieldInstance(container) {
        let input = container.querySelector(`fieldset [name="${this.name}"]`);
        input.classList.add("touched");

        return new FieldInstance(input, this.#parsedType, this.extractInputFunc, this.inputValidationFunc);
    }
}

// The FieldInstance class is responsible for validating and getting the user input from a FieldType.
// Each FieldType is created once, but it creates a new FieldInstance whenever the user input is needed.
class FieldInstance {
    #parsedType;

    constructor(input, parsedType, extractInputFunc = undefined, inputValidationFunc = undefined) {
        // The input from the Input.FieldType's element.
        this.input = input;

        if (this.input == undefined) {
            throw new Error("<p>Cannot instantiate a field with an undefined input.</p>");
        }

        // See FieldType for field descriptions.
        this.#parsedType = parsedType;
        this.extractInputFunc = extractInputFunc;
        this.inputValidationFunc = inputValidationFunc;

        try {
            this.validate();
        } catch (error) {
            throw new Error(`<p>FieldType "${this.getFieldName()}": "${error.message}".</p>`);
        }

    }

    // Validate the value of the input.
    // Throws an error on invalid input values.
    validate() {
        if (!this.input.validity.valid) {
            throw new Error(`${this.input.validationMessage}`);
        }

        if (!this.input.checkValidity()) {
            throw new Error(`${this.input.validationMessage}`);
        }

        if (this.inputValidationFunc != undefined) {
            this.inputValidationFunc(this.input);
            return;
        }

        // Skip further validation if a custom extraction function is provided.
        if (this.extractInputFunc != undefined) {
            return;
        }

        if (this.input.value === "") {
            return;
        }

        if (this.#parsedType === "json") {
            // Throws an error on failure.
            JSON.parse(`${this.input.value}`);
        }
    }

    getFieldName() {
        return this.input.name;
    }

    // Get the value from the result.
    // Throws an error on validation errors.
    getFieldValue() {
        if (this.extractInputFunc) {
            return this.extractInputFunc(this.input);
        }

        if (this.input == undefined) {
            return undefined;
        }

        let value = undefined;
        if (this.input.type === "checkbox") {
            value = this.input.checked;
        } else if ((this.#parsedType === "json") || (this.#parsedType === "number")) {
            value = this.valueFromJSON();
        } else {
            value = this.input.value;
        }

        return value;
    }

    valueFromJSON() {
        if ((!this.input) || (!this.input.value) || (this.input.value === "")) {
            return "";
        }

        // The input has already been validated,
        // so parse will not throw an error.
        return JSON.parse(`${this.input.value}`);
    }
}

class SelectOption {
    constructor(value, displayName = value) {
        this.value = value;
        this.displayName = displayName;
    }

    toHTML(defaultValue) {
        let isSelected = '';
        if (this.value === defaultValue) {
            isSelected = ' selected';
        }

        return `<option value="${this.value}"${isSelected}>${this.displayName}</option>`;
    }
}

// Returns the HTML for the list of select choices.
function getSelectChoicesHTML(choices, defaultValue) {
    let choicesHTMLList = choices.map((choice) => (choice.toHTML(defaultValue)));

    return choicesHTMLList.join("\n");
}

export {
    FieldInstance,
    FieldType,
    SelectOption,

    COURSE_USER_REFERENCE_LIST_FIELD_TYPE,
};
