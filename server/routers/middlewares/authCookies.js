const validateCookies = (req, res, next) => {
    if(req.cookies['Solym'] && req.cookies['selectedTrack']){
        return next();
    }
    return res.status(403).json({ text:'No cookies', code: 403, returnTo: '/' });
}

const validateSolymCookie = (req, res, next) => {
    if(!req.cookies['Solym']){
        return res.status(403).json({ text:'No Solym cookie', code: 403, returnTo: '/' });
    }
    return next();
}

const cleanCookies = (req, res, next) => {
    if(req.cookies['Solym']){
        res.clearCookie('Solym');
    }if(req.cookies['selectedTrack']){
        res.clearCookie('selectedTrack');
    }
    return next();
}

module.exports = {
    cleanCookies,
    validateCookies, 
    validateSolymCookie, 
};