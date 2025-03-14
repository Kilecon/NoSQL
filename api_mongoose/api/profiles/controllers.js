
const Profile = require('./models');

// Récupérer tous les profils avec filtres optionnels
exports.getAllProfiles = async (req, res) => {
  try {
    const { skills, location, search } = req.query;
    let query = { isDeleted: false };

    // Filtres
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    if (location) {
      query['information.location'] = { $regex: location, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'information.bio': { $regex: search, $options: 'i' } }
      ];
    }

    const profiles = await Profile.find(query).select('-__v');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un profil par ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false })
      .select('-__v')
      .populate('friends', 'name email _id');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau profil
exports.createProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Le nom et l\'email sont requis' });
    }

    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      return res.status(400).json({ message: 'Un profil avec cet email existe déjà' });
    }

    const newProfile = new Profile({
      name,
      email,
      information: {},
      friends: []
    });

    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un profil
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ message: 'Le nom ou l\'email doivent être fournis' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: updateData },
      { new: true }
    ).select('-__v');

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un profil (soft delete)
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json({ message: 'Profil supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une experience
exports.addExperience = async (req, res) => {
  try {
    const { title, company, dates, description } = req.body;
    if (!title || !company || !dates || !dates.start) {
      return res.status(400).json({ message: 'Les champs titre, entreprise et date de début sont requis' });
    }

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $push: { experience: { title, company, dates, description } } },
      { new: true }
    ).select('-__v');

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une experience
exports.deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $pull: { experience: { _id: req.params.exp } } },
      { new: true }
    ).select('-__v');

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une compétence
exports.addSkill = async (req, res) => {
  try {
    const skill = req.body.skill;
    if (!skill) {
      return res.status(400).json({ message: 'La compétence est requise' });
    }

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false, skills: { $ne: skill } },
      { $push: { skills: skill } },
      { new: true }
    ).select('-__v');

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé ou compétence déjà ajoutée' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une compétence
exports.deleteSkill = async (req, res) => {
  try {
    const skill = req.params.skill;

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $pull: { skills: skill } },
      { new: true }
    ).select('-__v');

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour les informations
exports.updateInformation = async (req, res) => {
  try {
    const { bio, location, website } = req.body;
    if (!bio && !location && !website) {
      return res.status(400).json({ message: 'Au moins un champ est requis' });
    }

    const updateData = {};
    if (bio) updateData['information.bio'] = bio;
    if (location) updateData['information.location'] = location;
    if (website) updateData['information.website'] = website;

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: updateData },
      { new: true }
    ).select('-__v');

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un ami
exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    if (!friendId) {
      return res.status(400).json({ message: 'L\'ID de l\'ami est requis' });
    }

    // Vérifier si l'ami existe
    const friend = await Profile.findOne({ _id: friendId, isDeleted: false });
    if (!friend) {
      return res.status(404).json({ message: 'Ami non trouvé' });
    }

    // Vérifier si l'ami est déjà dans la liste
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false });
    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    if (profile.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Cet ami est déjà dans la liste' });
    }

    // Ajouter l'ami
    profile.friends.push(friendId);
    await profile.save();

    // Récupérer le profil mis à jour avec les amis
    const updatedProfile = await Profile.findById(req.params.id)
      .populate('friends', 'name email _id')
      .select('-__v');

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un ami
exports.removeFriend = async (req, res) => {
  try {
    const friendId = req.params.friendId;

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $pull: { friends: friendId } },
      { new: true }
    )
      .populate('friends', 'name email _id')
      .select('-__v');

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer la liste des amis
exports.getFriends = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false })
      .populate('friends', 'name email _id')
      .select('friends');

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json(profile.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};