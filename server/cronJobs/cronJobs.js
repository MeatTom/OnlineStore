const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { VerificationCode } = require('../models/db');
const { Op } = require('sequelize');

require('dotenv').config();

const deleteExpiredVerificationCodes = async () => {
    try {
        const count = await VerificationCode.count();

        if (count === 0) {
            return;
        }

        await VerificationCode.destroy({
            where: {
                expires_at: {
                    [Op.lt]: new Date()
                }
            }
        });
        console.log('Expired verification codes deleted successfully');
    } catch (error) {
        console.error('Error deleting expired verification codes:', error);
    }
};

const createDatabaseBackup = () => {
    const backupDirectory = path.resolve(__dirname, 'db_backup');
    if (!fs.existsSync(backupDirectory)) {
        fs.mkdirSync(backupDirectory, { recursive: true });
    }

    const backupFileName = `backup_${new Date().toISOString().slice(0, 10)}.dump`;
    const backupFilePath = path.join(backupDirectory, backupFileName);

    const pgConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    };

    const pgDumpPath = 'D:\\PostgreSQL\\bin\\pg_dump.exe';

    const command = `"${pgDumpPath}" -U ${pgConfig.user} -h ${pgConfig.host} -p ${pgConfig.port} -F c -b -v -f "${backupFilePath}" ${pgConfig.database}`;

    exec(command, { env: { ...process.env, PGPASSWORD: process.env.DB_PASSWORD } }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка выполнения скрипта: ${error}`);
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log('Успешно создана резервная копия базы данных!');
    });
};

cron.schedule('*/5 * * * *', () => {
    deleteExpiredVerificationCodes();
});

cron.schedule('0 */9 * * *', () => {
    createDatabaseBackup();
});