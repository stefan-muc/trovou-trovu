/** @module ShortcutFinder */

import Helper from './Helper.js';

/** Find matching shortcut. */

export default class ShortcutFinder {
  /**
   * Match shortcuts for keyword and args.
   *
   * @param {string} keyword    - The keyword of the query.
   * @param {array} args        - The arguments of the query.
   *
   * @return {array} shortcuts  - The array of found shortcuts.
   */
  static async matchShortcuts2(keyword, args, namespaceInfos, reload, debug) {
    for (const namespaceInfo of Object.values(namespaceInfos)) {
      if (!namespaceInfo.shortcuts) {
        continue;
      }
      const shortcut = namespaceInfo.shortcuts[keyword + ' ' + args.length];
      if (shortcut && shortcut.reachable) {
        return shortcut;
      }
    }
  }

  /**
   * Collect shortcuts from all available namespace.
   *
   * @param {object} env        - The environment.
   *
   * @return {object} shortcuts - Found shortcuts keyed by their source namespace.
   */
  static async findShortcut(env) {
    let shortcut = await this.matchShortcuts2(
      env.keyword,
      env.args,
      env.namespaceInfos,
      env.reload,
      env.debug,
    );

    // If nothing found:
    // Try without commas, i.e. with the whole argumentString as the only argument.
    if (!shortcut && env.args.length > 0) {
      if (env.debug)
        Helper.log('Not found yet, trying via whole argument string.');
      env.args = [env.argumentString];
      shortcut = await this.matchShortcuts2(
        env.keyword,
        env.args,
        env.namespaceInfos,
        env.reload,
        env.debug,
      );
    }

    // If nothing found:
    // Try default keyword.
    if (!shortcut && env.defaultKeyword) {
      if (env.debug) Helper.log('Not found yet, trying via default keyword.');
      env.args = [env.query];
      shortcut = await this.matchShortcuts2(
        env.defaultKeyword,
        env.args,
        env.namespaceInfos,
        env.reload,
        env.debug,
      );
    }
    return shortcut;
  }
}
