import { Certificate } from '../models/Certificate.js';

export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .populate('program', 'title code')
      .sort('-issueDate');
    res.status(200).json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { code } = req.params;
    const cert = await Certificate.findOne({ verificationCode: code, status: 'active' })
      .populate('student', 'name email')
      .populate('program', 'title');

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Invalid or expired certificate verification code.' });
    }

    res.status(200).json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const { studentId, programId, title, gradeOrGPA, certificateUrl } = req.body;
    
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    const certNum = `TAE-CERT-${year}-${random}`;
    const verifCode = `VERIF-${random}-${Date.now().toString().slice(-4)}`;

    const cert = await Certificate.create({
      certificateNumber: certNum,
      student: studentId,
      program: programId,
      title,
      gradeOrGPA,
      certificateUrl: certificateUrl || 'https://via.placeholder.com/800x600?text=Digital+Certificate',
      verificationCode: verifCode,
      issuedBy: req.user.id
    });

    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
