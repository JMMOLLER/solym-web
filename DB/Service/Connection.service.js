const {args} = require('../../yargs');

module.exports = {
    getConnectionURI: () => {
        if(args.storage === 'atlas'){
            return process.env.MONGODB_URI;
        }else{
            return process.env.MONGODB_URI_LOCAL;
        }
    }
}