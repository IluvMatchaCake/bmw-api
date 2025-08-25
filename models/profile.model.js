// models/profile.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const ProfileSchema = new Schema(
    {
        // One-to-one link to the User
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,   // ensures one profile per user
            index: true,
        },

        displayName: {
            type: String,
            trim: true,
            maxlength: 60,
            default: "",
        },

        avatarUrl: {
            type: String,
            trim: true,
            default: "",
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 280,
            default: "",
        },
    },
    { timestamps: true }
);

// Clean JSON output
ProfileSchema.set("toJSON", {
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model("Profile", ProfileSchema);
