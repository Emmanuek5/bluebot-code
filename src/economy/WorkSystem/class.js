const fs = require("fs");
const Job = require("../../types/Job");

class WorkSystem {
  constructor() {
    this.jobs = [
      {
        name: "Farmer",
        salary: 10,
        xp: 10,
        duration: 10,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Miner",
        salary: 20,
        xp: 20,
        duration: 20,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Blacksmith",
        salary: 30,
        xp: 30,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
        duration: 30,
      },
      {
        name: "Cook",
        salary: 40,
        xp: 40,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
        duration: 40,
      },
      {
        name: "Farmer",
        salary: 50,
        xp: 50,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
        duration: 50,
      },
      {
        name: "Miner",
        salary: 60,
        xp: 60,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
        duration: 60,
      },
    ];
    this.workers = [];
    this.saveJobs();
  }

  // Method to add a new job to the system
  addJob(job) {
    this.jobs.push(job);
    this.saveJobs();
  }

  // Method to hire a worker for a specific job
  hireWorker(worker, jobName) {
    const jobIndex = this.jobs.findIndex(job => job.name === jobName);
    if (jobIndex !== -1) {
      return new Promise((resolve, reject) => {
        // Simulating job completion after the specified duration
        setTimeout(() => {
          resolve(`Job ${jobName} completed by ${worker.name}`);
        }, this.jobs[jobIndex].duration * 1000); // Convert duration to milliseconds
        this.workers.push({ ...worker, job: jobName });
      });
    } else {
      return Promise.reject("Job not found");
    }
  }

  // Method to fire a worker
  fireWorker(workerName) {
    const workerIndex = this.workers.findIndex(worker => worker.name === workerName);
    if (workerIndex !== -1) {
      const worker = this.workers.splice(workerIndex, 1)[0];
    } else {
      return Promise.reject("Worker not found");
    }
  }

  // Method to display all available jobs
  /**
   *
   * @returns {Job[]}
   */
  getJobs() {
    return this.jobs;
  }

  /**
   * Get a job by its name.
   *
   * @param {string} jobName - the name of the job to find
   * @return {Job} the job object with the specified name, or undefined if not found
   */
  getJob(jobName) {
    return this.jobs.find(job => job.name === jobName);
  }
  // Method to display all current workers
  getWorkers() {
    return this.workers;
  }

  saveJobs() {
    fs.writeFileSync("./src/economy/WorkSystem/jobs.json", JSON.stringify(this.jobs));
  }
}

module.exports = WorkSystem;
