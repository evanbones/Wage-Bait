import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        isActive: {
            type: Boolean,
            default: true
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

// hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    const isHashed = this.password.startsWith('$2') && (this.password.length === 60 || this.password.length === 59);
    if (isHashed) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
