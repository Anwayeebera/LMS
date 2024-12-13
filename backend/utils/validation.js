const Joi = require('joi');

exports.validateCourse = (course) => {
    const schema = Joi.object({
        title: Joi.string().required().min(3),
        description: Joi.string().required().min(10),
        category: Joi.string().required(),
        difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
        tags: Joi.array().items(Joi.string()),
    });

    return schema.validate(course);
}; 