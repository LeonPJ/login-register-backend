import Joi from 'joi';

export const registerValidation = (event: any) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
    });
    return schema.validate(event);
}

export const loginValidation = (event: any) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
    });
    return schema.validate(event);
}

export const newPasswordValidation = (event: any) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
        newPassword: Joi.string()
            .min(6)
            .required(),
        confirmNewPassword: Joi.string()
            .min(6)
            .required(),
    });
    return schema.validate(event);
}

export const forgotPasswordValidation = (event: any) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
    });
    return schema.validate(event);
}