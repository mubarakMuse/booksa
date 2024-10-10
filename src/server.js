const express = require('express');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabaseUrl = 'https://wakzuklfbtvgsmkjawuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3p1a2xmYnR2Z3Nta2phd3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3Nzk5NjUsImV4cCI6MjAxNDM1NTk2NX0.ARadR_sIXt30keM7K3WQ82RZNMmzS9Hyt0DAh0eSCHQ'; // You can find this in your Supabase dashboard
const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mubarak014@gmail.com',
    pass: 'Islamistheway2jannaha!',
  },
});

app.post('/send-booking', async (req, res) => {
  const { hotelIds, roomAmount, adults, children, startDate, endDate } = req.body;
  const { data: hotels, error } = await supabase
    .from('hotels')
    .select('email')
    .in('id', hotelIds);

  if (error) return res.status(400).send(error.message);

  const bookingLink = `https://your-app-url.com/bookings/${req.body.id}`;

  hotels.forEach(({ email }) => {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'New Group Booking Request',
      text: `A new booking request has been made. Click here to view: ${bookingLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });
  });

  res.send('Booking emails sent to hotels');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
