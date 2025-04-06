const dns = require('dns');

const validateRegex = (emailID) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailID);
}

const validateDomain = (emailID) => {
    const domain = emailID.split('@')[1];
    return new Promise((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err || addresses.length === 0) {
                return resolve(false); // Invalid domain or no MX records found
            }
            resolve(true); // Valid domain with MX records
        })
    })
}

exports.validateEmail = (email) => {
    const isValidRegex = validateRegex(email);
    if(!isValidRegex){
        return false;
    }
    const isValidDomain = validateDomain(email);
    return isValidDomain;

};
exports.validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
};