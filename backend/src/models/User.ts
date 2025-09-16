import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  healthGoals?: string[];
  medicalConditions?: string[];
  medications?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  dateOfBirth: { 
    type: Date,
    validate: {
      validator: function(date: Date) {
        return date <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  gender: { 
    type: String, 
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be either male, female, or other'
    }
  },
  healthGoals: {
    type: [String],
    default: [],
    validate: {
      validator: function(goals: string[]) {
        return goals.length <= 10;
      },
      message: 'Cannot have more than 10 health goals'
    }
  },
  medicalConditions: {
    type: [String],
    default: [],
    validate: {
      validator: function(conditions: string[]) {
        return conditions.length <= 20;
      },
      message: 'Cannot have more than 20 medical conditions'
    }
  },
  medications: {
    type: [String],
    default: [],
    validate: {
      validator: function(medications: string[]) {
        return medications.length <= 50;
      },
      message: 'Cannot have more than 50 medications'
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      const { __v, ...sanitized } = ret;
      return sanitized;
    }
  }
});

// Create indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;