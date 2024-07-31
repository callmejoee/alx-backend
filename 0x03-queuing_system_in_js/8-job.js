import kue from 'kue';
import util from 'util';

// Create a Kue queue
const queue = kue.createQueue();

// Promisify Kue methods
const queueCreate = util.promisify(queue.create.bind(queue));

// Function to create jobs
export function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach((job, index) => {
    const jobData = {
      phoneNumber: job.phoneNumber,
      message: job.message,
    };

    // Create job
    const newJob = queue.create('push_notification_code_3', jobData)
      .on('enqueue', job => {
        console.log(`Notification job created: ${job.id}`);
      })
      .on('complete', job => {
        console.log(`Notification job ${job.id} completed`);
      })
      .on('failed', (job, error) => {
        console.log(`Notification job ${job.id} failed: ${error.message}`);
      })
      .on('progress', (job, progress) => {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      });

    newJob.save();
  });
}

export default createPushNotificationsJobs;
