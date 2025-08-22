import Bmw from '../models/bmw.model.js'

export const createBmw = async (req, res, next) => {
    try{
        const body = {...req.body, createdBy: req.user._id};

        if(!req.user.isAdmin && body.isOfficial === true){
            return res.status(403).json({success: false, error: 'Only admins can mark official models'});
        }

        const bmw = await Bmw.create(body);

        res.status(201).json({success: true, data: bmw});

        }
    catch (e) {
        next(e);
    }
}

export const updateBmw = async (req, res, next) => {
    try{
        if(!req.user.isAdmin && req.body.isOfficial === true){
            return res.status(403).json({success: false, error: 'Only admins can update official models'});
        }
        const updated = await Bmw.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true});
        if(!updated){
            const error = new Error('Bmw not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success:true, data:updated});

    }catch (e) {
        next(e);
    }
}

export const deleteBmw = async (req, res, next) => {
    try{
        if(!req.user.isAdmin && req.body.isOfficial === true){
            return res.status(403).json({success: false, error: 'Only admins can delete official models'});
        }
        const deleted = await Bmw.findByIdAndDelete(req.params.id);
        if(!deleted){
            const error = new Error('Bmw not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success:true, data:deleted});
    }catch (e) {
        next(e);
    }
}

