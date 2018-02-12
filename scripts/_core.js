import fs from 'fs-extra';
import execa from 'execa';

const outDir = __DEV__ ? '.jepa/dev' : '.jepa/prod';

export async function cleanDir() {
    console.log('Cleaning directory...');
    await fs.emptyDir(outDir);
}

function getInstallOptions(packageManager) {
    if (packageManager === 'yarn') {
        return {command: 'yarn', args: ['install', '--frozen-lockfile']};
    }

    return {command: 'npm', args: ['install']};
}

export async function installDeps() {
    if (await fs.pathExists('app/.env')) {
        fs.copy('app/.env', `${outDir}/.env`);
    }

    if (await fs.pathExists('app/package.json')) {
        console.log('Installing dependencies...');

        const usingYarn = await fs.pathExists('app/yarn.lock');
        const usingNpm = await fs.pathExists('app/package-lock.json');

        if (usingYarn && usingNpm) {
            throw new Error("It looks like you've got both 'package-lock.json' and 'yarn.lock' in the 'app/' folder.");
        }

        const packageManager = usingYarn ? 'yarn' : 'npm';

        await Promise.all([
            fs.copy('app/package.json', `${outDir}/package.json`),
            packageManager === 'yarn' && fs.copy('app/yarn.lock', `${outDir}/yarn.lock`),
            packageManager === 'npm' && fs.copy('app/package-lock.json', `${outDir}/package-lock.json`),
        ]);

        const options = getInstallOptions(packageManager);
        await execa(options.command, options.args, {
            cwd: `${outDir}/`,
            stdio: [process.stdin, 'ignore', process.stderr],
            timeout: 2 * 60 * 1000,
        });
    }
}
