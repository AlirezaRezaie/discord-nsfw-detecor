import axios from "axios";

export class Detector {
  all_commits: number = 0;
  endpoint: string;
  githubToken: string;
  constructor(endpoint: string, githubToken: string) {
    this.endpoint = endpoint;
    this.githubToken = githubToken;
  }

  async watchNewCommit(callback: any) {
    return await new Promise(() => {
      setInterval(() => {
        axios
          .get(this.endpoint, {
            headers: {
              Authorization: this.githubToken,
            },
          })
          .then((repo) => {
            if (repo.data.length > this.all_commits) {
              this.all_commits = repo.data.length;
              callback(
                repo.data[0].commit.author.name,
                repo.data[0].commit.message
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 1000);
    });
  }
}
