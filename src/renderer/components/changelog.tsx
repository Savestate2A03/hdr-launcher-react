import React from 'react';
import { Remark } from 'react-remark';
import { Backend } from '../operations/backend';
import { getInstallType, getRepoName } from '../operations/install';

/**
 * changelog implementation
 */
export default class Changelog extends React.Component<
  { versions: string[] },
  { text: string }
> {
  private static async resolvePromises<T>(
    promises: Promise<T>[],
  ): Promise<T[]> {
    const results: T[] = [];

    promises.forEach(async (promise: Promise<T>) =>
      results.push(await promise),
    );

    return results;
  }

  constructor(props: { versions: string[] }) {
    super(props);
    this.state = {
      text: 'Getting Updates...',
    };

    const check = async () => {
      const { versions } = this.props;
      const changelogResponses: Promise<string>[] = [];
      versions.forEach((version: string) => {
        const CHANGELOG = `https://github.com/HDR-Development/${getRepoName(getInstallType(version))}/releases/download/${version.split('-')[0]}/CHANGELOG.md`;
        changelogResponses.push(
          Backend.instance()
            .getRequest(CHANGELOG)
            .catch((e: any) => {
              console.info(e);
              return `UNABLE TO GET CHANGELOG FOR ${version}`;
            }),
        );
      });

      Changelog.resolvePromises(changelogResponses).then((changelogs) => {
        const logs = changelogs
          .map((changelog) =>
            changelog
              .split(/\r?\n|\r|\n/g)
              .filter((line) => line.trim().length !== 0)
              .join('\n'),
          )
          .join('\n\n');
        this.setState({ text: logs });
      });
    };

    check();
  }

  render() {
    const { text } = this.state;
    return (
      <div>
        <p>
          <Remark>{text}</Remark>
        </p>
      </div>
    );
  }
}
