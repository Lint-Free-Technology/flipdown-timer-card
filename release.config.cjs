/* eslint-disable no-template-curly-in-string */
module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: '⭐ New Features' },
            { type: 'fix', section: '🐞 Bug Fixes' },
            { type: 'Fix', section: '🐞 Bug Fixes' },
            { type: 'perf', hidden: false, section: '⚡ Performance Improvements' },
            { type: 'doc', hidden: false, section: '📔 Documentation' },
            { type: 'docs', hidden: false, section: '📔 Documentation' },
            { type: 'chore', hidden: true, section: '🔧 Chores' },
            { type: 'build', hidden: false, section: '⚙️ Miscellaneous' },
            { type: 'ci', hidden: false, section: '⚙️ Miscellaneous' },
            { type: 'refactor', hidden: false, section: '⚙️ Miscellaneous' },
            { type: 'test', hidden: false, section: '⚙️ Miscellaneous' },
          ],
        },
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'README.md', 'package.json', 'yarn.lock'],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'dist/*.js',
      },
    ],
  ],
  preset: 'conventionalcommits',
  branches: [{ name: 'master' }, { name: 'dev', channel: 'beta', prerelease: 'beta' }],
};
