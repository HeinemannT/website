export const camundaModdleDescriptor = {
    "name": "Camunda",
    "uri": "http://camunda.org/schema/1.0/bpmn",
    "prefix": "camunda",
    "xml": { "tagAlias": "lowerCase" },
    "associations": [],
    "types": [
        { "name": "Topic", "isAbstract": true, "extends": ["bpmn:ServiceTask"], "properties": [{ "name": "topic", "isAttr": true, "type": "String" }, { "name": "type", "isAttr": true, "type": "String" }] },
        { "name": "Form", "isAbstract": true, "extends": ["bpmn:UserTask"], "properties": [{ "name": "formKey", "isAttr": true, "type": "String" }, { "name": "formData", "type": "FormData" }] },
        { "name": "FormData", "superClass": ["Element"], "properties": [{ "name": "fields", "isMany": true, "type": "FormField" }] },
        { "name": "FormField", "superClass": ["Element"], "properties": [{ "name": "id", "isAttr": true, "type": "String" }, { "name": "label", "isAttr": true, "type": "String" }, { "name": "type", "isAttr": true, "type": "String" }, { "name": "validation", "type": "Validation" }, { "name": "values", "isMany": true, "type": "Value" }] },
        { "name": "Validation", "superClass": ["Element"], "properties": [{ "name": "constraints", "isMany": true, "type": "Constraint" }] },
        { "name": "Constraint", "superClass": ["Element"], "properties": [{ "name": "name", "isAttr": true, "type": "String" }, { "name": "config", "isAttr": true, "type": "String" }] },
        { "name": "Value", "superClass": ["Element"], "properties": [{ "name": "id", "isAttr": true, "type": "String" }, { "name": "name", "isAttr": true, "type": "String" }] },
        { "name": "Properties", "superClass": ["Element"], "meta": { "allowedIn": ["bpmn:ExtensionElements"] }, "properties": [{ "name": "values", "isMany": true, "type": "Property" }] },
        { "name": "Property", "superClass": ["Element"], "properties": [{ "name": "id", "isAttr": true, "type": "String" }, { "name": "name", "isAttr": true, "type": "String" }, { "name": "value", "isAttr": true, "type": "String" }] }
    ]
}
