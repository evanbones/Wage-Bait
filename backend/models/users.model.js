import mongoose from "mongoose";

const Schema = mongoose.Schema;

const experienceSchema = new Schema({
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String
});

const educationSchema = new Schema({
    school: String,
    degree: String,
    fieldOfStudy: String,
    graduationYear: String
});

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: ""
        },
        skills: [String],
        experience: [experienceSchema],
        education: [educationSchema]
    }
);

userSchema.index({ username: "text", email: "text" });

export default mongoose.model("User", userSchema);
