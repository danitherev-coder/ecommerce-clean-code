
import { envs } from "./config";
import { MongoDatabase } from "./data/mongodb/connect";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { repository } from "./presentation/auth/routes";
import { repository as repositoryCoupon } from "./presentation/coupon/routes";

(async () => {
    await main();
})();


async function main() {
    const { PORT, PUBLIC_PATH, MONGO_URL, DB_NAME } = envs;

    // Connect to database y si hay error, desconectar
    await MongoDatabase.connect({
        mongoURL: MONGO_URL,
        dbName: DB_NAME
    });

    // Iniciar la tarea cron para eliminar usuarios no verificados
    await repository.deleteUnverifiedUsers();

    await Promise.all([
        repositoryCoupon.couponExpired(),
        repository.deleteUnverifiedUsers()
    ])

    process.on('SIGINT', async () => {
        await MongoDatabase.disconnect();
        process.exit(0);
    });

    const server = new Server({
        port: PORT,
        public_path: PUBLIC_PATH,
        routes: AppRoutes.routes
    });
    server.start();
}