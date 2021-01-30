const request = require('supertest');
const app = require('../src');

describe('Get Profile', () => {
  it('should get profile information', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'My Rule-Validation API');
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data', {
      name: 'Edet Titilope Samuel',
      github: '@opsz2',
      email: 'titilopz2@gmail.com',
      mobile: '08179020025',
      twitter: '@titilopeedet',
    });
  });
});

describe('Validate Rule', () => {
  it('should return an error response if rule or data field is missing', async () => {
    const res = await request(app)
      .post('/validate-rule')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('data', null);
    expect(res.body).toHaveProperty('message', 'rule is required.');
  });

  it('should return an error response if rule or data field has a wrong type', async () => {
    const res = await request(app)
      .post('/validate-rule')
      .send({ rule: '' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('data', null);
    expect(res.body).toHaveProperty('message', 'rule should be an object.');
  });

  it('should return an error response if field specified in the rule object is missing ', async () => {
    const res = await request(app)
      .post('/validate-rule')
      .send({
        rule: {
          field: 'missions',
          condition: 'gte',
          condition_value: 30,
        },
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
        },
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('data', null);
    expect(res.body).toHaveProperty(
      'message',
      'field missions is missing from data.',
    );
  });

  it('should successfully validate data based on rule', async () => {
    const res = await request(app)
      .post('/validate-rule')
      .send({
        rule: {
          field: 'missions',
          condition: 'gte',
          condition_value: 30,
        },
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
          missions: 45,
        },
      });

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty(
      'message',
      'field missions successfully validated.',
    );
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data', {
      validation: {
        error: false,
        field: 'missions',
        field_value: 45,
        condition: 'gte',
        condition_value: 30,
      },
    });
  });

  it('should fail if validation rule is not met', async () => {
    const res = await request(app)
      .post('/validate-rule')
      .send({
        rule: {
          field: 'missions',
          condition: 'gte',
          condition_value: 54,
        },
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
          missions: 30,
        },
      });

    expect(res.statusCode).toEqual(400);

    expect(res.body).toHaveProperty(
      'message',
      'field missions failed validation.',
    );
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('data', {
      validation: {
        error: true,
        field: 'missions',
        field_value: 30,
        condition: 'gte',
        condition_value: 54,
      },
    });
  });

  it('should successfully validate data based on nested field', async () => {
    const res = await request(app)
      .post('/validate-rule')
      .send({
        rule: {
          field: 'missions.count',
          condition: 'gte',
          condition_value: 30,
        },
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
          missions: {
            count: 45,
            successful: 44,
            failed: 1,
          },
        },
      });

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty(
      'message',
      'field missions.count successfully validated.',
    );
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data', {
      validation: {
        error: false,
        field: 'missions.count',
        field_value: 45,
        condition: 'gte',
        condition_value: 30,
      },
    });
  });
});
