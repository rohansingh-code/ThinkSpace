import Note from "../models/Note.js";

export const getAllNotes = async (req,res) =>{
    try {
        const notes =  await Note.find().sort({createdAt:-1});
        res.status(200).json(notes); 
    } catch (error) {
        console.error("Error in getAllNotes method",error);
        res.status(500).json({message:"Internal server error"});
        
    }
};
export const getNoteById = async (req,res) =>{
    try {
        const note =  await Note.findById(req.params.id);
        res.status(200).json(note); 
    } catch (error) {
        console.error("Error in getNoteById method",error);
        res.status(500).json({message:"Internal server error"});
        
    }
};
export const createNote = async (req,res) =>{
    try {
       const {title,content} = req.body;
       console.log(title,content);
       const note = new Note({title,content});

       const savedNote = await note.save();
       res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote method",error);
        res.status(500).json({message:"Internal server error"});        
    }
    
};
export const updateNote = async (req,res) =>{
    try {
        const {title,content} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id,{
            title,
            content
        },{new:true});
        if(!updatedNote){
            res.status(404).json({message:"note not found"});
        }
        res.status(200).json({message:"Note updated succesfully!"});
    } catch (error) {
        console.error("Error in updateNote method",error);
        res.status(500).json({message:"Internal server error"});          
    }
};
export const deleteNote = async (req,res) =>{
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if(!deletedNote){
            res.status(404).json({message:"note not found"});
        }else{
             res.status(200).json({message:"Note deleted succesfully!"});
        }
    } catch (error) {
        console.error("Error in deleteNote method",error);
        res.status(500).json({message:"Internal server error"});         
    }
    
};
