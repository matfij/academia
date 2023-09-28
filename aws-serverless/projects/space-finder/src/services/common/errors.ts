export class MissingFieldError extends Error {
    constructor(missingField: string) {
        super(`Value for: ${missingField} required.`);
    }
}

export class ParsingError extends Error {
    constructor(data: string) {
        super(`Failed to parse: "${data}".`);
    }
}
