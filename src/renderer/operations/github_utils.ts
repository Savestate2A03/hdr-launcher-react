import { Backend } from './backend';

export type GithubPRComments = {
  url: string;
  html_url: string;
  issue_url: string;
  id: number;
  node_id: string;
  user: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: 'User';
    user_view_type: string;
    site_admin: boolean;
  };
  created_at: string;
  updated_at: string;
  body: string;
  author_association: string;
  reactions: {
    url: string;
    total_count: number;
    '+1': number;
    '-1': number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  performed_via_github_app: boolean | string | null;
}[];

export class Github {
  private static prs: null | any = null;

  // singleton accessor for PR data
  static async pullRequests(): Promise<any> {
    if (Github.prs != null) {
      return Github.prs;
    }
    return Backend.instance()
      .getJson(
        'https://api.github.com/repos/HDR-Development/HewDraw-Remix/pulls?per_page=100&state=open',
      )
      .then((data) => {
        Github.prs = data;
      })
      .catch((e) => {});
  }
}
