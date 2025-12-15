import * as React from 'react';
import { skyline } from 'nx-request-api';
import { Backend, NodeBackend } from '../../operations/backend';
import '../../styles/progress.css';
import InfoBox from './info_box';
import { Header } from '../../components/header';
import { LogoRight } from '../../components/logo_right';
import MainMenu from './main_menu';
import { CheckingInstalled } from './checking_installed';
import ToolsMenu from './tools_menu';
import OptionsMenu from './options_menu';
import NotInstalledMenu from './not_installed_menu';
import PrInstalledMenu from './pr_installed_menu';

export enum MenuType {
  MainMenu,
  Options,
  Tools,
  NotInstalled,
  CheckingInstalled,
  PrInstalled,
}

/**
 * main menu implementation
 */
export default class Menu extends React.PureComponent<
  {},
  {
    currentMenu: MenuType;
    version: string;
    info: string;
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentMenu: MenuType.CheckingInstalled,
      version: 'unknown',
      info: '  ',
    };
  }

  componentDidMount() {
    this.loadVersion();
  }

  setVersion(version: string) {
    console.debug(`setting version: ${version}`);
    this.setState((prevState) => ({
      currentMenu: prevState.currentMenu,
      version,
      info: prevState.info,
    }));
  }

  getMenu() {
    const { currentMenu, version, info } = this.state;
    switch (currentMenu) {
      case MenuType.Options:
        return (
          <OptionsMenu
            setInfo={(info: string) => this.setInfo(info)}
            switchTo={(menu: MenuType) => this.switchTo(menu)}
            version={version}
          />
        );
      case MenuType.Tools:
        return (
          <ToolsMenu
            setInfo={(info: string) => this.setInfo(info)}
            switchTo={(menu: MenuType) => this.switchTo(menu)}
          />
        );
      case MenuType.CheckingInstalled:
        return (
          <CheckingInstalled
            onComplete={(installed: string | null) => {
              console.info(installed);

              if (installed === null) {
                this.switchTo(MenuType.NotInstalled);
                return;
              }

              if (installed.endsWith('pr')) {
                this.switchTo(MenuType.PrInstalled);
              } else {
                this.switchTo(MenuType.MainMenu);
              }
            }}
          />
        );
      case MenuType.NotInstalled:
        return (
          <NotInstalledMenu
            setInfo={(info: string) => this.setInfo(info)}
            switchTo={(menu: MenuType) => this.switchTo(menu)}
          />
        );
      case MenuType.PrInstalled:
        return (
          <PrInstalledMenu
            setInfo={(info: string) => this.setInfo(info)}
            switchTo={(menu: MenuType) => this.switchTo(menu)}
          />
        );
      default:
        return (
          <MainMenu
            setInfo={(info: string) => this.setInfo(info)}
            switchTo={(menu: MenuType) => this.switchTo(menu)}
          />
        );
    }
  }

  setInfo(info: string) {
    console.debug(`setting info: ${info}`);
    this.setState((prevState) => ({
      currentMenu: prevState.currentMenu,
      version: prevState.version,
      info,
    }));
  }

  loadVersion() {
    Backend.instance()
      .getVersion()
      .then((ver) => {
        console.debug(`loaded version: ${ver}`);
        this.setVersion(ver);
      })
      .catch((e) => console.error(`console error: ${e}`));
  }

  switchTo(menu: MenuType) {
    this.setState((prevState) => ({
      currentMenu: menu,
      version: prevState.version,
      info: prevState.info,
    }));
    this.loadVersion();

    // assign button actions for switch
    skyline.setButtonAction('X', () => {});
    const { currentMenu } = this.state;
    switch (currentMenu) {
      case MenuType.Options:
        skyline.setButtonAction('B', () => this.switchTo(MenuType.MainMenu));
        break;
      case MenuType.Tools:
        skyline.setButtonAction('B', () => this.switchTo(MenuType.MainMenu));
        break;
      default:
        skyline.setButtonAction('B', () => {});
        break;
    }
  }

  render() {
    const { version, currentMenu, info } = this.state;
    return (
      <div className="full">
        <Header
          version={version}
          submenu={
            currentMenu === MenuType.Options
              ? ['Options']
              : currentMenu === MenuType.Tools
                ? ['Tools']
                : []
          }
        />
        <div className="app-body">
          <div className="left-side" id="left-side">
            {this.getMenu()}
          </div>
          <LogoRight />
        </div>
        <InfoBox text={info} />
      </div>
    );
  }
}
