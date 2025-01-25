import Loan from '../models/loan.models.js'; // Import Loan model

// Create a new loan
export const createLoan = async (req, res) => {
    try {
        const { userId, category, subcategory, amount, loanPeriod, guarantors } = req.body;
        if (!category) return res.status(400).json({ message: "category is required" })
        if (!subcategory) return res.status(400).json({ message: "subcategory period is required" })
        if (!amount) return res.status(400).json({ message: "ammount period is required" })
        if (!loanPeriod) return res.status(400).json({ message: "loan period is required" })
        if (!guarantors) return res.status(400).json({ message: "guarantors is required" })
        const newLoan = new Loan({
            userId,
            category,
            subcategory,
            amount,
            loanPeriod,
            guarantors,
        });
        const savedLoan = await newLoan.save();
        res.status(201).json(savedLoan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating loan", error });
    }
};

// Get all loans (optionally filter by status)
export const getLoans = async (req, res) => {
    try {
        // const userRef = req.user
        // if (!userRef) return res.status(400).json({ message: "login first" })
        const userLoanDetails = await Loan.find({});
        if (userLoanDetails.length === 0) {
            return res.status(404).json({ message: "No loans found" });
        }
        res.status(200).json({ message: "Fetched successfully", data: userLoanDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching loans", error });
    }
};

// Get loans by a specific user
// export const getLoansByUser = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Find loans for the specific user
//         const loans = await Loan.find({ userId }).populate('userId', 'name email');
//         res.status(200).json(loans);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching loans for user", error });
//     }
// };

// // Update loan status (Admin only)
// export const updateLoanStatus = async (req, res) => {
//     try {
//         const { loanId } = req.params;
//         const { status } = req.body;

//         // Validate status value
//         if (!["Pending", "Approved", "Rejected"].includes(status)) {
//             return res.status(400).json({ message: "Invalid status value" });
//         }

//         // Find and update the loan status
//         const updatedLoan = await Loan.findByIdAndUpdate(
//             loanId,
//             { status },
//             { new: true } // Return the updated loan
//         );

//         if (!updatedLoan) {
//             return res.status(404).json({ message: "Loan not found" });
//         }

//         res.status(200).json(updatedLoan);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error updating loan status", error });
//     }
// };

// Delete a loan (optional, for admins)
// export const deleteLoan = async (req, res) => {
//     try {
//         const { loanId } = req.params;

//         // Delete the loan by ID
//         const deletedLoan = await Loan.findByIdAndDelete(loanId);

//         if (!deletedLoan) {
//             return res.status(404).json({ message: "Loan not found" });
//         }

//         res.status(200).json({ message: "Loan deleted successfully", deletedLoan });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error deleting loan", error });
//     }
// };

