import Joi from 'joi';

export const validateCourse = (course) => {
    console.log('=== Course Validation ===');
    console.log('Input:', JSON.stringify(course, null, 2));

    const schema = Joi.object({
        title: Joi.string()
            .required()
            .min(1)
            .trim()
            .messages({
                'string.min': 'Title must not be empty',
                'string.empty': 'Title is required',
                'any.required': 'Title is required'
            }),
            
        description: Joi.string()
            .required()
            .min(1)
            .trim()
            .messages({
                'string.min': 'Description must not be empty',
                'string.empty': 'Description is required',
                'any.required': 'Description is required'
            }),
            
        content: Joi.array()
            .items(
                Joi.object({
                    type: Joi.string()
                        .valid('text', 'video', 'document')
                        .required(),
                    data: Joi.alternatives()
                        .try(
                            Joi.string(),
                            Joi.object().unknown(true)
                        )
                })
            )
            .optional()
            .default([]),
            
        enrollmentStatus: Joi.string()
            .valid('open', 'closed', 'draft')
            .default('draft')
    });

    const result = schema.validate(course, { 
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true
    });
    
    console.log('Validation result:', {
        error: result.error?.details,
        value: result.value
    });

    return result;
}; 