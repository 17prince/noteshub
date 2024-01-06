const notes = require("../sample/notes");

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

`;

exports.resolvers = {
  Query: {
    note: (root, args) => {
      return notes.find((note) => (note.id === args.id ? note : null));
    },
    notes: () => notes,
    noteTitle: (_, { title }) => {
      return notes.find((note) => (note.title === args.title ? note : null));
    },
  },
};
