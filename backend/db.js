import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    department: {
      type: String,
      default: null, // only for admins
    },
  },
  { timestamps: true }
);


const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true, // comes from AI
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    images: [
      {
        type: String, // URLs
      },
    ],

    aiMeta: {
      confidence: Number,
      modelVersion: String,
    },

    history: [
      {
        status: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// 🔥 Indexes (important)
complaintSchema.index({ department: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ userId: 1 });

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["status_update", "general"],
      default: "general",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User= mongoose.model("User",userSchema);
const Complaint= mongoose.model("Complaint",complaintSchema);
const Department= mongoose.model("Department",departmentSchema);
const Notification= mongoose.model("Notification",notificationSchema);
module.exports={
    User,
    Department,
    Complaint,
    Notification
}