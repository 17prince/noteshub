const Notes = require("../models/noteModel");

exports.typeDefs = `

type Note {
    id : ID!,
    title : String!, 
    content : String, 
    createdAt : String
}

type Query {
    note(id: String!): Note,
    noteTitle(userId : String!, title : String!) : Note,
    notes: [Note], 
}


type Mutation{
  createNote(title : String!, content : String!) : Note!
  updateNote(id : ID!) : Note!
  deleteNote(id : ID!) : Note!

}
`;

exports.resolvers = {
  Query: {
    note: async (root, args) => {
      return await Notes.findById(args.id);
    },
    notes: async () => await Notes.find(),
    noteTitle: async (_, { title }) => {
      return await notes.find({ title });
    },
  },

  Mutation: {
    createNote: async (_, { title, content }) => {
      if (!title || !content) return "Empty field";

      const newNote = await Notes.create({
        title,
        content,
        createdAt: Date.now(),
      });

      return newNote;
    },

    updateNote: async (_, { id, title, content }) => {
      if (!title || !content) return "Empty field";

      let note = await Notes.findById(id);

      if (!note) return "Note with this ID not found";

      note.title = title;
      note.content = content;

      return note.save();
    },
  },
};
