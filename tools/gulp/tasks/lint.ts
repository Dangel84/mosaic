import * as chalk from 'chalk';

import { task } from 'gulp';
import { join } from 'path';

import { buildConfig } from '../../packages';
import { execNodeTask } from '../utils/helpers';


/* tslint:disable:no-console */
/* tslint:disable:no-var-requires */
const madge = require('madge');

const tsLintBaseFlags = ['-c', 'tslint.json', '--project', './tsconfig.json'];

/** Path to the output of the Mosaic package. */
const mosaicOutPath = join(buildConfig.outputDir, 'packages', 'mosaic');

/** Path to the output of the CDK package. */
const cdkOutPath = join(buildConfig.outputDir, 'packages', 'cdk');

task('lint', ['tslint', 'madge']);

task('tslint', execNodeTask('tslint', tsLintBaseFlags));

task('madge', ['mosaic:clean-build'], () => {
    madge([mosaicOutPath, cdkOutPath]).then((res: any) => {
        const circularModules = res.circular();

        if (circularModules.length) {
            console.error();
            console.error(chalk.default.red(`Madge found modules with circular dependencies.`));
            console.error(formatMadgeCircularModules(circularModules));
            console.error();
        }
    });
});

/** Returns a string that formats the graph of circular modules. */
function formatMadgeCircularModules(circularModules: string[][]): string {
    return circularModules.map((modulePaths: string[]) => `\n - ${modulePaths.join(' > ')}`).join('');
}
