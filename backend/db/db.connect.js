import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MONGODB connected...");
  } catch (error) {
    process.exit(1);
  }
};
