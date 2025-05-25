const Photo = require('../models/photo.model');
const Voter = require('../models/Voter.model');
const requestIp = require('request-ip');

exports.add = async (req, res) => {
  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    if (!title || !author || !email || !file) {
      throw new Error('Missing required fields!');
    }

    if (title.length > 25) {
      throw new Error('Title is too long (max 25 characters)');
    }

    if (author.length > 50) {
      throw new Error('Author name is too long (max 50 characters)');
    }

    const htmlPattern = /<[^>]*>/g;
    if (htmlPattern.test(title) || htmlPattern.test(author) || htmlPattern.test(email)) {
      throw new Error('HTML tags are not allowed in input fields!');
    }

    const fileName = file.path.split('/').slice(-1)[0];
    const fileExt = fileName.split('.').slice(-1)[0].toLowerCase();
    const allowedExt = ['jpg', 'jpeg', 'png', 'gif'];

    if (!allowedExt.includes(fileExt)) {
      throw new Error('Invalid file type!');
    }

    const newPhoto = new Photo({
      title,
      author,
      email,
      src: fileName,
      votes: 0
    });

    await newPhoto.save();
    res.json(newPhoto);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loadAll = async (req, res) => {
  try {
    res.json(await Photo.find());
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.vote = async (req, res) => {
  try {
    const photoId = req.params.id;
    const clientIp = requestIp.getClientIp(req);

    const voter = await Voter.findOne({ user: clientIp });

    if (!voter) {
      const newVoter = new Voter({ user: clientIp, votes: [photoId] });
      await newVoter.save();

      const photo = await Photo.findById(photoId);
      if (!photo) return res.status(404).json({ message: 'Photo not found' });

      photo.votes++;
      await photo.save();

      return res.send({ message: 'Vote counted' });
    }

    if (voter.votes.includes(photoId)) {
      return res.status(500).json({ message: 'You already voted for this photo' });
    }

    voter.votes.push(photoId);
    await voter.save();

    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    photo.votes++;
    await photo.save();

    return res.send({ message: 'Vote counted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
