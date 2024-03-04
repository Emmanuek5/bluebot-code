const fs = require("fs");
const Job = require("../../types/Job");

class WorkSystem {
  constructor() {
    this.jobs = [
      {
        name: "Farmer",
        salary: 15,
        xp: 10,
        duration: 8,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Blacksmith",
        salary: 35,
        xp: 30,
        duration: 25,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Cook",
        salary: 45,
        xp: 40,
        duration: 35,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Miner",
        salary: 65,
        xp: 60,
        duration: 50,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Lumberjack",
        salary: 20,
        xp: 20,
        duration: 15,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Fisherman",
        salary: 25,
        xp: 25,
        duration: 20,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Hunter",
        salary: 40,
        xp: 35,
        duration: 30,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Baker",
        salary: 50,
        xp: 45,
        duration: 40,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Carpenter",
        salary: 60,
        xp: 55,
        duration: 45,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Tailor",
        salary: 70,
        xp: 65,
        duration: 55,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Artist",
        salary: 80,
        xp: 75,
        duration: 65,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Brewer",
        salary: 85,
        xp: 80,
        duration: 70,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Trader",
        salary: 95,
        xp: 90,
        duration: 80,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Sailor",
        salary: 105,
        xp: 100,
        duration: 90,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Explorer",
        salary: 115,
        xp: 110,
        duration: 100,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Doctor",
        salary: 125,
        xp: 120,
        duration: 110,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Engineer",
        salary: 135,
        xp: 130,
        duration: 120,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Scientist",
        salary: 145,
        xp: 140,
        duration: 130,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Architect",
        salary: 155,
        xp: 150,
        duration: 140,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Teacher",
        salary: 165,
        xp: 160,
        duration: 150,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
      {
        name: "Musician",
        salary: 175,
        xp: 170,
        duration: 160,
        employer: process.env.CLIENT_ID,
        cooldown: 10,
      },
    ];

    this.workers = [];

    this.workCache = [
      {
        name: "Worker",
        lastWorked: 0,
      },
    ];

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
      const lastWorked = this.workCache.find(worker => worker.name === worker.name).lastWorked;

      if (Date.now() - lastWorked < this.jobs[jobIndex].cooldown * 1000) {
        return Promise.reject([
          false,
          `You must wait ${this.jobs[jobIndex].cooldown} seconds before you can work again.`,
        ]);
      }

      return new Promise((resolve, reject) => {
        // Simulating job completion after the specified duration
        setTimeout(() => {
          this.workCache.push({
            name: worker,
            lastWorked: Date.now(),
          });
          resolve(`Job ${jobName} completed by ${worker.name}`);
        }, this.jobs[jobIndex].duration * 1000); // Convert duration to milliseconds
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
