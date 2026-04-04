import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bidSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    minimumSalary: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const jobSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        salary: {
            type: Number,
            required: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        remote: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            default: "Other"
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bids: [bidSchema],
        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                username: String,
                profilePic: String,
                text: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }
);

export default mongoose.model("Job", jobSchema);
