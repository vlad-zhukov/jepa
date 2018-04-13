import webpack from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import chalk from 'chalk';
import {cleanDir, installDeps} from './_core';
import webpackConfig from '../configs/webpackConfig';

// First compile the client. We need it to properly output assets.json (asset
// manifest file with the correct hashes on file names BEFORE we can start
// the server compiler.
async function build() {
    const clientConfig = await webpackConfig({target: 'web', env: 'prod'});
    const serverConfig = await webpackConfig({target: 'node', env: 'prod'});

    return new Promise((resolve, reject) => {
        console.log('Compiling client...');

        // eslint-disable-next-line consistent-return
        webpack(clientConfig, (clientError, clientStats) => {
            if (clientError) {
                return reject(clientError);
            }

            const clientMessages = formatWebpackMessages(clientStats.toJson({}, true));
            if (clientMessages.errors.length) {
                return reject(new Error(clientMessages.errors.join('\n\n')));
            }

            if (
                process.env.CI &&
                (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
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
            webpack(serverConfig, (serverError, serverStats) => {
                if (serverError) {
                    return reject(serverError);
                }

                const serverMessages = formatWebpackMessages(serverStats.toJson({}, true));
                if (serverMessages.errors.length) {
                    return reject(new Error(serverMessages.errors.join('\n\n')));
                }

                if (
                    process.env.CI &&
                    (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
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
                    warnings: Object.assign({}, clientMessages.warnings, serverMessages.warnings),
                });
            });
        });
    });
}

function handleBuildWarnings({warnings}) {
    if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(`\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`);
        console.log(`To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`);
    }
    else {
        console.log(chalk.green('Compiled successfully.\n'));
    }
    console.log();
}

(async () => {
    try {
        await cleanDir();
        await Promise.all([installDeps(), build().then(handleBuildWarnings)]);
    }
    catch (error) {
        console.log(chalk.red('Failed to compile.\n'));
        console.log(`${error.message || error}\n`);
        process.exitCode = 1;
    }
})();
