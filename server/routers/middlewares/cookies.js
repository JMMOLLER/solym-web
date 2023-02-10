const validateCookies = (req, res, next) => {
    if(!req.cookies['Symly'] || !req.cookies['selectedTrack']){
        return res.redirect('/');
    }
    return next();
}

const validateSolymCookie = (req, res, next) => {
    if(!req.cookies['Symly']){
        return res.redirect('/');
    }
    return next();
}

const cleanCookies = (req, res, next) => {
    if(req.cookies['Symly']){
        res.clearCookie('Symly');
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