

const requireAdmin = (req, res, next) => {
    if(!req.user) return res.status(401).json({message: 'Unauthorized'});
    if(!req.user.isAdmin) return res.status(401).json({message: 'Unauthorized, admin only'});
    next();
}

export default requireAdmin;