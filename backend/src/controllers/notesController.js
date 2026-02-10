import Note from "../models/Note.js";

export const getAllNotes = async (req,res) =>{
    try {
        const notes =  await Note.find({user : req.user._id}).sort({createdAt:-1});
        return res.status(200).json(notes); 
    } catch (error) {
        console.error("Error in getAllNotes method",error);
        return res.status(500).json({message:"Internal server error"});
        
    }
};
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,   
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById method", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createNote = async (req,res) =>{
    try {
       const {title,content} = req.body;
       console.log(title,content);
       const note = await Note.create({
            title,
            content,
            user: req.user._id, // linking note with user
        });

       res.status(201).json(note);
    } catch (error) {
        console.error("Error in createNote method",error);
        res.status(500).json({message:"Internal server error"});        
    }  
};
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.user._id 
      },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "note not found" });
    }

    return res.status(200).json({ message: "Note updated succesfully!" });
  } catch (error) {
    console.error("Error in updateNote method", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "note not found" });
    }

    return res.status(200).json({ message: "Note deleted succesfully!" });
  } catch (error) {
    console.error("Error in deleteNote method", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
