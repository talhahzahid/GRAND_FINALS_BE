


import Loan from "../models/loan.models.js";

// Controller to get all applications
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Loan.find({}).populate("userId");
        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Controller to update the status of an application
// export const updateApplicationStatus = async (req, res) => {
//     try {
//         const { status } = req.body;

//         if (!["Pending", "Approved", "Rejected"].includes(status)) {
//             return res.status(400).json({ message: "Invalid status. Use 'Pending', 'Approved', or 'Rejected'." });
//         }

//         const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, { status }, { new: true });

//         if (!updatedLoan) {
//             return res.status(404).json({ message: "Loan application not found." });
//         }

//         res.status(200).json({ message: "Loan status updated successfully!", loan: updatedLoan });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate the status
        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res
                .status(400)
                .json({ message: "Invalid status. Use 'Pending', 'Approved', or 'Rejected'." });
        }

        // Find and update the loan status
        const updatedLoan = await Loan.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("userId", "email name");

        if (!updatedLoan) {
            return res.status(404).json({ message: "Loan application not found." });
        }

        // If the loan is approved, generate the slip
        if (status === "Approved") {
            const tokenNumber = `TOK-${Date.now()}`;
            const appointmentDate = new Date();
            appointmentDate.setDate(appointmentDate.getDate() + 7); // Set appointment 7 days from now
            const officeLocation = "Saylani Microfinance Office, Karachi";

            // Generate QR Code
            const qrCodeData = {
                tokenNumber,
                appointmentDate: appointmentDate.toISOString(),
                officeLocation,
                loanId: updatedLoan._id,
            };

            const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrCodeData));

            // Email slip to the user
            const { email, name: userName } = updatedLoan.userId;

            const emailHTML = `
                <h2>Loan Approval Slip</h2>
                <p>Dear ${userName},</p>
                <p>Congratulations! Your loan application has been approved. Please find the details below:</p>
                <ul>
                    <li><strong>Token Number:</strong> ${tokenNumber}</li>
                    <li><strong>Appointment Date:</strong> ${appointmentDate.toDateString()}</li>
                    <li><strong>Office Location:</strong> ${officeLocation}</li>
                </ul>
                <p><strong>QR Code:</strong></p>
                <img src="${qrCodeImage}" alt="QR Code" />
                <p>Please bring this slip to the office on your appointment date.</p>
                <p>Best regards,</p>
                <p>Saylani Microfinance Team</p>
            `;

            // await transporter.sendMail({
            //     from: '"Saylani Microfinance" <no-reply@saylani.org>',
            //     to: `${email}, ${process.env.EMAIL}`, // Sends to user and admin
            //     subject: "Loan Approval Slip",
            //     html: emailHTML,
            // });

            return res.status(200).json({
                message: "Loan status updated successfully! Slip generated and sent to user.",
                loan: updatedLoan,
                slip: {
                    tokenNumber,
                    appointmentDate,
                    officeLocation,
                    qrCodeImage,
                },
            });
        }

        // Handle other statuses (e.g., "Rejected" or "Pending")
        return res.status(200).json({
            message: `Loan status updated successfully to '${status}'!`,
            loan: updatedLoan,
        });
    } catch (error) {
        console.error("Error updating loan status:", error.message);

        res.status(500).json({
            message: "Server error. Could not update loan status.",
            error: error.message,
        });
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
