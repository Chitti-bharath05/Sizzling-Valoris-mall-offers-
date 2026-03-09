const schemas = require('../utils/schemas');

const validateRequest = (schemaName) => {
    return (req, res, next) => {
        if (!schemas[schemaName]) {
            return res.status(500).json({ 
                success: false, 
                message: `Schema '${schemaName}' not found` 
            });
        }

        const { error } = schemas[schemaName].validate(req.body, { 
            abortEarly: false, // Return all errors, not just the first one
            allowUnknown: true // Allow extra fields to prevent breaking changes
        });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            console.log(`Validation failed for ${schemaName}:`, errorMessages);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error', 
                errors: errorMessages 
            });
        }

        next();
    };
};

module.exports = validateRequest;
