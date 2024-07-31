import express from 'express';
import kue from 'kue';
import redis from 'redis';
import { promisify } from 'util';

// Create Redis client and promisify get function
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Create Kue queue
const queue = kue.createQueue();

// Initialize reservation state
let reservationEnabled = true;

// Create express app
const app = express();
const port = 1245;

// Function to reserve seat
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

// Function to get current available seats
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return seats ? parseInt(seats, 10) : 0;
}

// Route to get available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

// Route to reserve seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const job = queue.create('reserve_seat', {})
    .save((err) => {
      if (err) {
        return res.json({ status: 'Reservation failed' });
      }
      res.json({ status: 'Reservation in process' });
    });
});

// Route to process queue
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      const availableSeats = await getCurrentAvailableSeats();
      if (availableSeats <= 0) {
        reservationEnabled = false;
        done(new Error('Not enough seats available'));
        return;
      }
      
      const newAvailableSeats = availableSeats - 1;
      await reserveSeat(newAvailableSeats);

      if (newAvailableSeats >= 0) {
        done();
      } else {
        done(new Error('Not enough seats available'));
      }
    } catch (error) {
      done(error);
    }
  });
});

// Start server and initialize available seats
(async () => {
  await reserveSeat(50); // Set initial available seats to 50

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();

// Listen to Kue events
queue.on('job complete', (id) => {
  console.log(`Seat reservation job ${id} completed`);
}).on('job failed', (id, errorMessage) => {
  console.log(`Seat reservation job ${id} failed: ${errorMessage}`);
});
