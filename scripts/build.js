import webpack from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import chalk from 'chalk';
import {cleanDir, installDeps} from './_core';
import webpackConfig from '../config/webpackConfig';

// First compile the client. We need it to properly output assets.json (asset
// manifest file with the correct hashes on file names BEFORE we can start
// the server compiler.
async function build() {
    const clientConfig = await webpackConfig({target: 'web', env: 'prod'});
    const serverConfig = await webpackConfig({target: 'node', env: 'prod'});

    return new Promise((resolve, reject) => {
        console.log('Compiling client...');
        webpack(clientConfig, (err, clientStats) => {
            if (err) {
                reject(err);
            }
            const clientMessages = formatWebpackMessages(
                clientStats.toJson({}, true)
            );
            if (clientMessages.errors.length) {
                return reject(new Error(clientMessages.errors.join('\n\n')));
            }
            if (
                process.env.CI &&
                (typeof process.env.CI !== 'string' ||
                    process.env.CI.toLowerCase() !== 'false') &&
                clientMessages.warnings.length
            ) {
                console.log(
                    chalk.yellow(
                        '\nTreating warnings as errors because process.env.CI = true.\n' +
                        'Most CI servers set it automatically.\n'
                    )
                );
                return reject(new Error(clientMessages.warnings.join('\n\n')));
            }

            console.log(chalk.green('Compiled client successfully.'), '\n');
            console.log('Compiling server...');
            webpack(serverConfig, (err, serverStats) => {
                if (err) {
                    reject(err);
                }
                const serverMessages = formatWebpackMessages(
                    serverStats.toJson({}, true)
                );
                if (serverMessages.errors.length) {
                    return reject(new Error(serverMessages.errors.join('\n\n')));
                }
                if (
                    process.env.CI &&
                    (typeof process.env.CI !== 'string' ||
                        process.env.CI.toLowerCase() !== 'false') &&
                    serverMessages.warnings.length
                ) {
                    console.log(
                        chalk.yellow(
                            '\nTreating warnings as errors because process.env.CI = true.\n' +
                            'Most CI servers set it automatically.\n'
                        )
                    );
                    return reject(new Error(serverMessages.warnings.join('\n\n')));
                }
                console.log(chalk.green('Compiled server successfully.'), '\n');
                return resolve({
                    stats: clientStats,
                    warnings: Object.assign(
                        {},
                        clientMessages.warnings,
                        serverMessages.warnings
                    ),
                });
            });
        });
    });
}

function handleBuildWarnings({ stats, warnings }) {
    if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
            '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
            'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
    } else {
        console.log(chalk.green('Compiled successfully.\n'));
    }
    console.log();
}

(async () => {
    try {
        await cleanDir();
        await Promise.all([
            installDeps(),
            build().then(handleBuildWarnings),
        ]);
    }
    catch (err) {
        console.log(chalk.red('Failed to compile.\n'));
        console.log((err.message || err) + '\n');
        process.exitCode = 1;
    }
})();
