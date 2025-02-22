import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

async function connectDB() {
    if(connection.isConnected){
        console.log("Already connected to Database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = mongoose.connections[0].readyState
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default connectDB