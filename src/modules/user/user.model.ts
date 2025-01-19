import mongoose from 'mongoose';
import { WellKnownStatus } from '../../util/enums/well-known-status.enum';

const userSchema = new mongoose.Schema(
    {
        // General Information
        nicNumber: {
            type: String,
            maxlength: [20, 'NIC Number cannot be more than 20 characters'],
            required: [true, 'NIC Number is required'],
        },

        customerCode: {
            type: String,
            maxlength: [20, 'Customer Code cannot be more than 20 characters'],
        },

        titleId: {
            type: Number,
            required: [true, 'Title is required'],
        },

        title: {
            type: String,
            maxlength: [20, 'Title cannot be more than 20 characters'],
            required: [true, 'Title is required'],
        },

        fullName: {
            type: String,
            maxlength: [100, 'Full Name cannot be more than 100 characters'],
            required: [true, 'Full Name is required'],
        },

        Initial: {
            type: String,
            maxlength: [50, 'Initial cannot be more than 50 characters'],
            required: [true, 'Initial is required'],
        },

        firstName: {
            type: String,
            maxlength: [200, 'First Name cannot be more than 200 characters'],
            required: [true, 'First Name is required'],
        },

        lastName: {
            type: String,
            maxlength: [200, 'Last Name cannot be more than 200 characters'],
            required: [true, 'Last Name is required'],
        },

        dateOfBirth: {
            type: Date,
            required: [true, 'Date of Birth is required'],
        },

        age: {
            type: Number,
            required: [true, 'Age is required'],
        },

        genderId: {
            type: Number,
            required: [true, 'Gender is required'],
        },

        gender: {
            type: String,
            maxlength: [20, 'Gender cannot be more than 20 characters'],
            required: [true, 'Gender is required'],
        },

        civilStatusId: {
            type: Number,
            required: [true, 'Civil Status is required'],
        },

        civilStatus: {
            type: String,
            maxlength: [20, 'Civil Status cannot be more than 20 characters'],
            required: [true, 'Civil Status is required'],
        },

        occupation: {
            type: String,
            maxlength: [200, 'Occupation cannot be more than 200 characters'],
            required: [true, 'Occupation is required'],
        },

        mobileNo1: {
            type: String,
            maxlength: [20, 'Mobile No 1 cannot be more than 20 characters'],
            required: [true, 'Mobile No 1 is required'],
        },

        mobileNo2: {
            type: String,
            maxlength: [20, 'Mobile No 2 cannot be more than 20 characters'],
        },

        residenceNo: {
            type: String,
            maxlength: [20, 'Residence No cannot be more than 20 characters'],
        },

        email: {
            type: String,
            maxlength: [100, 'Email cannot be more than 100 characters'],
            validate: {
                validator: (value: string) => {
                    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        value
                    );
                },
                message: (props: any) => `${props.value} is not a valid email`,
            },
        },

        addresses: [
            {
                addressTypeId: {
                    type: Number,
                    required: [true, 'Address Type is required'],
                },

                addressType: {
                    type: String,
                    maxlength: [
                        100,
                        'Address Type cannot be more than 100 characters',
                    ],
                    required: [true, 'Address Type is required'],
                },

                line1: {
                    type: String,
                    maxlength: [
                        200,
                        'Address Line 1 cannot be more than 200 characters',
                    ],
                    required: [true, 'Address Line 1 is required'],
                },

                line2: {
                    type: String,
                    maxlength: [
                        200,
                        'Address Line 2 cannot be more than 200 characters',
                    ],
                    required: [true, 'Address Line 2 is required'],
                },

                line3: {
                    type: String,
                    maxlength: [
                        200,
                        'Address Line 2 cannot be more than 200 characters',
                    ],
                },
            },
        ],

        spouseDetails: {
            fullName: {
                type: String,
                maxlength: [
                    200,
                    'Spouse Full Name cannot be more than 200 characters',
                ],
            },

            nic: {
                type: String,
                maxlength: [20, 'Spouse NIC cannot be more than 20 characters'],
            },

            occupation: {
                type: String,
                maxlength: [
                    200,
                    'Spouse Occupation cannot be more than 200 characters',
                ],
            },

            income: {
                type: Number,
            },
        },

        familyInfos: [
            {
                relationshipId: {
                    type: Number,
                },

                relationship: {
                    type: String,
                    maxlength: [
                        100,
                        'Relationship cannot be more than 100 characters',
                    ],
                },

                fullName: {
                    type: String,
                    maxlength: [
                        300,
                        'Family Member Full Name cannot be more than 300 characters',
                    ],
                },

                nic: {
                    type: String,
                    maxlength: [
                        20,
                        'Family Member NIC cannot be more than 20 characters',
                    ],
                },
            },
        ],

        expensesDetails: {
            expenses: [
                {
                    expenseTypeId: {
                        type: Number,
                    },

                    expenseType: {
                        type: String,
                        maxlength: [
                            200,
                            'Expense Type cannot be more than 200 characters',
                        ],
                    },

                    amount: {
                        type: Number,
                    },
                },
            ],

            totalExpenses: {
                type: Number,
            },
        },

        incomeDetails: {
            incomes: [
                {
                    incomeTypeId: {
                        type: Number,
                    },

                    incomeType: {
                        type: String,
                        maxlength: [
                            200,
                            'Income Type cannot be more than 200 characters',
                        ],
                    },

                    totalIncomeamount: {
                        type: Number,
                    },
                },
            ],

            totalExpenses: {
                type: Number,
            },
        },

        // Identity Information
        nic: {
            type: String,
            maxlength: [20, 'NIC cannot be more than 20 characters'],
            required: [true, 'NIC is required'],
        },

        nicImageUrl: {
            type: String,
        },

        drivingLicenseUrl: {
            type: String,
        },

        businessRegistrationUrl: {
            type: String,
        },

        profileImageUrl: {
            type: String,
        },

        // Bank Account Information
        bankName: {
            type: String,
            maxlength: [100, 'Bank Name cannot be more than 100 characters'],
        },

        bankId: {
            type: Number,
            required: [true, 'Bank Id is required'],
        },

        branch: {
            type: String,
            maxlength: [100, 'Branch cannot be more than 100 characters'],
        },

        accountNumber: {
            type: String,
            maxlength: [50, 'Account Number cannot be more than 50 characters'],
        },

        role: {
            type: Number,
            required: [true, 'Role is required'],
        },

        specialNote: {
            type: String,
            maxlength: [500, 'Special Note cannot be more than 500 characters'],
        },

        // Information for Admin
        status: {
            type: Number,
            required: [true, 'Status is required'],
            default: WellKnownStatus.ACTIVE,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('User', userSchema);
