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
    if (await fs.pathExists('src/.env')) {
        fs.copy('src/.env', `${outDir}/.env`);
    }

    if (await fs.pathExists('src/package.json')) {
        console.log('Installing dependencies...');

        const usingYarn = await fs.pathExists('src/yarn.lock');
        const usingNpm = await fs.pathExists('src/package-lock.json');

        if (usingYarn && usingNpm) {
            throw new Error("It looks like you've got both 'package-lock.json' and 'yarn.lock' in the 'src/' folder.");
        }

        const packageManager = usingYarn ? 'yarn' : 'npm';

        await Promise.all([
            fs.copy('src/package.json', `${outDir}/package.json`),
            packageManager === 'yarn' && fs.copy('src/yarn.lock', `${outDir}/yarn.lock`),
            packageManager === 'npm' && fs.copy('src/package-lock.json', `${outDir}/package-lock.json`),
        ]);

        const options = getInstallOptions(packageManager);
        await execa(options.command, options.args, {
            cwd: `${outDir}/`,
            stdio: [process.stdin, 'ignore', process.stderr],
            timeout: 2 * 60 * 1000,
        });
    }
}
