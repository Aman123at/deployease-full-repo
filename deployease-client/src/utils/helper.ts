export const convertFieldErrorsToString = (
  errObj: Record<string, any>
): Record<string, any> => {
  let newObj: Record<string, any> = {};
  let key: string;
  for (key in errObj) {
    newObj[key] = errObj[key][0];
  }
  return newObj;
};

export const getNextVersion = (version: string): string => {
  const versionPrefix = "v";

  // Extract the numerical part of the version and increment it
  const currentVersionNumber = parseInt(version.slice(1), 10);
  const nextVersionNumber = currentVersionNumber + 1;

  // Return the new version string
  return versionPrefix + nextVersionNumber;
};

export const isValidGitHubRepo = async (url: string) => {
  // Extract the owner and repo from the URL
  const match = url.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
  if (!match) {
    return false;
  }

  const owner = match[1];
  const repo = match[2];

  // Construct the GitHub API URL
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await fetch(apiUrl);
    if (response.status === 200) {
      const data = await response.json();
      return data.full_name === `${owner}/${repo}`;
    }
    return false;
  } catch (error) {
    console.error("Error fetching the GitHub repository:", error);
    return false;
  }
};

export const getGitCommitHash = async (url: string) => {
  const match: RegExpMatchArray | null = url.match(
    /https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/
  );
  if (match) {
    const owner = match[1];
    const repo = match[2];
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches/main`;

    try {
      const response: any = await fetch(apiUrl).then(res=>res.json());
      if (
        response &&
        response.hasOwnProperty("commit") &&
        response.commit.hasOwnProperty("sha")
      ) {
        return response.commit.sha;
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      return ""
    }

  }else{
    return ""
  }
  
};

export const isNewCommitDetectedFromGithub = async (
  url: string,
  lastCommitSHA: string
) => {
  let commitDetected = false
  const match = url.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
  if (!match) {
    return false;
  }

  const owner = match[1];
  const repo = match[2];

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches/main`;

  try {
    const response: any = await fetch(apiUrl).then(res=>res.json());
    if (
      response &&
      response.hasOwnProperty("commit") &&
      response.commit.hasOwnProperty("sha")
    ) {
      const latestCommitSHA = response.commit.sha;
      if (latestCommitSHA !== lastCommitSHA) {
        console.log("New commit detected:", latestCommitSHA);
        commitDetected = true
      } else {
        console.log("No new commits.");
      }
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }

  return commitDetected
};
