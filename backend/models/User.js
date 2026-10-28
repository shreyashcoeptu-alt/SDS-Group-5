const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
      index: true,
      default: '',
    },
    batch: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      minlength: [4, 'Password must be at least 4 characters long'],
      select: false, // Prevents password from being returned in normal queries
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'student', 'admin', 'cafeteria_admin', 'staff'],
        message: '{VALUE} is not a valid role',
      },
      default: 'customer',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  // Only hash if not already bcrypt-hashed
  if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare entered credential with stored hashed password or student ID
userSchema.methods.matchPassword = async function (enteredCredential) {
  if (!enteredCredential) return false;
  
  // Direct studentId or email-prefix match
  if (this.studentId && this.studentId.toLowerCase() === enteredCredential.toLowerCase().trim()) {
    return true;
  }
  const emailPrefix = this.email ? this.email.split('@')[0].toLowerCase() : '';
  if (emailPrefix && emailPrefix === enteredCredential.toLowerCase().trim()) {
    return true;
  }

  // Bcrypt password comparison if password exists
  if (this.password) {
    try {
      return await bcrypt.compare(enteredCredential, this.password);
    } catch {
      return false;
    }
  }

  return false;
};

// Omit password when transforming to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
