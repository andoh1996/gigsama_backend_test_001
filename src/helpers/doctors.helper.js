const sanitizeDoctorsData = (doctorsData) => {
    if (!doctorsData) return null;

    return {
        title: doctorsData.hospitalName || '',
        firstName: doctorsData.firstName || '',
        lastName: doctorsData.lastName || '',
        email: doctorsData.email || '',
        doctorID: doctorsData.doctorID || '',
        department: doctorsData.department || '',
        specialization: doctorsData.specialization || '',
        role: doctorsData.role || '',
        dateCreated: doctorsData.dateCreated || '',
    };
};

module.exports = {
    sanitizeDoctorsData
};
