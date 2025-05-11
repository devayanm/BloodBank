const Organ = require("../models/Organ");
const { sendOrganNotification } = require("../services/notificationService");

const registerOrgan = async (req, res) => {
  const { organType, bloodType, donorId, coordinates, consentProvided } =
    req.body;

  if (!consentProvided) {
    return res
      .status(400)
      .json({ message: "Consent is required for organ donation" });
  }

  try {
    const newOrgan = new Organ({
      organType,
      bloodType,
      donorId,
      location: { type: "Point", coordinates },
      consentProvided,
    });

    await newOrgan.save();

    // Send real-time notification
    sendOrganNotification(`New ${organType} available from donor`);

    res.status(201).json(newOrgan);
  } catch (error) {
    res.status(500).json({ message: "Failed to register organ" });
  }
};

const findCompatibleOrgans = async (req, res) => {
    const { bloodType, organType, longitude, latitude, maxDistance = 10000 } = req.query;

    try {
        const compatibleOrgans = await Organ.find({
            organType,
            bloodType,
            status: 'Available',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).populate('donorId', 'name');

        res.status(200).json(compatibleOrgans);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch compatible organs' });
    }
};

const matchOrgan = async (req, res) => {
    const { organId, recipientId } = req.body;

    try {
        const organ = await Organ.findById(organId);

        if (!organ || organ.status !== 'Available') {
            return res.status(400).json({ message: 'Organ not available for matching' });
        }

        organ.recipientId = recipientId;
        organ.status = 'Matched';
        organ.matchedAt = Date.now();

        await organ.save();

        res.status(200).json(organ);
    } catch (error) {
        res.status(500).json({ message: 'Failed to match organ' });
    }
};

const updateOrganStatus = async (req, res) => {
    const { organId, status } = req.body;

    try {
        const organ = await Organ.findById(organId);

        if (!organ) {
            return res.status(404).json({ message: 'Organ not found' });
        }

        organ.status = status;
        await organ.save();

        res.status(200).json(organ);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update organ status' });
    }
};

module.exports = { registerOrgan, findCompatibleOrgans, matchOrgan, updateOrganStatus };/*  */