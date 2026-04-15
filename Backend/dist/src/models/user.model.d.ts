import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    plan: "free" | "pro" | "premium";
    avatar: string;
    isVerified: boolean;
    name?: string | null;
    password?: string | null;
    otpCode?: string | null;
    otpExpiresAt?: NativeDate | null;
    email?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    plan: "free" | "pro" | "premium";
    avatar: string;
    isVerified: boolean;
    name?: string | null;
    password?: string | null;
    otpCode?: string | null;
    otpExpiresAt?: NativeDate | null;
    email?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    plan: "free" | "pro" | "premium";
    avatar: string;
    isVerified: boolean;
    name?: string | null;
    password?: string | null;
    otpCode?: string | null;
    otpExpiresAt?: NativeDate | null;
    email?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    plan: "free" | "pro" | "premium";
    avatar: string;
    isVerified: boolean;
    name?: string | null;
    password?: string | null;
    otpCode?: string | null;
    otpExpiresAt?: NativeDate | null;
    email?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    plan: "free" | "pro" | "premium";
    avatar: string;
    isVerified: boolean;
    name?: string | null;
    password?: string | null;
    otpCode?: string | null;
    otpExpiresAt?: NativeDate | null;
    email?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    plan: "free" | "pro" | "premium";
    avatar: string;
    isVerified: boolean;
    name?: string | null;
    password?: string | null;
    otpCode?: string | null;
    otpExpiresAt?: NativeDate | null;
    email?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    plan: "free" | "pro" | "premium";
    avatar: string;
    isVerified: boolean;
    name?: string | null;
    password?: string | null;
    otpCode?: string | null;
    otpExpiresAt?: NativeDate | null;
    email?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    plan: "free" | "pro" | "premium";
    avatar: string;
    isVerified: boolean;
    name?: string | null;
    password?: string | null;
    otpCode?: string | null;
    otpExpiresAt?: NativeDate | null;
    email?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map