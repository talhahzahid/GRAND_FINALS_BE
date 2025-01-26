


import Loan from "../models/loan.models.js";

// Controller to get all applications
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Loan.find({});
        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Controller to update the status of an application
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use 'Pending', 'Approved', or 'Rejected'." });
        }

        const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!updatedLoan) {
            return res.status(404).json({ message: "Loan application not found." });
        }

        res.status(200).json({ message: "Loan status updated successfully!", loan: updatedLoan });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





// Controller to filter applications by location
export const filterApplications = async (req, res) => {
    try {
        const { city, country } = req.query;

        const filter = {};
        if (city) filter["guarantors.location"] = city;
        if (country) filter["guarantors.location"] = country;

        const applications = await Loan.find(filter).populate("userId", "name email cnic");

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const scheduleAppointment = async (req, res) => {
    try {
        const { appointmentDate } = req.body;

        if (!appointmentDate) {
            return res.status(400).json({ message: "Appointment date is required." });
        }

        const updatedLoan = await Loan.findByIdAndUpdate(
            req.params.id,
            { appointmentDate },
            { new: true }
        );

        if (!updatedLoan) {
            return res.status(404).json({ message: "Loan application not found." });
        }

        res.status(200).json({ message: "Appointment scheduled successfully!", loan: updatedLoan });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
