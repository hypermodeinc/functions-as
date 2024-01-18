@json
export class DQLResponse<T> {
    data!: T;
    // TODO: errors, extensions
}

@json
export class DQLMutationResponse {
    code!: string;
    message!: string;
    queries: string | null = null;
    uids!: Map<string, string>;
}
