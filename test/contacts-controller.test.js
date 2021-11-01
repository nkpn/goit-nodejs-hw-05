const { updateContact } = require('../controllers/contact');
const Contacts = require('../repository/contacts');
const { CustomError } = require('../helpers/customError');

jest.mock('../repository/Contacts');

describe('Unit test controller updateContact', () => {
  let req, res, next;

  beforeEach(() => {
    Contacts.updateContact = jest.fn();
    req = { params: { id: 3 }, body: {}, user: { _id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(data => data),
    };
    next = jest.fn(); // () => {}
  });

  it('Contacts exist', async () => {
    const Contacts = { id: 3, name: 'Simon', age: 4 };
    Contacts.updateContact = jest.fn(() => {
      return contact;
    });
    const result = await updateContact(req, res, next);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('data');
    expect(result.data.contact).toEqual(contact);
  });

  it('Contact not exist v.1.0', async () => {
    await expect(updateContact(req, res, next)).rejects.toEqual(
      new CustomError(404, 'Not Found'),
    );
  });

  it('Contacts not exist v.1.1', () => {
    return updateContact(req, res, next).catch(e => {
      expect(e.status).toEqual(404);
      expect(e.message).toEqual('Not Found');
    });
  });
});
