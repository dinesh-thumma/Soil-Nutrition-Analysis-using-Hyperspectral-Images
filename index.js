import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Define your time range
const startDate = moment("2025-01-07");
const endDate = moment("2025-05-18");

// Get a random date within the range
const getRandomDate = () => {
  const diffDays = endDate.diff(startDate, "days");
  const randomDays = random.int(0, diffDays);
  return moment(startDate).add(randomDays, "days");
};

// Make a single commit at a specific datetime
const markCommit = (datetime, callback) => {
  const data = { date: datetime.toISOString() };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(datetime.toISOString(), { "--date": datetime.toISOString() }, callback);
  });
};

// Make commits with random number (1 to 6) per selected day
const makeCommits = (n) => {
  if (n <= 0) return simpleGit().push();

  const day = getRandomDate();
  const commitCount = Math.min(random.int(1, 6), n); // up to 6 commits or remaining n

  const makeDailyCommits = (count) => {
    if (count === 0) return makeCommits(n - commitCount); // continue with the rest

    // To simulate different times in the same day
    const timeOffset = random.int(8, 22); // random hour
    const commitTime = moment(day).add(timeOffset, "hours");

    markCommit(commitTime, () => makeDailyCommits(count - 1));
  };

  console.log(`Committing ${commitCount} time(s) on ${day.format("YYYY-MM-DD")}`);
  makeDailyCommits(commitCount);
};

// Start the process with desired number of total commits
makeCommits(95); // You can change this value
