const { rejects } = require('assert');
const Expense = require('../models/expense');

const User = require('../models/user');

const userRoute = require('../routes/expense');

//const sequelize = require('../util/database');

const UserServices = require('../services/userservices');

const S3services = require('../services/S3services');

const DownloadedFile=require('../models/downloadfile');

const path = require('path');

const getExpenseForm = async (req, res) => {
    res.sendFile('index.html', { root: 'public/views' });
}


const downloadExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.find({userId:req.user._id});
       
        const stringifiedExpenses = JSON.stringify(expenses);

        const filename = `Expense${req.user._id}/${new Date()}.txt`;
        const fileUrl = await S3services.uploadToS3(stringifiedExpenses, filename);
        
        await DownloadedFile.create({
            fileUrl:fileUrl,
            createdAt:new Date(),
            userId:req.user._id
        });

        res.status(200).json({ fileUrl, success: true});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ fileUrl: '', success: false, err: err })
    }
}

const addExpense = async (req, res, next) => {
    try {
        //const t = await sequelize.transaction();

        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Expense.create({ amount: amount, description: description, category: category, userId: req.user._id });


        totalExpense = Number(req.user.totalExpenses) + Number(amount);

        
        await User.updateOne({_id:req.user._id},{totalExpenses:totalExpense});

        //await t.commit();

        res.status(201).json({ newExpenseDetails: data });

    } catch (err) {
        //await t.rollback();

        res.status(500).json({ error: err });
    }
}

const deleteExpense = async (req, res, next) => {
    //const t = await sequelize.transaction();
    console.log("Test");

    const expenseId = req.params.id;

    

    console.log("expenseId", expenseId)

    if(expenseId==undefined||expenseId==null||expenseId==''){
        console.log('Id is Missing');
        return res.status(400).json({message:"ID missing",success:false})
    }
    try {

        const expense = await Expense.findById(expenseId);

        console.log("expense", expense);

        const totalExpense = Number(req.user.totalExpenses) - Number(expense.amount);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found!' });
        }


        const numOfrows = await Expense.deleteOne({_id:expenseId, userId:req.user._id});


        if (numOfrows === 0) {
            return res.status(404).json({ success: false, message: 'Expense does not belong to the user' });
        }

        await User.updateOne({_id:req.user._id},{totalExpenses:totalExpense})

        //await t.commit();

        res.status(200).json({ message: 'Expense deleted successfully' });
    }
    catch (err) {
        //await t.rollback();
        console.log('Error deleting expense:', err);
        res.status(500).json({ error: err });
    }
};

const getExpenses = async (req, res, next) => {
    try {
        
        const check = req.user.ispremiumuser;
        const page = +req.query.page||1;
        const pageSize = +req.query.pageSize||10;

        const totalExpenses = await Expense.countDocuments({ userId: req.user._id });

          // Retrieve expenses with pagination
        const data = await Expense.find({ userId: req.user._id })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort({ _id: -1 });


        res.status(200).json({
           allExpenses: data,
           check,
           currentPage: page,
           hasNextPage: pageSize * page < totalExpenses,
           nextPage: page + 1,
           hasPreviousPage: page > 1,
           previousPage: page - 1,
           lastPage: Math.ceil(totalExpenses / pageSize) 
        })

    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: err });
    }
}


module.exports = {
    getExpenseForm,
    addExpense,
    deleteExpense,
    getExpenses,
    downloadExpense
}