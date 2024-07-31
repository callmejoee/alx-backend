import kue from 'kue';
import { expect } from 'chai';
import { createPushNotificationsJobs } from './8-job'; // Adjust the import path as needed

// Create a Kue queue
const queue = kue.createQueue();

describe('createPushNotificationsJobs', function () {
  // Enter test mode
  before(function () {
    kue.testMode.enter();
  });

  // Clear the queue and exit test mode after tests
  after(function () {
    kue.testMode.clear();
    kue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', function () {
    const response = createPushNotificationsJobs('invalid', queue);
    expect(response).to.be.an('object').that.has.property('status', 'Jobs is not an array');
  });

  it('should create two new jobs to the queue', function () {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Hello' },
      { phoneNumber: '0987654321', message: 'World' }
    ];

    createPushNotificationsJobs(jobs, queue);

    const queueJobs = kue.testMode.jobs;
    expect(queueJobs).to.have.lengthOf(2);

    expect(queueJobs[0]).to.have.property('type', 'push_notification');
    expect(queueJobs[1]).to.have.property('type', 'push_notification');
  });

  it('should create and queue jobs with correct data', function () {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Test' }
    ];

    createPushNotificationsJobs(jobs, queue);

    const queuedJob = kue.testMode.jobs[0];
    expect(queuedJob).to.have.property('type', 'push_notification');
    expect(queuedJob.data).to.deep.equal(jobs[0]);
  });
});
