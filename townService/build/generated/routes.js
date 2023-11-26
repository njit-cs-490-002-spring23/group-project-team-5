import { ValidationService, ValidateError, fetchMiddlewares } from '@tsoa/runtime';
import { TownsController } from './../src/town/TownsController';
const models = {
    "Town": {
        "dataType": "refObject",
        "properties": {
            "friendlyName": { "dataType": "string", "required": true },
            "townID": { "dataType": "string", "required": true },
            "currentOccupancy": { "dataType": "double", "required": true },
            "maximumOccupancy": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    "TownCreateResponse": {
        "dataType": "refObject",
        "properties": {
            "townID": { "dataType": "string", "required": true },
            "townUpdatePassword": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "TownCreateParams": {
        "dataType": "refObject",
        "properties": {
            "friendlyName": { "dataType": "string", "required": true },
            "isPubliclyListed": { "dataType": "boolean", "required": true },
            "mapFile": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "InvalidParametersError": {
        "dataType": "refObject",
        "properties": {
            "code": { "dataType": "undefined", "required": true },
            "message": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "TownSettingsUpdate": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "isPubliclyListed": { "dataType": "boolean" }, "friendlyName": { "dataType": "string" } }, "validators": {} },
    },
    "ConversationArea": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "topic": { "dataType": "string" },
            "occupantsByID": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": false,
    },
    "ViewingArea": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "video": { "dataType": "string" },
            "isPlaying": { "dataType": "boolean", "required": true },
            "elapsedTimeSec": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
};
const validationService = new ValidationService(models);
export function RegisterRoutes(app) {
    app.get('/towns', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.listTowns)), function TownsController_listTowns(request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TownsController();
            const promise = controller.listTowns.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/towns', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.createTown)), function TownsController_createTown(request, response, next) {
        const args = {
            request: { "in": "body", "name": "request", "required": true, "ref": "TownCreateParams" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TownsController();
            const promise = controller.createTown.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/towns/:townID', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.updateTown)), function TownsController_updateTown(request, response, next) {
        const args = {
            townID: { "in": "path", "name": "townID", "required": true, "dataType": "string" },
            townUpdatePassword: { "in": "header", "name": "X-CoveyTown-Password", "required": true, "dataType": "string" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "TownSettingsUpdate" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TownsController();
            const promise = controller.updateTown.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/towns/:townID', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.deleteTown)), function TownsController_deleteTown(request, response, next) {
        const args = {
            townID: { "in": "path", "name": "townID", "required": true, "dataType": "string" },
            townUpdatePassword: { "in": "header", "name": "X-CoveyTown-Password", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TownsController();
            const promise = controller.deleteTown.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/towns/:townID/conversationArea', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.createConversationArea)), function TownsController_createConversationArea(request, response, next) {
        const args = {
            townID: { "in": "path", "name": "townID", "required": true, "dataType": "string" },
            sessionToken: { "in": "header", "name": "X-Session-Token", "required": true, "dataType": "string" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ConversationArea" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TownsController();
            const promise = controller.createConversationArea.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/towns/:townID/viewingArea', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.createViewingArea)), function TownsController_createViewingArea(request, response, next) {
        const args = {
            townID: { "in": "path", "name": "townID", "required": true, "dataType": "string" },
            sessionToken: { "in": "header", "name": "X-Session-Token", "required": true, "dataType": "string" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ViewingArea" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TownsController();
            const promise = controller.createViewingArea.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZ2VuZXJhdGVkL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQWMsaUJBQWlCLEVBQWUsYUFBYSxFQUFrRCxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1SixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFNaEUsTUFBTSxNQUFNLEdBQXFCO0lBQzdCLE1BQU0sRUFBRTtRQUNKLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFlBQVksRUFBRTtZQUNWLGNBQWMsRUFBRSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLElBQUksRUFBQztZQUNyRCxRQUFRLEVBQUUsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUM7WUFDL0Msa0JBQWtCLEVBQUUsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUM7WUFDekQsa0JBQWtCLEVBQUUsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUM7U0FDNUQ7UUFDRCxzQkFBc0IsRUFBRSxLQUFLO0tBQ2hDO0lBRUQsb0JBQW9CLEVBQUU7UUFDbEIsVUFBVSxFQUFFLFdBQVc7UUFDdkIsWUFBWSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsSUFBSSxFQUFDO1lBQy9DLG9CQUFvQixFQUFFLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsSUFBSSxFQUFDO1NBQzlEO1FBQ0Qsc0JBQXNCLEVBQUUsS0FBSztLQUNoQztJQUVELGtCQUFrQixFQUFFO1FBQ2hCLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFlBQVksRUFBRTtZQUNWLGNBQWMsRUFBRSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLElBQUksRUFBQztZ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