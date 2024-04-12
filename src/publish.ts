import { Context } from 'semantic-release';
import { cargoExecutable, exec, PluginConfig, SemanticReleaseError } from './utils';

/**
 * Publish the current package to the crate registry.
 */
export default async ({ executable, allFeatures = false, publishArgs = [] }: PluginConfig, { logger }: Context) => {
  logger.log('Publish cargo package.');
  if (allFeatures && !publishArgs.includes('--all-features')) {
    publishArgs.push('--all-features');
  }

  if (!publishArgs.includes('--allow-dirty')) {
    publishArgs.push('--allow-dirty');
  }

  const { stderr, exitCode } = await exec(cargoExecutable(executable), ['publish', ...publishArgs]);
  if (exitCode !== 0) {
    logger.error(`Cargo publish failed: ${stderr}`);
    logger.error(new SemanticReleaseError('Cargo publish failed', 'ECARGOPUBLISH', stderr));
    throw new SemanticReleaseError('Cargo publish failed', 'ECARGOPUBLISH', stderr);
  }
};
