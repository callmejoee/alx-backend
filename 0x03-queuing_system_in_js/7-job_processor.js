import kue from 'kue';

// Array of blacklisted phone numbers
const blacklistedNumbers = [
  '4153518780',
  '4153518781'
];

// Function to send notifications
function sendNotification(phoneNumber, message, job, done) {
  // Track the job progress
  job.progress(0, 100);

  // Check if phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job if the phone number is blacklisted
    job.fail(new Error(`Phone number ${phoneNumber} is blacklisted`));
    console.log(`Notification job ${job.id} failed: Phone number ${phoneNumber} is blacklisted`);
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    return;
  }

  // Track progress to 50%
  job.progress(50, 100);

  // Log the notification sending action
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Complete the job
  job.complete();
  console.log(`Notification job ${job.id} completed`);
  done();
}

// Create a queue
const queue = kue.createQueue();

// Process jobs from the queue
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// Listen to job events for logging purposes
queue.on('job complete', (id) => {
  console.log(`Notification job ${id} completed`);
}).on('job failed', (id, errorMessage) => {
  console.log(`Notification job ${id} failed: ${errorMessage}`);
}).on('job progress', (id, progress) => {
  console.log(`Notification job ${id} ${progress}% complete`);
});
