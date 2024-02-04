import { connect, disconnect } from "mongoose";

interface Options {
    mongoURL: string;
    dbName: string;
}

export class MongoDatabase {
    static async connect(options: Options) {
        const { mongoURL, dbName } = options;
        try {
            await connect(mongoURL, {
                dbName
            });

            console.log('Database connected');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async disconnect() {
        try {
            await disconnect();
            console.log('Database disconnected');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}