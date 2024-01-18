@json
export class GQLResponse<T> {
    data!: T;
    extensions: GQLExtensions | null = null;
    // TODO: errors
}

@json
class GQLExtensions {
    touched_uids: u32 = 0;
    tracing!: GQLTracing;
}

@json
class GQLTracing {
    version!: u32;
    startTime!: Date
    endTime!: Date
    duration!: u32;
    execution: GQLExecution | null = null;
}

@json
class GQLExecution {
    resolvers!: GQLResolver[];
}

@json
class GQLResolver {
    path!: string[];
    parentType!: string;
    fieldName!: string;
    returnType!: string;
    startOffset!: u32;
    duration!: u32;
    dgraph!: GQLDgraph[];
}

@json
class GQLDgraph {
    label!: string;
    startOffset!: u32;
    duration!: u32;
}
