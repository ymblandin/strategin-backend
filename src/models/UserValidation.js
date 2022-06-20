const yup = require('yup');

const userSchema = yup.object({
  email: yup.string().email().required(),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Your password must be a minimum of eight characters and include at least one uppercase letter, one lowercase letter, one number and one special character.'
    )
    .required(),
});

module.exports = userSchema;
