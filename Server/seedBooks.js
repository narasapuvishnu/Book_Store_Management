const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const Book = require('./models/Book');
const Seller = require('./models/Seller');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/BookStore';
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper to download image
function downloadImage(url, filename) {
  return new Promise((resolve) => {
    const dest = path.join(uploadsDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve(filename);
    }

    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location, filename).then(resolve);
      }
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return resolve('itemImage-1783878932276-253091883.jpg'); // fallback
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(filename));
      });
    });

    request.on('error', () => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve('itemImage-1783878932276-253091883.jpg');
    });

    request.setTimeout(10000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve('itemImage-1783878932276-253091883.jpg');
    });
  });
}

const sampleBooks = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Non Fiction',
    price: 21.99,
    stock: 35,
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Packed with evidence-based strategies from biology, psychology, and neuroscience.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    filename: 'book-atomic-habits.jpg',
    reviews: [
      { rating: 5, comment: 'Life-changing book! The concept of 1% improvement every day changed my morning routine entirely.' },
      { rating: 5, comment: 'Clear, actionable, and straight to the point. Highly recommend to everyone.' }
    ]
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Fantasy',
    price: 18.50,
    stock: 20,
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80',
    filename: 'book-dune.jpg',
    reviews: [
      { rating: 5, comment: 'Masterpiece of sci-fi and world building. Arrakis feels completely real and thrilling.' },
      { rating: 4, comment: 'Deep political intrigue and epic scope. A classic for a reason.' }
    ]
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    genre: 'Science',
    price: 19.99,
    stock: 15,
    description: 'A landmark volume in science writing by one of the greatest minds of our time, exploring profound questions about the universe.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80',
    filename: 'book-brief-history.jpg',
    reviews: [
      { rating: 5, comment: 'Explains black holes, big bang, and quantum mechanics in ways that are deeply awe-inspiring.' },
      { rating: 4, comment: 'Fascinating read even if you do not have a physics background.' }
    ]
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    price: 14.99,
    stock: 25,
    description: 'The story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan, set in the roaring twenties.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
    filename: 'book-gatsby.jpg',
    reviews: [
      { rating: 5, comment: 'Lyrical prose, haunting characters, and an unforgettable critique of the American Dream.' },
      { rating: 4, comment: 'Beautiful writing and evocative atmosphere.' }
    ]
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Biography',
    price: 24.95,
    stock: 18,
    description: 'Based on more than forty interviews with Steve Jobs conducted over two years, this is the definitive biography of the creative entrepreneur.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
    filename: 'book-steve-jobs.jpg',
    reviews: [
      { rating: 5, comment: 'Brutally honest, inspiring, and comprehensive portrait of a visionary.' },
      { rating: 5, comment: 'Fascinating look into product design, perfectionism, and leadership.' }
    ]
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    price: 22.00,
    stock: 30,
    description: 'From examining the role evolving humans have played in the global ecosystem to charting the rise of empires, Sapiens integrates history and science.',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80',
    filename: 'book-sapiens.jpg',
    reviews: [
      { rating: 5, comment: 'Gives you a whole new perspective on money, nations, and human cooperation.' },
      { rating: 4, comment: 'Mind-opening and thought provoking from page one to the end.' }
    ]
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    price: 12.99,
    stock: 22,
    description: 'The romantic clash between the opinionated Elizabeth Bennet and her proud beau, Mr. Darcy, is a splendid performance of civilized sparring.',
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=80',
    filename: 'book-pride-prejudice.jpg',
    reviews: [
      { rating: 5, comment: 'The witty dialogue and character dynamics remain unmatched.' },
      { rating: 5, comment: 'One of the best romantic literary classics of all time.' }
    ]
  },
  {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    genre: 'Children',
    price: 11.50,
    stock: 40,
    description: 'A poetic tale of a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss.',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg',
    filename: 'book-little-prince.jpg',
    reviews: [
      { rating: 5, comment: 'What is essential is invisible to the eye. Timeless lessons for all ages.' },
      { rating: 5, comment: 'A heartwarming story that touches children and adults alike.' }
    ]
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genre: 'Non Fiction',
    price: 20.49,
    stock: 14,
    description: 'Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
    filename: 'book-thinking-fast-slow.jpg',
    reviews: [
      { rating: 5, comment: 'Essential reading for understanding cognitive biases and decision making.' },
      { rating: 4, comment: 'Rich with experiments and revelations about human judgment.' }
    ]
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    genre: 'Science',
    price: 23.00,
    stock: 16,
    description: 'Cosmos traces the fifteen billion years of cosmic evolution that have transformed matter into consciousness, exploring how science and civilization grew.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&q=80',
    filename: 'book-cosmos.jpg',
    reviews: [
      { rating: 5, comment: 'Poetic, profound, and deeply human. Sagan was a gift to humanity.' }
    ]
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    price: 16.99,
    stock: 28,
    description: 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely travelling further than the pantry of his hobbit-hole in Bag End. But his contentment is disturbed when the wizard Gandalf and a company of thirteen dwarves arrive.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80',
    filename: 'book-hobbit.jpg',
    reviews: [
      { rating: 5, comment: 'An enchanted journey from start to finish. Essential reading for all fantasy lovers!' },
      { rating: 5, comment: 'Tolkien created a world so rich and comforting. Loved every chapter.' }
    ]
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    price: 15.50,
    stock: 22,
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, exploring human dignity and prejudice through the eyes of young Scout Finch.',
    imageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&q=80',
    filename: 'book-mockingbird.jpg',
    reviews: [
      { rating: 5, comment: 'Atticus Finch remains one of the finest moral heroes in English literature.' },
      { rating: 5, comment: 'Heartfelt, powerful, and deeply relevant across generations.' }
    ]
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Biography',
    price: 19.50,
    stock: 18,
    description: 'An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&q=80',
    filename: 'book-educated.jpg',
    reviews: [
      { rating: 5, comment: 'Breathtaking courage and resilience. Could not put this memoir down.' },
      { rating: 4, comment: 'A moving testament to the transformative power of self-education.' }
    ]
  },
  {
    title: 'Harry Potter and the Sorcerer Stone',
    author: 'J.K. Rowling',
    genre: 'Children',
    price: 13.99,
    stock: 35,
    description: 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. A magical adventure that captures every young reader.',
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&q=80',
    filename: 'book-harry-potter.jpg',
    reviews: [
      { rating: 5, comment: 'Pure magic! Introduced my kids to reading and we read it together every night.' },
      { rating: 5, comment: 'Timeless classic that sparks boundless imagination.' }
    ]
  },
  {
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    genre: 'History',
    price: 21.50,
    stock: 19,
    description: 'A major work of history exploring geographic and environmental factors that shaped the modern world and why Eurasian civilizations survived and conquered others.',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80',
    filename: 'book-guns-germs.jpg',
    reviews: [
      { rating: 5, comment: 'Broad, ambitious, and utterly compelling explanation of human civilization.' }
    ]
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Fiction',
    price: 17.95,
    stock: 24,
    description: 'Alicia Berenson’s life is seemingly perfect. One evening she shoots her husband five times in the face and never speaks another word. A criminal psychotherapist becomes obsessed with uncovering her motive.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80',
    filename: 'book-silent-patient.jpg',
    reviews: [
      { rating: 5, comment: 'Did NOT see that twist coming! Read the entire second half in one sitting.' },
      { rating: 4, comment: 'Gripping psychological thriller from first page to last.' }
    ]
  },
  {
    title: 'Me Before You',
    author: 'Jojo Moyes',
    genre: 'Romance',
    price: 14.50,
    stock: 20,
    description: 'Louisa Clark is an ordinary girl living an exceedingly ordinary life. Will Traynor has lost the desire to live after a tragic accident. When Lou becomes his caregiver, their lives collide in unexpected ways.',
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=80',
    filename: 'book-me-before-you.jpg',
    reviews: [
      { rating: 5, comment: 'Bring tissues! Heartbreaking and uplifting all at once.' },
      { rating: 5, comment: 'An emotional rollercoaster with wonderfully written characters.' }
    ]
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const seller = await Seller.findOne({ isApproved: true }) || await Seller.findOne();
  if (!seller) {
    console.error('No seller found in the database. Please register a seller first.');
    process.exit(1);
  }

  const users = await User.find();
  const defaultUser = users[0] || { _id: seller._id, name: 'Reader' };

  console.log(`Using seller: ${seller.name} (${seller._id})`);

  // Update existing book if in stock 0 to be available
  await Book.updateMany({ stock: { $lte: 0 } }, { $set: { stock: 12, availability: true } });

  for (const b of sampleBooks) {
    const existing = await Book.findOne({ title: b.title });
    if (existing) {
      console.log(`Book "${b.title}" already exists, ensuring stock and availability...`);
      existing.stock = b.stock;
      existing.availability = true;
      if (!existing.reviews || existing.reviews.length === 0) {
        existing.reviews = b.reviews.map((r, i) => {
          const revUser = users[i % users.length] || defaultUser;
          return {
            userId: revUser._id,
            userName: revUser.name,
            rating: r.rating,
            comment: r.comment,
            createdAt: new Date()
          };
        });
        const sum = existing.reviews.reduce((acc, r) => acc + r.rating, 0);
        existing.averageRating = parseFloat((sum / existing.reviews.length).toFixed(1));
      }
      await existing.save();
      continue;
    }

    console.log(`Downloading cover image for "${b.title}"...`);
    const imgFilename = await downloadImage(b.imageUrl, b.filename);

    const bookReviews = b.reviews.map((r, i) => {
      const revUser = users[i % users.length] || defaultUser;
      return {
        userId: revUser._id,
        userName: revUser.name,
        rating: r.rating,
        comment: r.comment,
        createdAt: new Date(Date.now() - (i + 1) * 86400000 * 3) // past few days
      };
    });

    const sumRating = bookReviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = parseFloat((sumRating / bookReviews.length).toFixed(1));

    const newBook = new Book({
      title: b.title,
      author: b.author,
      genre: b.genre,
      description: b.description,
      price: b.price,
      stock: b.stock,
      availability: b.stock > 0,
      itemImage: imgFilename,
      sellerId: seller._id,
      sellerName: seller.name,
      reviews: bookReviews,
      averageRating: avgRating
    });

    await newBook.save();
    console.log(`Added book: "${b.title}" with ${bookReviews.length} reviews and avg rating ${avgRating}`);
  }

  const finalCount = await Book.countDocuments();
  console.log(`Catalog successfully updated! Total books in catalog: ${finalCount}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
