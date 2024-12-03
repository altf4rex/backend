import mongoose, { Schema, Document } from "mongoose";

// Interface extending the default Mongoose Document with custom methods
export interface IPage extends Document {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;

    // Custom method for validation
    validatePage: () => void;
}

const PageSchema = new Schema<IPage>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
});

// Custom validation method added to the schema
PageSchema.methods.validatePage = function () {
    if (!this.title || !this.content) {
        throw new Error("Title and content are required");
    }
};

export default mongoose.model<IPage>("Page", PageSchema);


