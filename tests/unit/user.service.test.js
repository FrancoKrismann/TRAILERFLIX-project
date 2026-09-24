const userService = require('../../src/services/user.service');

describe('User Service', () => {
  it('debería crear un usuario', async () => {
    const user = await userService.create({ name: 'Juan', email: 'juan@test.com' });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Juan');
  });
});
