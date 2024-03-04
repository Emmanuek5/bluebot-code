class Job {
  constructor(name, salary, xp, duration, employer, cooldown) {
    this.name = name;
    this.salary = salary;
    this.xp = xp;
    this.duration = duration;
    this.cooldown = cooldown;
    this.employer = employer;
  }
}

module.exports = Job;
