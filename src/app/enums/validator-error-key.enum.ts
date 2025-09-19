
export enum ERROR_KEY {
    DECIMAL_ERROR = 'decimalError',
    NUMBER_MAX_LENGTH = 'maxlength',
    NUMBER_VALIDATION = 'numberValidation',
    DUPLICATE_ERROR = 'duplicateError',
    REQUIRED_LENGTH = 'requiredLength',
    ACTUAL_LENGTH = 'actualLength',
    REQUIRED = 'required',
    QUESTIONNAIRE_ERROR = 'questionnaireErr',
    SECTION_ERROR = 'sectionErr',
    QUESTION_ERROR = 'questionErr'
}

export const customErrors: any = {
    [ERROR_KEY.REQUIRED]: 'Required Field',
    [ERROR_KEY.DECIMAL_ERROR]: 'Please provide number only',
    [ERROR_KEY.NUMBER_MAX_LENGTH]: 'Max length exceed',
    [ERROR_KEY.NUMBER_VALIDATION]: 'Please provide number only',
    [ERROR_KEY.DUPLICATE_ERROR]: 'Please provide unique value',
    [ERROR_KEY.REQUIRED_LENGTH]: 'requiredLength',
    [ERROR_KEY.ACTUAL_LENGTH]: 'actualLength',
    [ERROR_KEY.QUESTIONNAIRE_ERROR]: 'Questionnaire is required',
    [ERROR_KEY.SECTION_ERROR]: 'Please add section',
    [ERROR_KEY.QUESTION_ERROR]: 'Please add question'
}
