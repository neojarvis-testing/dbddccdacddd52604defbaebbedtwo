const { getUserByUsernameAndPassword, getAllUsers, addUser } = require("../controllers/userController");
const User = require("../models/userModel");
const { validateToken } = require('../authUtils');
const Mobile = require("../models/mobileModel");
const { getAllMobiles, getMobilesByUserId, deleteMobile, updateMobile, getMobileById, addMobile } = require("../controllers/mobileController");



describe('getUserByUsernameAndPassword', () => {
  test('getuserbyusernameandpassword_should_return_invalid_credentials_with_a_200_status_code', async () => {
    // Sample user credentials
    const userCredentials = {
      email: 'nonexistent@example.com',
      password: 'incorrect_password',
    };

    // Mock Express request and response objects
    const req = {
      body: userCredentials,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.findOne method to resolve with null (user not found)
    User.findOne = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await getUserByUsernameAndPassword(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
  });

  test('getuserbyusernameandpassword_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.findOne
    const error = new Error('Database error');

    // Sample user credentials
    const userCredentials = {
      email: 'john@example.com',
      password: 'password123',
    };

    // Mock Express request and response objects
    const req = {
      body: userCredentials,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.findOne method to reject with an error
    User.findOne = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await getUserByUsernameAndPassword(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('addUser', () => {
  test('adduser_should_add_user_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample user data
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'validpassword',
    };

    // Mock Express request and response objects
    const req = {
      body: userData,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.create method to resolve with the sample user data
    User.create = jest.fn().mockResolvedValue(userData);

    // Call the controller function
    await addUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
  });

  test('adduser_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.create
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.create method to reject with an error
    User.create = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await addUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getAllUsers', () => {
  test('getallusers_should_return_users_and_respond_with_a_200_status_code', async () => {
    // Sample user data
    const usersData = [
      {
        _id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '1234567890',
        email: 'john.doe@example.com',
        role: 'user',
        password: 'validpassword',
      },
      {
        _id: 'user2',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '1234567890',
        email: 'john.doe@example.com',
        role: 'user',
        password: 'validpassword',
      },
    ];

    // Mock Express request and response objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.find method to resolve with the sample user data
    User.find = jest.fn().mockResolvedValue(usersData);

    // Call the controller function
    await getAllUsers(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getallusers_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.find
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.find method to reject with an error
    User.find = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await getAllUsers(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});
describe('User Model Schema Validation', () => {
  test('user_model_should_validate_a_user_with_valid_data', async () => {
    const validUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'validpassword',
    };

    const user = new User(validUserData);

    // Validate the user data against the schema
    await expect(user.validate()).resolves.toBeUndefined();
  });

  test('user_model_should_validate_a_user_with_missing_required_fields', async () => {
    const invalidUserData = {
      // Missing required fields
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError();
  });

  test('user_model_should_validate_a_user_with_a_password_shorter_than_the_minimum_length', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'short',
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError();
  });

  test('user_model_should_validate_a_user_with_a password_longer_than_the_maximum_length', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'a'.repeat(256),
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError();
  });
});

describe('getAllMobiles', () => {
  test('getallmobiles_should_return_with_a_200_status_code', async () => {
    // Sample mobile data
    const mobileData = [
      {
        _id: 'mobile1',
        brand: 'Brand 1',
        model: 'Model 1',
        description: 'Mobile 1 description',
        mobilePrice: 1000,
        availableQuantity: 5,
        userId: 'user123',
      },
      {
        _id: 'mobile2',
        brand: 'Brand 2',
        model: 'Model 2',
        description: 'Mobile 2 description',
        mobilePrice: 2000,
        availableQuantity: 10,
        userId: 'user456',
      },
    ];

    // Mock Express request and response objects
    const req = {
      body: { sortValue: 1, searchValue: '' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.find method to resolve with the sample mobile data
    const mobileQuery = {
      sort: jest.fn().mockResolvedValue(mobileData),
      exec: jest.fn().mockResolvedValue(mobileData),
    };
    Mobile.find = jest.fn().mockReturnValue(mobileQuery);

    // Call the controller function
    await getAllMobiles(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getallmobiles_should_return_mobiles_and_respond_with_a_200_status_code', async () => {
      // Sample mobile data
      const mobileData = [
        {
          _id: 'mobile1',
          brand: 'Brand 1',
          model: 'Model 1',
          description: 'Mobile 1 description',
          mobilePrice: 1000,
          availableQuantity: 5,
          userId: 'user123',
        },
        {
          _id: 'mobile2',
          brand: 'Brand 2',
          model: 'Model 2',
          description: 'Mobile 2 description',
          mobilePrice: 2000,
          availableQuantity: 10,
          userId: 'user456',
        },
      ];

      // Mock Express request and response objects
      const req = {
        body: { sortValue: 1, searchValue: '' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Mobile.find method to resolve with the sample mobile data
      const mobileQuery = {
        sort: jest.fn().mockResolvedValue(mobileData),
      };
      Mobile.find = jest.fn().mockReturnValue(mobileQuery);

      // Call the controller function
      await getAllMobiles(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
    });

  test('getallmobiles_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Mobile.find
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {
      body: { sortValue: 1, searchValue: '' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.find method to reject with an error
    const mobileQuery = {
      sort: jest.fn().mockRejectedValue(error)
    };
    Mobile.find = jest.fn().mockReturnValue(mobileQuery);

    // Call the controller function
    await getAllMobiles(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});


describe('getMobilesByUserId', () => {
  test('getmobilesbyuserid_should_return_mobiles_for_a_valid_user_id_and_respond_with_a_200_status_code', async () => {
    // Sample user ID and mobile data
    const userId = 'user123';
    const mobileData = [
      {
        _id: 'mobile1',
        brand: 'Brand 1',
        model: 'Model 1',
        description: 'Mobile 1 description',
        mobilePrice: 1000,
        availableQuantity: 5,
        userId: 'user123',
      },
      {
        _id: 'mobile2',
        brand: 'Brand 2',
        model: 'Model 2',
        description: 'Mobile 2 description',
        mobilePrice: 2000,
        availableQuantity: 10,
        userId: 'user123',
      },
    ];

    // Mock Express request and response objects
    const req = {
      body: { userId, sortValue: 1, searchValue: '' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.find method to resolve with a query
    const mobileQuery = {
      sort: jest.fn().mockResolvedValue(mobileData), // Mocking the sort function
    };
    Mobile.find = jest.fn().mockReturnValue(mobileQuery);

    // Call the controller function
    await getMobilesByUserId(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getmobilesbyuserid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Mobile.find
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {
      body: { userId: 'user123', sortValue: 1, searchValue: '' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.find method to resolve with a query
    const mobileQuery = {
      sort: jest.fn().mockRejectedValue(error), // Mocking the sort function with error
    };
    Mobile.find = jest.fn().mockReturnValue(mobileQuery);

    // Call the controller function
    await getMobilesByUserId(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('deleteMobile', () => {
  test('deletemobile_should_delete_a_mobile_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample mobile ID to be deleted
    const mobileId = 'mobile123';

    // Mock Express request and response objects
    const req = { params: { id: mobileId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.findByIdAndDelete method to resolve with the deleted mobile data
    Mobile.findByIdAndDelete = jest.fn().mockResolvedValue({
      _id: mobileId,
      brand: 'Deleted Mobile',
      model: 'Model 1',
      description: 'Mobile 1 description',
      mobilePrice: 1000,
      availableQuantity: 5,
      userId: 'user123',
    });

    // Call the controller function
    await deleteMobile(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mobile deleted successfully' });
  });

  test('deletemobile_should_handle_not_finding_a_mobile_and_respond_with_a_404_status_code', async () => {
    // Mock Express request and response objects
    const req = { params: { id: 'nonExistentMobile' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.findByIdAndDelete method to resolve with null (mobile not found)
    Mobile.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await deleteMobile(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mobile not found' });
  });

  test('deletemobile_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Mobile.findByIdAndDelete
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = { params: { id: 'mobile123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.findByIdAndDelete method to reject with an error
    Mobile.findByIdAndDelete = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await deleteMobile(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('updateMobile', () => {
  test('updatemobile_should_update_a_mobile_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample mobile ID and updated mobile data
    const mobileId = 'mobile123';
    const updatedMobileData = {
      brand: 'Updated Brand',
      model: 'Updated Model',
      description: 'Updated mobile description',
      mobilePrice: 1500,
      availableQuantity: 10,
      userId: 'user789',
    };

    // Mock Express request and response objects
    const req = { params: { id: mobileId }, body: updatedMobileData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.findByIdAndUpdate method to resolve with the updated mobile data
    Mobile.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMobileData);

    // Call the controller function
    await updateMobile(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mobile updated successfully' });
  });

  test('updatemobile_should_handle_not_finding_a_mobile_and_respond_with_a_404_status_code', async () => {
    // Mock Express request and response objects
    const req = { params: { id: 'nonExistentMobile' }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.findByIdAndUpdate method to resolve with null (mobile not found)
    Mobile.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await updateMobile(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mobile not found' });
  });

  test('updatemobile_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Mobile.findByIdAndUpdate
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = { params: { id: 'mobile123' }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Mobile.findByIdAndUpdate method to reject with an error
    Mobile.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await updateMobile(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getMobileById', () => {
  test('getmobilebyid_should_return_a_mobile_with_a_200_status_code', async () => {
    // Sample mobile ID and corresponding mobile
    const mobileId = 'mobile123';
    const mobileData = {
      _id: mobileId,
      brand: 'Sample Mobile',
      model: 'Model 1',
      description: 'Sample mobile description',
      mobilePrice: 1000,
      availableQuantity: 5,
      userId: 'user123',
    };

    // Mock the Mobile.findById method to resolve with the sample mobile
    Mobile.findById = jest.fn().mockResolvedValue(mobileData);

    // Mock Express request and response objects
    const req = { params: { id: mobileId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await getMobileById(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getmobilebyid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Mobile.findById
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = { params: { id: 'mobile123' } };

    // Mock the Mobile.findById method to reject with an error
    Mobile.findById = jest.fn().mockRejectedValue(error);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await getMobileById(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});


describe('addMobile', () => {
  test('addmobile_should_add_a_mobile_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample mobile data to be added
    const mobileToAdd = {
      brand: 'New Mobile',
      model: 'Model 1',
      description: 'New mobile description',
      mobilePrice: 1000,
      availableQuantity: 5,
      userId: 'user789',
    };

    // Mock the Mobile.create method to resolve successfully
    Mobile.create = jest.fn().mockResolvedValue(mobileToAdd);

    // Mock Express request and response objects
    const req = { body: mobileToAdd };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await addMobile(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mobile added successfully' });
  });

  test('addmobile_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Mobile.create
    const error = new Error('Database error');

    // Mock the Mobile.create method to reject with an error
    Mobile.create = jest.fn().mockRejectedValue(error);

    // Mock Express request and response objects
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await addMobile(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});
describe('Mobile_Schema_Validation', () => {
  test('mobile_model_should_be_valid_mobile_with_correct_data', async () => {
    const validMobileData = {
      brand: 'Sample Mobile',
      model: 'Model 1',
      description: 'A sample mobile description.',
      mobilePrice: 1000,
      availableQuantity: 5,
      userId: 'user123',
    };

    const validMobile = new Mobile(validMobileData);

    await expect(validMobile.validate()).resolves.not.toThrow();
  });

  test('mobile_model_should_throw_validation_error_for_missing_required_fields', async () => {
    const mobileWithMissingFields = new Mobile({});

    await expect(mobileWithMissingFields.validate()).rejects.toThrow();
  });

  test('mobile_model_should_throw_validation_error_for_invalid_mobile_price', async () => {
    const mobileWithInvalidPrice = new Mobile({
      brand: 'Invalid Mobile',
      model: 'Model 2',
      description: 'An invalid mobile description.',
      mobilePrice: 'InvalidPrice',
      availableQuantity: 3,
      userId: 'user456',
    });

    await expect(mobileWithInvalidPrice.validate()).rejects.toThrow();
  });

});

describe('validateToken', () => {
  test('validatetoken_should_respond_with_400_status_and_error_message_if_invalid_token_is_provided', () => {
    // Mock the req, res, and next objects
    const req = {
      header: jest.fn().mockReturnValue('invalidToken'),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the validateToken function
    validateToken(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
  });

  test('validatetoken_should_respond_with_400_status_and_error_message_if_no_token_is_provided', () => {
    // Mock the req, res, and next objects
    const req = {
      header: jest.fn().mockReturnValue(null),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the validateToken function
    validateToken(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
  });
});