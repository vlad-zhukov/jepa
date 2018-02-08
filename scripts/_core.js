import fs from 'fs-extra';
import execa from 'execa';

const outDir = __DEV__ ? '.jepa/dev' : '.jepa/prod';

export async function cleanDir() {
    console.log('Cleaning directory...');
    await fs.emptyDir(outDir);
    console.log()
}

export async function installDeps() {
    console.log('Installing dependencies...');
    await Promise.all([
        fs.copy('app/package.json', `${outDir}/package.json`),
        fs.copy('app/yarn.lock', `${outDir}/yarn.lock`),
        fs.copy('app/.env', `${outDir}/.env`),
    ]);

    const args = ['install', '--frozen-lockfile', '--silent'];
    await execa('yarn', args, {cwd: `${outDir}/`, stdio: 'inherit', timeout: 2 * 60 * 1000});
    console.log()
}
