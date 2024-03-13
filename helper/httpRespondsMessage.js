import { StatusCodes } from "http-status-codes";

function getSuccess(message, data) {
    return {
        result: "success",
        statusCode: StatusCodes.OK,
        message: message,
        data: data,
    };
}

function created(message, data) {
    return {
        result: "created",
        statusCode: StatusCodes.CREATED,
        message: message,
        data: data,
    };
}

function badRequest(message) {
    return {
        result: "Bad Request",
        statusCode: StatusCodes.BAD_REQUEST,
        message: message,
    };
}

function internalServerError(message) {
    return {
        result: "Internal Server Error",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: message,
    };
}

function deleteSuccess(message) {
    return {
        result: "success",
        statusCode: StatusCodes.OK,
        message: message,
    };
}

function notFound(message) {
    return {
        result: "not found",
        statusCode: StatusCodes.NOT_FOUND,
        message: message,
    };
}

function unauthorized(message) {
    return {
        result: "unauthorized",
        statusCode: StatusCodes.UNAUTHORIZED,
        message: message,
    };
}

function forbidden(message) {
    return {
        result: "forbidden",
        statusCode: StatusCodes.FORBIDDEN,
        message: message,
    };
}

function conflict(message) {
    return {
        result: "conflict",
        statusCode: StatusCodes.CONFLICT,
        message: message,
    };
}

export default {
    getSuccess,
    created,
    badRequest,
    internalServerError,
    deleteSuccess,
    notFound,
    unauthorized,
    forbidden,
    conflict,
};
