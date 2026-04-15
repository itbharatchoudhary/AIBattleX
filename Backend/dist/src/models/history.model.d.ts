import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    result: any;
    userId: mongoose.Types.ObjectId;
    problem: string;
    timestamp: NativeDate;
    models?: {
        modelA?: string | null;
        modelB?: string | null;
        judgeModel?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    result: any;
    userId: mongoose.Types.ObjectId;
    problem: string;
    timestamp: NativeDate;
    models?: {
        modelA?: string | null;
        modelB?: string | null;
        judgeModel?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    result: any;
    userId: mongoose.Types.ObjectId;
    problem: string;
    timestamp: NativeDate;
    models?: {
        modelA?: string | null;
        modelB?: string | null;
        judgeModel?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    result: any;
    userId: mongoose.Types.ObjectId;
    problem: string;
    timestamp: NativeDate;
    models?: {
        modelA?: string | null;
        modelB?: string | null;
        judgeModel?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    result: any;
    userId: mongoose.Types.ObjectId;
    problem: string;
    timestamp: NativeDate;
    models?: {
        modelA?: string | null;
        modelB?: string | null;
        judgeModel?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    result: any;
    userId: mongoose.Types.ObjectId;
    problem: string;
    timestamp: NativeDate;
    models?: {
        modelA?: string | null;
        modelB?: string | null;
        judgeModel?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    result: any;
    userId: mongoose.Types.ObjectId;
    problem: string;
    timestamp: NativeDate;
    models?: {
        modelA?: string | null;
        modelB?: string | null;
        judgeModel?: string | null;
    } | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    result: any;
    userId: mongoose.Types.ObjectId;
    problem: string;
    timestamp: NativeDate;
    models?: {
        modelA?: string | null;
        modelB?: string | null;
        judgeModel?: string | null;
    } | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=history.model.d.ts.map